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

  private baseUrl: string = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES.BASE}`;

  // Constructor

  public constructor(private http: HttpClient) { }

  // Methods

  public getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  public getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  public create(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  public update(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
