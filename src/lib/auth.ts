import { NextRequest } from 'next/server';
import { User } from '../models/types';
import { UserRepository } from '../repositories/user.repository';

/**
 * Simulación de verificación JWT.
 * En producción aquí se verificaría el token con jsonwebtoken.
 *
 * Para pruebas, el cliente debe enviar:
 *   Authorization: Bearer <email-del-usuario>
 * (el "token" es simplemente el email del usuario en este mock)
 */
export async function getAuthUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const repo = new UserRepository();
  // Mock: el token es el email del usuario
  const user = await repo.findByEmail(token);
  if (!user || !user.activo) return null;  // RN-08

  return user;
}

export function requireAuth(user: User | null) {
  return user !== null;
}

export function requireAdmin(user: User | null) {
  return user !== null && user.rol === 'admin';
}