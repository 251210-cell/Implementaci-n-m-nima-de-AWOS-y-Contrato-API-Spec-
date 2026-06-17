import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/category.controller';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  return CategoryController.getProductsByCategory(req, id);
}