import { NextResponse } from 'next/server';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export class CategoryController {
  static async getCategories() {
    try {
      const categories = await categoryService.listCategories();
      return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  static async createCategory(request: Request) {
    try {
      const body = await request.json();

      if (!body.nombre) {
        return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
      }

      const newCategory = await categoryService.createCategory({
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        activo: body.activo !== undefined ? body.activo : true
      });

      return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}