import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search/search.component';
import { UnpublishedComponent } from './unpublished/unpublished.component';
import { LoginComponent } from './unauthenticated/login.component';
import { AppComponent }   from './app.component';

import { AuthGuard } from './_guards/auth-guard';
import { PageGuard } from './_guards/page-guard';
export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'unpublished', component: UnpublishedComponent }//, canActivate: [AuthGuard]}
];
export const routing: ModuleWithProviders =
               RouterModule.forRoot(appRoutes);
               