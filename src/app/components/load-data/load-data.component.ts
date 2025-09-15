import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { excelMapping } from '../../constants/excel-mapping.constants';
import { PreviewModalComponent, TransactionData } from './preview-modal/preview-modal.component';

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

  constructor(private dialog: MatDialog) {}

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
      this.readExcelFile(file);
    } else {
      console.error('Tipo de archivo no válido. Solo se permiten archivos Excel (.xlsx, .xls)');
    }
  }

  private readExcelFile(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      this.processExcelData(jsonData);
    };
    
    reader.readAsArrayBuffer(file);
  }

  private processExcelData(rawData: any[]): void {
    if (rawData.length < 2) {
      console.error('El archivo Excel debe contener al menos una fila de encabezados y una fila de datos');
      return;
    }

    const headers = rawData[0] as string[];
    const dataRows = rawData.slice(1);

    const processedData: TransactionData[] = [];

    for (const row of dataRows) {
      const transaction: any = {};
      
      headers.forEach((header, index) => {
        const mappedField = excelMapping[header as keyof typeof excelMapping];
        if (mappedField && row[index] !== undefined && row[index] !== null && row[index] !== '') {
          if (mappedField === 'fechaOperacion' || mappedField === 'fechaValor') {
            transaction[mappedField] = this.parseExcelDate(row[index]);
          } else if (mappedField === 'pagos' || mappedField === 'ingresos' || mappedField === 'saldo') {
            transaction[mappedField] = parseFloat(row[index]) || 0;
          } else {
            transaction[mappedField] = row[index];
          }
        }
      });

      if (Object.keys(transaction).length > 0) {
        processedData.push(transaction as TransactionData);
      }
    }

    this.showPreviewModal(processedData);
  }

  private parseExcelDate(excelDate: any): Date {
    if (typeof excelDate === 'number') {
      return new Date((excelDate - 25569) * 86400 * 1000);
    }
    if (typeof excelDate === 'string') {
      return new Date(excelDate);
    }
    return new Date();
  }

  private showPreviewModal(data: TransactionData[]): void {
    const dialogRef = this.dialog.open(PreviewModalComponent, {
      data: data,
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'preview-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos confirmados para importar:', data);
      }
    });
  }
}
