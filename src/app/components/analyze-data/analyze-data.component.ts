import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Transaction } from '../../model/transaction.model';
import { Category } from '../../model/category.model';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-analyze-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './analyze-data.component.html',
  styleUrl: './analyze-data.component.css'
})
export class AnalyzeDataComponent implements OnInit {

  transactions: Transaction[] = [];
  categories: Category[] = [];
  latestTransaction: Transaction | null = null;
  loading = true;
  displayedColumns: string[] = ['fechaOperacion', 'concepto', 'categoria', 'pagos', 'ingresos', 'saldo'];
  summaryColumns: string[] = ['tipo', 'saldo'];

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
    this.transactionService.getAll().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.latestTransaction = this.getLatestTransaction(transactions);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
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

    this.transactionService.update(transaction.id, updatedTransaction).subscribe({
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
