import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../model/transaction.model';
import { Category } from '../../model/category.model';
import { TransactionSearchParams } from '../../model/transaction-search-params.model';
import { CriteriaResponse } from '../../model/criteria-response.model';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.css'
})
export class MovementsComponent implements OnInit {

  transactions: Transaction[] = [];
  categories: Category[] = [];
  latestTransaction: Transaction | null = null;
  loading = true;
  displayedColumns: string[] = ['fechaOperacion', 'concepto', 'categoria', 'pagos', 'ingresos', 'saldo'];
  summaryColumns: string[] = ['tipo', 'saldo'];
  
  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
  }

  private loadTransactions(): void {
    this.loading = true;
    const searchParams: TransactionSearchParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    
    this.transactionService.getByCriteria(searchParams).subscribe({
      next: (response: CriteriaResponse) => {
        this.transactions = response.elements;
        this.totalElements = response.totalElementsFound;
        this.latestTransaction = this.getLatestTransaction(response.elements);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 0;
    this.loadTransactions();
  }

  private getLatestTransaction(transactions: Transaction[]): Transaction | null {
    if (transactions.length === 0) return null;

    return transactions.reduce((latest, current) => {
      const latestDate = new Date(latest.fechaOperacion);
      const currentDate = new Date(current.fechaOperacion);
      return currentDate > latestDate ? current : latest;
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onCategoryChange(transaction: Transaction, newCategoryId: number): void {
    const newCategory = this.categories.find(cat => cat.id === newCategoryId);
    if (!newCategory) return;

    // Update immediately for visual feedback
    const oldCategory = transaction.category;
    transaction.category = newCategory;

    const updatedTransaction = {
      ...transaction,
      category: newCategory
    };

    this.transactionService.updateOne(transaction.id, updatedTransaction).subscribe({
      next: (result) => {
        const index = this.transactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
          this.transactions[index] = result;
        }
        if (this.latestTransaction && this.latestTransaction.id === transaction.id) {
          this.latestTransaction = result;
        }
      },
      error: (error) => {
        console.error('Error updating transaction category:', error);
        // Revert on error
        transaction.category = oldCategory;
      }
    });
  }

}
