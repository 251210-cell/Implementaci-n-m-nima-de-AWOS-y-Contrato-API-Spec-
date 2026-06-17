import { Category, CreateCategoryInput } from '../models/types';
import crypto from 'crypto';

const categoriesTable: Category[] = [
  {
    id: 'c100-0001',
    nombre: 'Electrónica',
    descripcion: 'Dispositivos y accesorios electrónicos.',
    activo: true,
    created_at: new Date('2026-01-10T08:00:00Z'),
  },
  {
    id: 'c100-0002',
    nombre: 'Ropa',
    descripcion: 'Prendas de vestir para toda la familia.',
    activo: true,
    created_at: new Date('2026-02-01T10:00:00Z'),
  },
];

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return categoriesTable;
  }

  async findById(id: string): Promise<Category | undefined> {
    return categoriesTable.find((c) => c.id === id);
  }

  async findByNombre(nombre: string): Promise<Category | undefined> {
    return categoriesTable.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
    );
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date(),
    };
    categoriesTable.push(newCategory);
    return newCategory;
  }

  async update(
    id: string,
    fields: Partial<Pick<Category, 'nombre' | 'descripcion' | 'activo'>>,
  ): Promise<Category | undefined> {
    const idx = categoriesTable.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    categoriesTable[idx] = { ...categoriesTable[idx], ...fields };
    return categoriesTable[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = categoriesTable.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    categoriesTable.splice(idx, 1);
    return true;
  }
}