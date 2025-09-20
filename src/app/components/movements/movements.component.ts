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
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Transaction } from '../../model/transaction.model';
import { Category } from '../../model/category.model';
import { TransactionSearchParams } from '../../model/transaction-search-params.model';
import { CriteriaResponse } from '../../model/criteria-response.model';
import { CurrentBalanceResponse } from '../../model/current-balance-response.model';
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
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    ReactiveFormsModule
  ],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.css'
})
export class MovementsComponent implements OnInit {

  transactions: Transaction[] = [];
  categories: Category[] = [];
  currentBalance: CurrentBalanceResponse | null = null;
  loading = true;
  displayedColumns: string[] = ['fechaOperacion', 'concepto', 'categoria', 'pagos', 'ingresos', 'saldo'];
  summaryColumns: string[] = ['tipo', 'saldo'];
  
  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  
  // Filter properties
  filterForm: FormGroup;
  showFilters = false;
  sortOptions = [
    { value: 'fechaOperacion', label: 'Fecha de Operación' },
    { value: 'concepto', label: 'Concepto' },
    { value: 'pagos', label: 'Pagos' },
    { value: 'ingresos', label: 'Ingresos' },
    { value: 'saldo', label: 'Saldo' }
  ];
  sortDirectionOptions = [
    { value: 'desc', label: 'Descendente' },
    { value: 'asc', label: 'Ascendente' }
  ];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      operationDateFrom: [null],
      operationDateTo: [null],
      valueDateFrom: [null],
      valueDateTo: [null],
      concept: [''],
      paymentAmountFrom: [null],
      paymentAmountTo: [null],
      incomeAmountFrom: [null],
      incomeAmountTo: [null],
      categoryIds: [[]],
      sortBy: ['fechaOperacion'],
      sortDirection: ['desc']
    });
  }

  ngOnInit(): void {
    this.loadCurrentBalance();
    this.loadTransactions();
    this.loadCategories();
  }

  private loadTransactions(): void {
    this.loading = true;
    const formValue = this.filterForm.value;
    
    const searchParams: TransactionSearchParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      operationDateFrom: formValue.operationDateFrom,
      operationDateTo: formValue.operationDateTo,
      valueDateFrom: formValue.valueDateFrom,
      valueDateTo: formValue.valueDateTo,
      concept: formValue.concept || undefined,
      paymentAmountFrom: formValue.paymentAmountFrom,
      paymentAmountTo: formValue.paymentAmountTo,
      incomeAmountFrom: formValue.incomeAmountFrom,
      incomeAmountTo: formValue.incomeAmountTo,
      categoryIds: formValue.categoryIds && formValue.categoryIds.length > 0 ? formValue.categoryIds : undefined,
      sortBy: formValue.sortBy || 'fechaOperacion',
      sortDirection: formValue.sortDirection || 'desc'
    };
    
    this.transactionService.getByCriteria(searchParams).subscribe({
      next: (response: CriteriaResponse) => {
        this.transactions = response.elements;
        this.totalElements = response.totalElementsFound;
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

  private loadCurrentBalance(): void {
    this.transactionService.getCurrentBalance().subscribe({
      next: (balance: CurrentBalanceResponse) => {
        this.currentBalance = balance;
      },
      error: (error) => {
        console.error('Error loading current balance:', error);
      }
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
        // Reload balance after category change
        this.loadCurrentBalance();
      },
      error: (error) => {
        console.error('Error updating transaction category:', error);
        // Revert on error
        transaction.category = oldCategory;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filterForm.reset({
      operationDateFrom: null,
      operationDateTo: null,
      valueDateFrom: null,
      valueDateTo: null,
      concept: '',
      paymentAmountFrom: null,
      paymentAmountTo: null,
      incomeAmountFrom: null,
      incomeAmountTo: null,
      categoryIds: [],
      sortBy: 'fechaOperacion',
      sortDirection: 'desc'
    });
    this.currentPage = 0;
    this.loadTransactions();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

}
