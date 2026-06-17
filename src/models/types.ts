
//  Entidades 


export interface User {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: 'cliente' | 'admin';
  activo: boolean;
  telefono: string;
  created_at: Date;
}

export interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at: Date;
}

export interface Payment {
  id: string;
  order_id: string;
  monto: number;
  metodo: string;
  estado: string;
  created_at: Date;
}

export interface Address {
  id: string;
  user_id: string;
  destinatario: string;
  telefono: string;
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
  referencia: string;
  created_at: Date;
}


//  Inputs de creación se excluyen id y created_at


export type CreateUserInput = Omit<User, 'id' | 'created_at'>;
export type CreateCategoryInput = Omit<Category, 'id' | 'created_at'>;
export type CreatePaymentInput = Omit<Payment, 'id' | 'created_at'>;
export type CreateAddressInput = Omit<Address, 'id' | 'created_at'>;

// respuestas estandarizadas de la API

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  sort?: string;
  order?: string;
  search?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta: PaginationMeta | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field?: string; issue: string }>;
}


//  Query params de paginación


export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}