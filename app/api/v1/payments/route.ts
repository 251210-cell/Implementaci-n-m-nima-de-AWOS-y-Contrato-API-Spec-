import { NextRequest } from 'next/server';
import { PaymentController } from '@/controllers/payment.controller';

export async function GET(req: NextRequest) {
  return PaymentController.getPayments(req);
}

export async function POST(req: NextRequest) {
  return PaymentController.createPayment(req);
}