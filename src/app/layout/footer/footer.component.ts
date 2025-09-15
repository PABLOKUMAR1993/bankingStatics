import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  companyName = 'Banking Statics';
  projectDescription = 'Aplicación para el análisis y gestión de datos bancarios con herramientas avanzadas de visualización y estadísticas.';
  linkedinUrl = 'https://www.linkedin.com/in/pavlo-dudnyk/';
  gmailAddress = 'pablokumar1993@gmail.com';
}
