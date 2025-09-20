export interface TransactionSearchParams {
  pageNumber?: number;
  pageSize?: number;
  operationDateFrom?: Date;
  operationDateTo?: Date;
  valueDateFrom?: Date;
  valueDateTo?: Date;
  concept?: string;
  paymentAmountFrom?: number;
  paymentAmountTo?: number;
  incomeAmountFrom?: number;
  incomeAmountTo?: number;
  categoryIds?: number[];
}