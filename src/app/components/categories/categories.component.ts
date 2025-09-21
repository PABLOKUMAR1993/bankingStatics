import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../model/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  loading = true;
  editingCategory: Category | null = null;
  editForm: FormGroup;
  newCategoryForm: FormGroup;
  showNewCategoryForm = false;

  displayedColumns: string[] = ['color', 'name', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      color: ['', [Validators.required]]
    });

    this.newCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      color: ['#1976d2', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.showSnackBar('Error al cargar las categorías');
        this.loading = false;
      }
    });
  }

  startEdit(category: Category): void {
    this.editingCategory = { ...category };
    this.editForm.patchValue({
      name: category.name,
      color: category.color
    });
  }

  cancelEdit(): void {
    this.editingCategory = null;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingCategory) {
      const updatedCategory: Category = {
        ...this.editingCategory,
        name: this.editForm.value.name,
        color: this.editForm.value.color
      };

      const index = this.categories.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        this.categories[index] = updatedCategory;
        
        this.categoryService.updateBulk(this.categories).subscribe({
          next: (categories) => {
            this.categories = categories;
            this.editingCategory = null;
            this.editForm.reset();
            this.showSnackBar('Categoría actualizada correctamente');
          },
          error: (error) => {
            console.error('Error updating category:', error);
            this.showSnackBar('Error al actualizar la categoría');
            this.loadCategories(); // Reload to get correct state
          }
        });
      }
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
      const filteredCategories = this.categories.filter(c => c.id !== category.id);
      
      this.categoryService.updateBulk(filteredCategories).subscribe({
        next: (categories) => {
          this.categories = categories;
          this.showSnackBar('Categoría eliminada correctamente');
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.showSnackBar('Error al eliminar la categoría');
        }
      });
    }
  }

  toggleNewCategoryForm(): void {
    this.showNewCategoryForm = !this.showNewCategoryForm;
    if (!this.showNewCategoryForm) {
      this.newCategoryForm.reset({
        name: '',
        color: '#1976d2'
      });
    }
  }

  createCategory(): void {
    if (this.newCategoryForm.valid) {
      const newCategory: Omit<Category, 'id'> = {
        name: this.newCategoryForm.value.name,
        color: this.newCategoryForm.value.color
      };

      this.categoryService.createBulk([newCategory]).subscribe({
        next: (createdCategories) => {
          this.loadCategories(); // Reload all categories
          this.newCategoryForm.reset({
            name: '',
            color: '#1976d2'
          });
          this.showNewCategoryForm = false;
          this.showSnackBar('Categoría creada correctamente');
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.showSnackBar('Error al crear la categoría');
        }
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getRandomColor(): string {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#607d8b'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  setRandomColor(): void {
    this.newCategoryForm.patchValue({
      color: this.getRandomColor()
    });
  }
}