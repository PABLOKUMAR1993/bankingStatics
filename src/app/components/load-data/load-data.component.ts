import { Component } from '@angular/core';

@Component({
  selector: 'app-load-data',
  standalone: true,
  imports: [],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.css'
})
export class LoadDataComponent {

  // attributes

  public isDragOver: boolean = false;

  // methods

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files: FileList | undefined = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    const allowedTypes: string[] = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (allowedTypes.includes(file.type)) {
      console.log('Archivo seleccionado:', file.name);
    } else {
      console.error('Tipo de archivo no válido. Solo se permiten archivos Excel (.xlsx, .xls)');
    }
  }
}
