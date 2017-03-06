import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './home/post.component';
import { UnpublishedPostComponent } from './home/unpublished-post.component';
import { EmptyPostComponent } from './post-children/empty-post.component';
import { CreatePostComponent } from './home/create-post.component';
import { LoginComponent } from './login/login.component';
EmptyPostComponent
import { FbPostService } from './_services/fb-post-service';
import { LookupService } from './_services/lookup-service';
import { AuthenticationService } from './_services/authentication-service';
import { AuthGuard } from './_guards/auth-guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostComponent,
    CreatePostComponent,
    EmptyPostComponent,
    UnpublishedPostComponent,
    LoginComponent
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
    AuthenticationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy, }, 
    ReactiveFormsModule,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
