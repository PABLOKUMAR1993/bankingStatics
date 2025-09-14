import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoadDataComponent } from './components/load-data/load-data.component';
import { AnalyzeDataComponent } from './components/analyze-data/analyze-data.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'load-data', component: LoadDataComponent },
  { path: 'analyze-data', component: AnalyzeDataComponent },
  { path: '**', redirectTo: '/home' }
];
