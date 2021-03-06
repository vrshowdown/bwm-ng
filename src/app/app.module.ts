//This is the main module that handles all Main componants and sub modules of this web application -Jibreel

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UserModule } from './user/user.module';
import {RentalModule} from './rental/rental.module';
import { AuthModule } from './auth/auth.module';
import { ManageModule } from './manage/manage.module';
import {Routes, RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import{HeaderComponent} from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';








// adds what content that needs to be routed
const routes: Routes =[
  //Changed from  {path: '', component: RentalComponent} for  to redirect to rental main page
  {path: '', redirectTo: '/rentals', pathMatch: 'full'},
]
// Register main components of the site  by declaring them
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent, 
   ],
  imports: [
    //enables router module import
    RouterModule.forRoot(routes),
    BrowserModule,
    //Imports Sub module For Rental Feature
    RentalModule,
    AuthModule,
    NgbModule,//.forRoot removed for angular 8
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ManageModule,
    UserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }