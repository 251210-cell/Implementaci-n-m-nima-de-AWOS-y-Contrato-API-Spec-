import { NextResponse } from 'next/server';
import { ApiResponse, PaginationMeta, ApiError } from '../models/types';


// Respuestas exitosas


export function ok<T>(data: T, meta?: PaginationMeta, status = 200): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    data,
    meta: meta ?? null,
    error: null,
  };
  return NextResponse.json(body, { status });
}

export function created<T>(data: T): NextResponse {
  return ok(data, undefined, 201);
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// Respuestas de error


function error(
  status: number,
  code: string,
  message: string,
  details?: ApiError['details'],
): NextResponse {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    meta: null,
    error: { code: String(status), message, details },
  };
  return NextResponse.json(body, { status });
}

export const badRequest = (
  details?: ApiError['details'],
  message = 'BAD_REQUEST',
) => error(400, '400', message, details);

export const unauthorized = (
  message = 'UNAUTHORIZED',
) =>
  error(401, '401', message, [
    { issue: 'Se requiere autenticación para acceder a este recurso.' },
  ]);

export const forbidden = (message = 'FORBIDDEN') =>
  error(403, '403', message, [
    { issue: 'No tienes permiso para realizar esta acción.' },
  ]);

export const notFound = (field: string, issue: string) =>
  error(404, '404', 'NOT_FOUND', [{ field, issue }]);

export const conflict = (field: string, issue: string) =>
  error(409, '409', 'CONFLICT', [{ field, issue }]);

export const unprocessable = (details: ApiError['details']) =>
  error(422, '422', 'UNPROCESSABLE_ENTITY', details);

export const serverError = (message = 'INTERNAL_SERVER_ERROR') =>
  error(500, '500', message);

//  Parseo de query params de paginación


const SORT_FIELDS_ALLOWED = ['nombre', 'created_at', 'monto'];

export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  errors: Array<{ field: string; issue: string }>;
} {
  const errors: Array<{ field: string; issue: string }> = [];

  const rawPage = Number(searchParams.get('page') ?? 1);
  const rawLimit = Number(searchParams.get('limit') ?? 10);
  const sort = searchParams.get('sort') ?? undefined;
  const rawOrder = searchParams.get('order') ?? 'asc';
  const search = searchParams.get('search') ?? undefined;

  const page = isNaN(rawPage) ? 1 : rawPage;
  const limit = isNaN(rawLimit) ? 10 : rawLimit;

  if (page < 1)
    errors.push({ field: 'page', issue: 'El valor mínimo permitido es 1.' });

  if (limit > 50)
    errors.push({ field: 'limit', issue: 'El valor máximo permitido es 50.' });

  if (sort && !SORT_FIELDS_ALLOWED.includes(sort))
    errors.push({
      field: 'sort',
      issue: `Valor no permitido. Use: ${SORT_FIELDS_ALLOWED.join(', ')}.`,
    });

  const order: 'asc' | 'desc' =
    rawOrder === 'desc' ? 'desc' : 'asc';

  return { page, limit, sort, order, search, errors };
}