import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransactionService } from '../../../services/transaction.service';
import { CategoryService } from '../../../services/category.service';
import { Transaction } from '../../../model/transaction.model';
import { Category } from '../../../model/category.model';

export interface TransactionData {
  fechaOperacion: Date;
  concepto: string;
  fechaValor: Date;
  pagos: number;
  ingresos: number;
  saldo: number;
  selectedCategory?: Category;
}

@Component({
  selector: 'app-preview-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './preview-modal.component.html',
  styleUrl: './preview-modal.component.css'
})
export class PreviewModalComponent implements OnInit {
  displayedColumns: string[] = ['fechaOperacion', 'concepto', 'fechaValor', 'pagos', 'ingresos', 'saldo', 'category'];
  dataSource: MatTableDataSource<TransactionData>;
  isImporting = false;
  categories: Category[] = [];
  defaultCategory: Category = { id: 7, name: 'Otros', color: '#FF6384' };

  constructor(
    public dialogRef: MatDialogRef<PreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionData[],
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {
    this.data.forEach(item => {
      item.selectedCategory = undefined;
    });
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onCategoryChange(element: TransactionData, category: Category): void {
    element.selectedCategory = category;
  }

  getRowStyle(element: TransactionData): string {
    if (element.selectedCategory && element.selectedCategory.id !== 7) {
      const color = element.selectedCategory.color;
      return `background-color: ${color}20;`;
    }
    return '';
  }

  onConfirm(): void {
    this.isImporting = true;
    
    const transactionsToCreate: Omit<Transaction, 'id' | 'user'>[] = this.data.map(item => ({
      fechaOperacion: item.fechaOperacion,
      fechaValor: item.fechaValor,
      concepto: item.concepto,
      pagos: item.pagos,
      ingresos: item.ingresos,
      saldo: item.saldo,
      category: item.selectedCategory || this.defaultCategory,
      notes: ''
    }));

    this.transactionService.createBulk(transactionsToCreate).subscribe({
      next: (createdTransactions) => {
        this.isImporting = false;
        this.dialogRef.close(createdTransactions);
      },
      error: (error) => {
        this.isImporting = false;
        console.error('Error al importar transacciones:', error);
        this.dialogRef.close(false);
      }
    });
  }
}