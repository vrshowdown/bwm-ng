//This is the main module that handles all Main componants and sub modules of this webpage -Jibreel

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Includes Routing ability
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import{HeaderComponent} from './common/header/header.component';
import { RentalComponent } from './rental/rental.component'; // declaired but its value isn't read

//Imports Sub module For Rental Feature
import {RentalModule} from './rental/rental.module';

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
  ],
  imports: [
    //enables router module import
    RouterModule.forRoot(routes),
    BrowserModule,
    //Imports Sub module For Rental Feature
    RentalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
