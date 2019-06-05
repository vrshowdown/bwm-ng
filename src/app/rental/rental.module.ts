//Rental Module is a sub module that handles   all rental components BY JIBREEL UTLEY

//Sub modules of rental module
import{NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes, RouterModule } from '@angular/router';  //for detail rental view
import {HttpClientModule} from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes'; // for manipulating type
import { MapModule } from '../common/map/map.module';
import { Daterangepicker } from 'ng2-daterangepicker'; //date range picker
import { FormsModule } from '@angular/forms';

//Components
import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
import { RentalComponent } from './rental.component';
import {RentalDetailComponent} from './rental-detail/rental-detail.component';  //for detail rental view
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
import { RentalSearchComponent } from './rental-search/rental-search.component';
import {RentalCreateComponent} from './rental-create/rental-create.component';

// Services
import {RentalService} from './shared/rental.service';
import { BookingService } from '../booking/shared/booking.service';
import { HelperService } from '../common/service/helper.service';
import { UppercasePipe } from '../common/pipes/uppercase.pipe';

import { AuthGuard } from '../auth/shared/auth.guard';


const routes: Routes =[

    { path: 'rentals',
        component: RentalComponent,
        children: [

            { path: '', component: RentalListComponent },
            { path: 'new', component: RentalCreateComponent, canActivate: [AuthGuard]},
            { path:':rentalId', component: RentalDetailComponent },
            { path:':city/homes', component: RentalSearchComponent}

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
        RentalDetailBookingComponent,
        RentalSearchComponent,
        RentalCreateComponent
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