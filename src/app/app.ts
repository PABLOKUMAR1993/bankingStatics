import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent, HeroComponent} from './layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeroComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bankingStatics');
}
