import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoadDataComponent } from './components/load-data/load-data.component';
import { MovementsComponent } from './components/movements/movements.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'load-data', component: LoadDataComponent },
  { path: 'movements', component: MovementsComponent },
  { path: '**', redirectTo: '/home' }
];
