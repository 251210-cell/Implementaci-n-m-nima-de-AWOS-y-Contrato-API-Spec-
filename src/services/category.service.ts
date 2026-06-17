import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryInput, Category } from '../models/types';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async listCategories(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    return await this.categoryRepository.create(data);
  }
}
