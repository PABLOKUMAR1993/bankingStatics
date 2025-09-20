import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction.model';
import { TransactionSearchParams } from '../model/transaction-search-params.model';
import { CriteriaResponse } from '../model/criteria-response.model';
import { CurrentBalanceResponse } from '../model/current-balance-response.model';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  // Attributes

  private baseUrl = `${API_CONFIG.BASE_URL}`;

  // Constructor

  public constructor(private http: HttpClient) { }

  // Methods

  public updateOne(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TRANSACTIONS.UPDATE(id)}`, transaction);
  }

  public createBulk(transactions: Omit<Transaction, 'id'>[]): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TRANSACTIONS.BULK_CREATE}`, transactions);
  }

  public getByCriteria(searchParams: TransactionSearchParams): Observable<CriteriaResponse> {
    return this.http.post<CriteriaResponse>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TRANSACTIONS.SEARCH}`, searchParams);
  }

  public getCurrentBalance(): Observable<CurrentBalanceResponse> {
    return this.http.get<CurrentBalanceResponse>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.TRANSACTIONS.CURRENT_BALANCE}`);
  }

}
