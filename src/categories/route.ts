import { CategoryController } from '@/controllers/category.controller';

// Maneja peticiones GET a http://localhost:3000/api/categories
export async function GET() {
  return CategoryController.getCategories();
}

// Maneja peticiones POST a http://localhost:3000/api/categories
export async function POST(request: Request) {
  return CategoryController.createCategory(request);
}