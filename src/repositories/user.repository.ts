import { User, CreateUserInput } from '../models/types';
import crypto from 'crypto';


const usersTable: User[] = [
  {
    id: crypto.randomUUID(),
    nombre: "Admin Inicial",
    email: "admin@correo.com",
    password_hash: "$2b$10$falsa_password_encriptada",
    rol: "admin",
    activo: true,
    telefono: "123456789",
    created_at: new Date()
  }
];

export class UserRepository {
  async getAll(): Promise<User[]> {
    return usersTable;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return usersTable.find(u => u.email === email);
  }

  async create(data: CreateUserInput): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date()
    };
    usersTable.push(newUser);
    return newUser;
  }
}