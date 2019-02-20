
 //Rental Module is a sub module that handles   all rental components BY JIBREEL UTLEY
 import{NgModule} from '@angular/core';
 import {CommonModule} from '@angular/common';
 import { RentalListComponent } from './rental-list/rental-list.component';
 import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
 import { RentalComponent } from './rental.component';

 import { Routes, RouterModule } from '@angular/router';  //for detail rental view
 import {RentalService} from './shared/rental.service';
 import {RentalDetailComponent} from './rental-detail/rental-detail.component';  //for detail rental view



// For rental detail view
 const routes: Routes =[

    { path: 'rentals',
        component: RentalComponent,
        children: [

            { path: '', component: RentalListComponent },
            { path:':rentalId', component: RentalDetailComponent }// after installing rental-detail.component

            ]
    },
]



// declaring rental components as registered components 
 @NgModule({ 
declarations: [
    RentalListComponent,
    RentalListItemComponent,
    RentalComponent,
    RentalDetailComponent
],
imports: [CommonModule,
RouterModule.forChild(routes) //for detail rental view
],
providers: [RentalService]
})

export class RentalModule{

}
