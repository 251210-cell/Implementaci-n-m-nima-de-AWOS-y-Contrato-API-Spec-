import { NextRequest } from 'next/server';
import { User } from '../models/types';
import { UserRepository } from '../repositories/user.repository';


export async function getAuthUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const repo = new UserRepository();
  //el token es el email del usuario
  const user = await repo.findByEmail(token);
  if (!user || !user.activo) return null;  

  return user;
}

export function requireAuth(user: User | null) {
  return user !== null;
}

export function requireAdmin(user: User | null) {
  return user !== null && user.rol === 'admin';
}