import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput, User } from '../models/types';

export class UserService {
  private repo = new UserRepository();

  async listUsers(): Promise<User[]> {
    return this.repo.getAll();
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.repo.findById(id);
  }

  /** RN-01: el email debe ser único */
  async registerUser(data: CreateUserInput): Promise<User> {
    const exists = await this.repo.findByEmail(data.email);
    if (exists) throw new Error('EMAIL_TAKEN');
    return this.repo.create(data);
  }

  async updateUser(
    id: string,
    fields: Partial<Pick<User, 'nombre' | 'email' | 'telefono'>>,
  ): Promise<User | undefined> {
    return this.repo.update(id, fields);
  }

  /** Autenticación simulada (solo verifica que el usuario existe y está activo) */
  async login(email: string, _password: string): Promise<User> {
    const user = await this.repo.findByEmail(email);
    // RN-08: usuario inactivo no puede iniciar sesión
    if (!user || !user.activo) throw new Error('INVALID_CREDENTIALS');
    return user;
  }
}