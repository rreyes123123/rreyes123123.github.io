import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { UnpublishedComponent } from './unpublished/unpublished.component';
import { PostComponent } from './unpublished/post.component';
import { UnpublishedPostComponent } from './unpublished/unpublished-post.component';
import { CreatePostComponent } from './unpublished/create-post.component';

import { FbPostService } from './_services/fb-post-service';
import { LookupService } from './_services/lookup-service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    UnpublishedComponent,
    PostComponent,
    CreatePostComponent,
    UnpublishedPostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [
    FbPostService, 
    LookupService, 
    { provide: LocationStrategy, useClass: HashLocationStrategy, }, 
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
