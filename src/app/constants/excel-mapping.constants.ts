export const excelMapping = {
  'Fecha Operación': 'fechaOperacion',
  'Concepto': 'concepto',
  'Fecha Valor': 'fechaValor',
  'Pagos': 'pagos',
  'Ingresos': 'ingresos',
  'Saldo': 'saldo'
};

export type ExcelColumnKey = keyof typeof excelMapping;
export type TransactionProperty = typeof excelMapping[ExcelColumnKey];