import { NextRequest } from 'next/server';
import { CategoryService } from '../services/category.service';
import {
  ok, created, noContent, badRequest, unauthorized, forbidden,
  notFound, conflict, unprocessable, serverError, parsePagination,
} from '../lib/response';
import { getAuthUser, requireAdmin } from '../lib/auth';

const categoryService = new CategoryService();

// Simulación de productos por categoría
const MOCK_PRODUCTS: Record<string, object[]> = {
  'c100-0001': [
    { id: 'prod-0301', nombre: 'Audífonos inalámbricos', categoria_id: 'c100-0001', precio: 799.00, stock: 15, activo: true },
    { id: 'prod-0302', nombre: 'Teclado mecánico', categoria_id: 'c100-0001', precio: 1200.00, stock: 8, activo: true },
  ],
  'c100-0002': [
    { id: 'prod-0401', nombre: 'Camiseta básica', categoria_id: 'c100-0002', precio: 150.00, stock: 50, activo: true },
  ],
};

export class CategoryController {

  // ── GET /api/v1/categories  (pública) ────────────────────────────────────
  static async getCategories(req: NextRequest) {
    try {
      const { page, limit, search, errors } = parsePagination(req.nextUrl.searchParams);
      if (errors.length) return badRequest(errors);

      let categories = await categoryService.listCategories();

      if (search)
        categories = categories.filter((c) =>
          c.nombre.toLowerCase().includes(search.toLowerCase()) ||
          c.descripcion.toLowerCase().includes(search.toLowerCase()),
        );

      const total = categories.length;
      const paginated = categories.slice((page - 1) * limit, page * limit);

      return ok(paginated, { total, page, per_page: limit, search });
    } catch {
      return serverError();
    }
  }

  // ── POST /api/v1/categories  (solo admin) ────────────────────────────────
  static async createCategory(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAdmin(user)) return forbidden();  // RN-02

      const body = await req.json();
      if (!body.nombre)
        return badRequest([{ field: 'nombre', issue: 'El nombre es obligatorio.' }]);

      const newCat = await categoryService.createCategory({
        nombre: body.nombre,
        descripcion: body.descripcion ?? '',
        activo: body.activo !== undefined ? body.activo : true,
      });

      return created(newCat);
    } catch (e: any) {
      if (e.message === 'CATEGORY_NAME_TAKEN')
        return conflict('nombre', 'Ya existe una categoría con ese nombre.');
      return serverError();
    }
  }

  // ── PATCH /api/v1/categories/{id}  (solo admin) ──────────────────────────
  static async updateCategory(req: NextRequest, id: string) {
    try {
      const user = await getAuthUser(req);
      if (!requireAdmin(user)) return forbidden();

      const body = await req.json();

      // RN-05: nombre no puede estar vacío
      if (body.nombre !== undefined && body.nombre.trim() === '')
        return unprocessable([{ field: 'nombre', issue: 'El nombre no puede estar vacío.' }]);

      const updated = await categoryService.updateCategory(id, body);
      if (!updated) return notFound('id', 'No existe una categoría con el ID proporcionado.');

      return ok(updated);
    } catch (e: any) {
      if (e.message === 'EMPTY_NAME')
        return unprocessable([{ field: 'nombre', issue: 'El nombre no puede estar vacío.' }]);
      return serverError();
    }
  }

  // ── DELETE /api/v1/categories/{id}  (solo admin) ─────────────────────────
  static async deleteCategory(req: NextRequest, id: string) {
    try {
      const user = await getAuthUser(req);
      if (!requireAdmin(user)) return forbidden();

      const deleted = await categoryService.deleteCategory(id);
      if (!deleted) return notFound('id', 'No existe una categoría con el ID proporcionado.');

      return noContent();
    } catch {
      return serverError();
    }
  }

  // ── GET /api/v1/categories/{id}/products  (pública) ──────────────────────
  static async getProductsByCategory(req: NextRequest, id: string) {
    try {
      const { page, limit, search, errors } = parsePagination(req.nextUrl.searchParams);
      if (errors.length) return badRequest(errors);

      const category = await categoryService.getCategoryById(id);
      if (!category)
        return notFound('id', 'No existe una categoría con el ID proporcionado.');

      let products = MOCK_PRODUCTS[id] ?? [];

      if (search)
        products = products.filter((p: any) =>
          p.nombre.toLowerCase().includes(search.toLowerCase()),
        );

      const total = products.length;
      const paginated = products.slice((page - 1) * limit, page * limit);

      return ok(paginated, { total, page, per_page: limit, search, categoria_id: id });
    } catch {
      return serverError();
    }
  }
}