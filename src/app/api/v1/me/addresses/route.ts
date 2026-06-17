import { NextRequest } from 'next/server';
import { AddressController } from '@/controllers/address.controller';

export async function GET(req: NextRequest) {
  return AddressController.getAddresses(req);
}

export async function POST(req: NextRequest) {
  return AddressController.createAddress(req);
}