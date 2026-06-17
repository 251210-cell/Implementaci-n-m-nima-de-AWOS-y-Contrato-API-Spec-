import { NextRequest } from 'next/server';
import { PaymentController } from '@/controllers/payment.controller';

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

  return PaymentController.getPaymentById(req, id);
}