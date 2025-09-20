export interface CurrentBalanceResponse {
  currentBalance: number;
  lastTransactionDate?: Date;
  hasTransactions: boolean;
}