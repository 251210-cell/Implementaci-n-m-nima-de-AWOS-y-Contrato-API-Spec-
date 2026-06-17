import { NextRequest } from 'next/server';
import { AddressController } from '@/controllers/address.controller';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;

  return AddressController.getAddressById(req, id);
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;

  return AddressController.deleteAddress(req, id);
}