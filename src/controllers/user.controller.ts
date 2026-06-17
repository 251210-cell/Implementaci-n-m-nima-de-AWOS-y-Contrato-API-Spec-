import { NextRequest } from 'next/server';
import { UserService } from '../services/user.service';
import {
  ok, created, badRequest, unauthorized, notFound, conflict, serverError,
  parsePagination,
} from '@/lib/response';
import { getAuthUser, requireAuth, requireAdmin } from '@/lib/auth';

const userService = new UserService();

export class UserController {

  // ── GET /api/v1/users  (solo admin) ──────────────────────────────────────
  static async getUsers(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAdmin(user)) return unauthorized();

      const { page, limit, sort, order, errors } = parsePagination(
        req.nextUrl.searchParams,
      );
      if (errors.length) return badRequest(errors);

      let users = await userService.listUsers();

      // Ordenar
      if (sort === 'nombre')
        users = users.sort((a, b) =>
          order === 'asc'
            ? a.nombre.localeCompare(b.nombre)
            : b.nombre.localeCompare(a.nombre),
        );
      else if (sort === 'created_at')
        users = users.sort((a, b) =>
          order === 'asc'
            ? a.created_at.getTime() - b.created_at.getTime()
            : b.created_at.getTime() - a.created_at.getTime(),
        );

      const total = users.length;
      const paginated = users.slice((page - 1) * limit, page * limit);
      // Nunca exponer password_hash
      const safeUsers = paginated.map(({ password_hash: _, ...u }) => u);

      return ok(safeUsers, { total, page, per_page: limit, sort, order });
    } catch {
      return serverError();
    }
  }

  // ── GET /api/v1/users/me ─────────────────────────────────────────────────
  static async getMe(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();
      const { password_hash: _, ...safe } = user!;
      return ok(safe);
    } catch {
      return serverError();
    }
  }

  // ── PATCH /api/v1/users/me ───────────────────────────────────────────────
  static async updateMe(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const body = await req.json();
      const { nombre, email, telefono } = body;
      const updated = await userService.updateUser(user!.id, { nombre, email, telefono });
      if (!updated) return notFound('id', 'Usuario no encontrado.');
      const { password_hash: _, ...safe } = updated;
      return ok(safe);
    } catch {
      return serverError();
    }
  }

  // ── POST /api/v1/auth/register  (pública) ────────────────────────────────
  static async register(req: NextRequest) {
    try {
      const body = await req.json();
      const { nombre, email, password_hash, telefono } = body;

      if (!nombre || !email || !password_hash)
        return badRequest([{ field: 'body', issue: 'nombre, email y password_hash son obligatorios.' }]);

      const newUser = await userService.registerUser({
        nombre,
        email,
        password_hash, // en producción se hashearía aquí con bcrypt
        rol: 'cliente',
        activo: true,
        telefono: telefono ?? '',
      });

      const { password_hash: _, ...safe } = newUser;
      return created(safe);
    } catch (e: any) {
      if (e.message === 'EMAIL_TAKEN')
        return conflict('email', 'El correo electrónico ya está registrado.');
      return serverError();
    }
  }

  // ── POST /api/v1/auth/login  (pública) ───────────────────────────────────
  static async login(req: NextRequest) {
    try {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password)
        return badRequest([{ field: 'body', issue: 'email y password son obligatorios.' }]);

      const user = await userService.login(email, password);
      const { password_hash: _, ...safe } = user;

      // Mock: devolvemos el email como "token"
      return ok({ token: email, user: safe });
    } catch (e: any) {
      if (e.message === 'INVALID_CREDENTIALS')
        return unauthorized('Credenciales inválidas.');
      return serverError();
    }
  }
}