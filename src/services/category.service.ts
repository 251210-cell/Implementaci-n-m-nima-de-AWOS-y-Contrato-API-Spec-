import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryInput, Category } from '../models/types';

export class CategoryService {
  private repo = new CategoryRepository();

  async listCategories(): Promise<Category[]> {
    return this.repo.getAll();
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.repo.findById(id);
  }

  /** RN-02 y RN-05: solo admins crean; nombre no duplicado */
  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const duplicate = await this.repo.findByNombre(data.nombre);
    if (duplicate) throw new Error('CATEGORY_NAME_TAKEN');
    return this.repo.create(data);
  }

  /** RN-05: nombre no puede quedar vacío */
  async updateCategory(
    id: string,
    fields: Partial<Pick<Category, 'nombre' | 'descripcion' | 'activo'>>,
  ): Promise<Category | undefined> {
    if (fields.nombre !== undefined && fields.nombre.trim() === '')
      throw new Error('EMPTY_NAME');
    return this.repo.update(id, fields);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}