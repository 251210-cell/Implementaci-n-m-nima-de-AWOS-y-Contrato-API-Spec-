import { Address, CreateAddressInput } from '../models/types';
import crypto from 'crypto';

const addressesTable: Address[] = [
  {
    id: 'adr-0010',
    user_id: 'seed-user-id',   
    destinatario: 'Karla Cruz',
    telefono: '+52 961 100 0001',
    calle: 'Av. Central 45',
    colonia: 'Centro',
    ciudad: 'Tuxtla Gutiérrez',
    estado: 'Chiapas',
    codigo_postal: '29000',
    pais: 'MX',
    referencia: 'Portón azul, entre calle 3 y calle 5.',
    created_at: new Date('2026-05-10T11:00:00Z'),
  },
];

export class AddressRepository {
  async getAllByUserId(userId: string): Promise<Address[]> {
    return addressesTable.filter((a) => a.user_id === userId);
  }

  async findById(id: string): Promise<Address | undefined> {
    return addressesTable.find((a) => a.id === id);
  }

  async create(data: CreateAddressInput): Promise<Address> {
    const newAddress: Address = {
      id: `adr-${crypto.randomUUID().slice(0, 8)}`,
      ...data,
      created_at: new Date(),
    };
    addressesTable.push(newAddress);
    return newAddress;
  }

  async delete(id: string): Promise<boolean> {
    const idx = addressesTable.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    addressesTable.splice(idx, 1);
    return true;
  }
}