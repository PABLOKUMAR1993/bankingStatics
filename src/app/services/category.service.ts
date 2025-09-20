import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // Attributes

  private baseUrl: string = `${API_CONFIG.BASE_URL}`;

  // Constructor

  public constructor(private http: HttpClient) { }

  // Methods

  public getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CATEGORIES.BASE}`);
  }

  public updateBulk(categories: Category[]): Observable<Category[]> {
    return this.http.put<Category[]>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CATEGORIES.BULK_UPDATE}`, categories);
  }

  public createBulk(categories: Omit<Category, 'id'>[]): Observable<Category[]> {
    return this.http.post<Category[]>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CATEGORIES.BULK_CREATE}`, categories);
  }

}
