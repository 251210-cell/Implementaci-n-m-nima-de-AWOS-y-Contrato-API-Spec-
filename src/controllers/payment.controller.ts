import { NextRequest } from 'next/server';
import { PaymentService } from '../services/payment.service';
import {
  ok, created, badRequest, unauthorized, notFound, serverError,
  parsePagination,
} from '../lib/response';
import { getAuthUser, requireAuth } from '../lib/auth';

const paymentService = new PaymentService();

export class PaymentController {

  // GET /api/v1/payments - AUTENTIFICADO
  static async getPayments(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const { page, limit, sort, order, errors } = parsePagination(
        req.nextUrl.searchParams,
      );
      if (errors.length) return badRequest(errors);

      let payments = await paymentService.listPayments();

      if (sort === 'monto')
        payments = payments.sort((a, b) =>
          order === 'asc' ? a.monto - b.monto : b.monto - a.monto,
        );
      else if (sort === 'created_at')
        payments = payments.sort((a, b) =>
          order === 'asc'
            ? a.created_at.getTime() - b.created_at.getTime()
            : b.created_at.getTime() - a.created_at.getTime(),
        );

      const total = payments.length;
      const paginated = payments.slice((page - 1) * limit, page * limit);

      return ok(paginated, { total, page, per_page: limit, sort, order });
    } catch {
      return serverError();
    }
  }

  // GET /api/v1/payments/{id} - AUTENTIFICADO
  static async getPaymentById(req: NextRequest, id: string) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const payment = await paymentService.getPaymentById(id);
      if (!payment) return notFound('id', 'No existe un pago con el ID proporcionado.');

      return ok(payment);
    } catch {
      return serverError();
    }
  }

  // POST /api/v1/payments - AUTENTIFICADO
  static async createPayment(req: NextRequest) {
    try {
      const user = await getAuthUser(req);
      if (!requireAuth(user)) return unauthorized();

      const body = await req.json();
      const { monto, metodo, order_id } = body;

      if (!monto || !metodo || !order_id)
        return badRequest([
          { field: 'body', issue: 'monto, metodo y order_id son obligatorios.' },
        ]);

      const payment = await paymentService.createPayment({ monto, metodo, order_id, estado: 'pendiente' });
      return created(payment);
    } catch (e: any) {
      if (e.message === 'MISSING_ORDER_ID' || e.message === 'INVALID_AMOUNT')
        return badRequest([{ field: 'body', issue: e.message }]);
      return serverError();
    }
  }
}
