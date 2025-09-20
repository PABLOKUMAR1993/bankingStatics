import { Transaction } from './transaction.model';

export interface CriteriaResponse {
  totalElementsFound: number;
  elementsPerPage: number;
  currentPageNumber: number;
  elements: Transaction[];
}