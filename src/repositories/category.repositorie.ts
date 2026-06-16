import { Category, CreateCategoryInput } from '../models/types';
import crypto from 'crypto';

// Simulación
const categoriesTable: Category[] = [
  {
    id: crypto.randomUUID(),
    nombre: "Electrónica",
    descripcion: "Dispositivos tecnológicos",
    activo: true,
    created_at: new Date()
  }
];

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return categoriesTable;
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date()
    };
    categoriesTable.push(newCategory);
    return newCategory;
  }
}