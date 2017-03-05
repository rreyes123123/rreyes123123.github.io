import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './unauthenticated/login.component';
import { AppComponent }   from './app.component';

import { AuthGuard } from './_guards/auth-guard';
import { PageGuard } from './_guards/page-guard';
export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
];
export const routing: ModuleWithProviders =
               RouterModule.forRoot(appRoutes);
               