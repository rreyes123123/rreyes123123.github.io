import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search/search.component';
import { UnpublishedComponent } from './unpublished/unpublished.component';
import { AppComponent }   from './app.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'unpublished', pathMatch: 'full'},
  { path: 'search', component: SearchComponent},
  { path: 'unpublished', component: UnpublishedComponent}
];
export const routing: ModuleWithProviders =
               RouterModule.forRoot(appRoutes);