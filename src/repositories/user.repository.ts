import { User, CreateUserInput } from '../models/types';
import crypto from 'crypto';

// Tabla en memoria (simulación de BD)
const usersTable: User[] = [
  {
    id: crypto.randomUUID(),
    nombre: 'Admin Inicial',
    email: 'admin@correo.com',
    password_hash: '$2b$10$falsa_password_encriptada',
    rol: 'admin',
    activo: true,
    telefono: '+52 961 100 0000',
    created_at: new Date('2026-03-05T09:30:00Z'),
  },
  {
    id: crypto.randomUUID(),
    nombre: 'Karla Cruz',
    email: 'karla@ejemplo.com',
    password_hash: '$2b$10$falsa_password_encriptada2',
    rol: 'cliente',
    activo: true,
    telefono: '+52 961 100 0001',
    created_at: new Date('2026-05-27T22:00:00Z'),
  },
];

export class UserRepository {
  async getAll(): Promise<User[]> {
    return usersTable;
  }

  async findById(id: string): Promise<User | undefined> {
    return usersTable.find((u) => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return usersTable.find((u) => u.email === email);
  }

  async create(data: CreateUserInput): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date(),
    };
    usersTable.push(newUser);
    return newUser;
  }

  async update(id: string, fields: Partial<Pick<User, 'nombre' | 'email' | 'telefono'>>): Promise<User | undefined> {
    const idx = usersTable.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    usersTable[idx] = { ...usersTable[idx], ...fields };
    return usersTable[idx];
  }
}