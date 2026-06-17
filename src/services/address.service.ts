import { AddressRepository } from '../repositories/address.repository';
import { CreateAddressInput, Address } from '../models/types';

export class AddressService {
  private repo = new AddressRepository();

  async listAddresses(userId: string): Promise<Address[]> {
    return this.repo.getAllByUserId(userId);
  }

  async getAddressById(id: string): Promise<Address | undefined> {
    return this.repo.findById(id);
  }

  async createAddress(data: CreateAddressInput): Promise<Address> {
    return this.repo.create(data);
  }

  async deleteAddress(id: string, userId: string): Promise<boolean> {
    const address = await this.repo.findById(id);
    if (!address || address.user_id !== userId) return false;
    return this.repo.delete(id);
  }
}