import { NextRequest } from 'next/server';
import { UserController } from '@/controllers/user.controller';

export async function GET(req: NextRequest) {
  return UserController.getMe(req);
}

export async function PATCH(req: NextRequest) {
  return UserController.updateMe(req);
}