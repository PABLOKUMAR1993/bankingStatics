import {Category} from './category.model';

export interface Transaction {
  id: number;
  fechaOperacion: Date;
  fechaValor: Date;
  concepto: string;
  pagos: number;
  ingresos: number;
  saldo: number;
  category?: Category;
  notes?: string;
}
