import { PaymentRepository } from '../repositories/payment.repository';
import { CreatePaymentInput, Payment } from '../models/types';

export class PaymentService {
  private repo = new PaymentRepository();

  async listPayments(): Promise<Payment[]> {
    return this.repo.getAll();
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    return this.repo.findById(id);
  }

  /** RN-03: el monto debe coincidir con el total de la orden (simulado) */
  async createPayment(data: CreatePaymentInput): Promise<Payment> {
    // En producción aquí se consultaría el total real de la orden
    if (!data.order_id) throw new Error('MISSING_ORDER_ID');
    if (!data.monto || data.monto <= 0) throw new Error('INVALID_AMOUNT');
    return this.repo.create({ ...data, estado: 'pendiente' });
  }
}
