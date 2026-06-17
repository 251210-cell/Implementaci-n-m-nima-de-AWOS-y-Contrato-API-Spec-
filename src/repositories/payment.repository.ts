import { Payment, CreatePaymentInput } from '../models/types';
import {KARLA_ID} from './user.repository';
import crypto from 'crypto';

const paymentsTable: Payment[] = [
  {
    id: 'pay-0010',
    user_id: KARLA_ID,
    order_id: 'ord-0055',
    monto: 249.99,
    metodo: 'tarjeta',
    estado: 'completado',
    created_at: new Date('2026-04-15T14:00:00Z'),
  },
  {
    id: 'pay-0025',
    user_id: 'seed-user-id',
    order_id: 'ord-0072',
    monto: 1299.99,
    metodo: 'transferencia',
    estado: 'completado',
    created_at: new Date('2026-05-01T10:30:00Z'),
  },
];

export class PaymentRepository {
  async getAll(): Promise<Payment[]> {
    return paymentsTable;
  }

  async findById(id: string): Promise<Payment | undefined> {
    return paymentsTable.find((p) => p.id === id);
  }

  async create(data: CreatePaymentInput): Promise<Payment> {
    const newPayment: Payment = {
      id: `pay-${crypto.randomUUID().slice(0, 8)}`,
      ...data,
      created_at: new Date(),
    };
    paymentsTable.push(newPayment);
    return newPayment;
  }
}