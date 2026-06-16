import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput, User } from '../models/types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async listUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async registerUser(data: CreateUserInput): Promise<User> {
    // Regla de negocio: El email debe ser único
    const exists = await this.userRepository.findByEmail(data.email);
    if (exists) {
      throw new Error("El email ya se encuentra registrado.");
    }
    
    return await this.userRepository.create(data);
  }
}