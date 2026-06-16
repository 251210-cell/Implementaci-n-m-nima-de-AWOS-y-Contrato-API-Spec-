import { NextResponse } from 'next/server';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  static async getUsers() {
    try {
      const users = await userService.listUsers();
      return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  static async createUser(request: Request) {
    try {
      const body = await request.json();
      
      // Validaciones básicas de presencia de datos
      if (!body.nombre || !body.email || !body.password_hash) {
        return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
      }

      const newUser = await userService.registerUser({
        nombre: body.nombre,
        email: body.email,
        password_hash: body.password_hash,
        rol: body.rol || 'user',
        activo: body.activo !== undefined ? body.activo : true,
        telefono: body.telefono || '',
      });

      return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}