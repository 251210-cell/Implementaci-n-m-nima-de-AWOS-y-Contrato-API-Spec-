import { NextRequest } from 'next/server';
import { AddressService } from '../services/address.service';
import {
  ok, created, noContent, badRequest, unauthorized, notFound, serverError,
  parsePagination,
} from '../lib/response';
import { getAuthUser, requireAuth } from '../lib/auth';

const addressService = new AddressService();

const REQUIRED_FIELDS = [
  'destinatario', 'telefono', 'calle', 'colonia',
  'ciudad', 'estado', 'codigo_postal', 'pais',
];

export class AddressController {

  // ── GET /api/v1/me/address  (autenticado) ────────────────────────────────
  static async getAddresses(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const { page, limit, search, errors } = parsePagination(req.nextUrl.searchParams);
      if (errors.length) return badRequest(errors);

      let addresses = await addressService.listAddresses(user!.id);

      if (search)
        addresses = addresses.filter(
          (a) =>
            a.ciudad.toLowerCase().includes(search.toLowerCase()) ||
            a.colonia.toLowerCase().includes(search.toLowerCase()) ||
            a.calle.toLowerCase().includes(search.toLowerCase()),
        );

      const total = addresses.length;
      const paginated = addresses.slice((page - 1) * limit, page * limit);

      return ok(paginated, { total, page, per_page: limit, search });
    } catch {
      return serverError();
    }
  }

  // ── GET /api/v1/me/address/{id}  (autenticado) ───────────────────────────
  static async getAddressById(req: NextRequest, id: string) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const address = await addressService.getAddressById(id);
      // RN-04: solo puede ver sus propias direcciones
      if (!address || address.user_id !== user!.id)
        return notFound('id', 'No existe una dirección con el ID proporcionado.');

      return ok(address);
    } catch {
      return serverError();
    }
  }

  // ── POST /api/v1/me/address  (autenticado) ───────────────────────────────
  static async createAddress(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const body = await req.json();
      const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
      if (missing.length)
        return badRequest(
          missing.map((f) => ({ field: f, issue: `El campo ${f} es obligatorio.` })),
        );

      const newAddress = await addressService.createAddress({
        user_id: user!.id,
        destinatario: body.destinatario,
        telefono: body.telefono,
        calle: body.calle,
        colonia: body.colonia,
        ciudad: body.ciudad,
        estado: body.estado,
        codigo_postal: body.codigo_postal,
        pais: body.pais,
        referencia: body.referencia ?? '',
      });

      return created(newAddress);
    } catch {
      return serverError();
    }
  }

  // ── DELETE /api/v1/me/address/{id}  (autenticado) ────────────────────────
  static async deleteAddress(req: NextRequest, id: string) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const deleted = await addressService.deleteAddress(id, user!.id);
      if (!deleted)
        return notFound('id', 'No existe una dirección con el ID proporcionado o no te pertenece.');

      // RN-06: eliminación física → 204 sin cuerpo
      return noContent();
    } catch {
      return serverError();
    }
  }
}