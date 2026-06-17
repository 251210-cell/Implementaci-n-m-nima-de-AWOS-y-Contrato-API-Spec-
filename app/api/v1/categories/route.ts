import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/category.controller';

export async function GET(req: NextRequest) {
  return CategoryController.getCategories(req);
}

export async function POST(req: NextRequest) {
  return CategoryController.createCategory(req);
}