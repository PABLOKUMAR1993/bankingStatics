import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transaction.model';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  // Attributes

  private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS.BASE}`;

  // Constructor

  public constructor(private http: HttpClient) { }

  // Methods

  public getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  public getById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  public create(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, transaction);
  }

  public update(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, transaction);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  public createBulk(transactions: Omit<Transaction, 'id'>[]): Observable<Transaction[]> {
    const requests = transactions.map(transaction => this.create(transaction));
    return new Observable(observer => {
      const results: Transaction[] = [];
      let completed = 0;
      
      requests.forEach((request, index) => {
        request.subscribe({
          next: (result) => {
            results[index] = result;
            completed++;
            if (completed === requests.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    });
  }

}
