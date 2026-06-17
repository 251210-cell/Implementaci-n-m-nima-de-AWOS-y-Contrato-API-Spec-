import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/user.controller';

export async function GET(req: NextRequest) {
  return UserController.getUsers(req);
}