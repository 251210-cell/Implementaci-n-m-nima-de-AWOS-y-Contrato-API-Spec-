import { UserController } from '@/controllers/user.controller';

// Maneja peticiones GET a http://localhost:3000/api/users
export async function GET() {
  return UserController.getUsers();
}

// Maneja peticiones POST a http://localhost:3000/api/users
export async function POST(request: Request) {
  return UserController.createUser(request);
}