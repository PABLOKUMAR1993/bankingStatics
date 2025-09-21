import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoadDataComponent } from './components/load-data/load-data.component';
import { MovementsComponent } from './components/movements/movements.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'load-data', component: LoadDataComponent, canActivate: [AuthGuard] },
  { path: 'movements', component: MovementsComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
