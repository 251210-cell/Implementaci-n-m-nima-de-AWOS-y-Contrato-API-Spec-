export interface User {
  id: string; 
  nombre: string;
  email: string;
  password_hash: string;
  rol: string;
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
// omite el id y la fecha de creacion
export type CreateUserInput = Omit<User, 'id' | 'created_at'>;
export type CreateCategoryInput = Omit<Category, 'id' | 'created_at'>;