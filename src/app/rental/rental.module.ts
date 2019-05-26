

//Rental Module is a sub module that handles   all rental components BY JIBREEL UTLEY
import{NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
import { RentalComponent } from './rental.component';
import { NgPipesModule } from 'ngx-pipes'; // for manipulating type
import { Routes, RouterModule } from '@angular/router';  //for detail rental view
import {RentalService} from './shared/rental.service';
import { BookingService } from '../booking/shared/booking.service';
import { HelperService } from '../common/service/helper.service';
import {RentalDetailComponent} from './rental-detail/rental-detail.component';  //for detail rental view
import {HttpClientModule} from '@angular/common/http';   //register module
import { UppercasePipe } from '../common/pipes/uppercase.pipe';
import { MapModule } from '../common/map/map.module';
import { Daterangepicker } from 'ng2-daterangepicker'; //date range picker 
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../auth/shared/auth.guard';
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
const routes: Routes =[

    { path: 'rentals',
        component: RentalComponent,
        children: [

            { path: '', component: RentalListComponent },
            { path:':rentalId', component: RentalDetailComponent, canActivate: [AuthGuard] }

            ]
    },
]



// declaring rental components as registered components
@NgModule({
    declarations: [
    RentalListComponent,
    RentalListItemComponent,
    RentalComponent,
    RentalDetailComponent,
    UppercasePipe,   //custom pipe
    RentalDetailBookingComponent
    ],
    imports: [
    CommonModule,
    RouterModule.forChild(routes), //for detail rental view
    HttpClientModule,
    NgPipesModule,
    MapModule,
    Daterangepicker,//date range picker
    FormsModule
    ],
    providers: [
        RentalService, 
        HelperService,
        BookingService
    ]
})

export class RentalModule{

}