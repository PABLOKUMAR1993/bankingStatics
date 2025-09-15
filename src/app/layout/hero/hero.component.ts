import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, NavBarComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  title = 'Banking Statics';
}