import {Category} from './category.model';
import {User} from './user.model';

export interface Transaction {
  id: number;
  fechaOperacion: Date;
  fechaValor: Date;
  concepto: string;
  pagos: number;
  ingresos: number;
  saldo: number;
  category?: Category;
  user: User;
  notes?: string;
}
