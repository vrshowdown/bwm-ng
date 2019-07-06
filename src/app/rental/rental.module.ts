//Rental Module is a sub module that handles   all rental components BY JIBREEL UTLEY

//Sub modules of rental module
import{NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes, RouterModule } from '@angular/router';  //for detail rental view
import {HttpClientModule} from '@angular/common/http';
import { NgPipesModule, UcWordsPipe } from 'ngx-pipes'; // for manipulating type
import { MapModule } from '../common/map/map.module';
import { Daterangepicker } from 'ng2-daterangepicker'; //date range picker
import { FormsModule } from '@angular/forms';
import { EditableModule } from '../common/components/editable/editable.module';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';

//Components
import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
import { RentalComponent } from './rental.component';
import {RentalDetailComponent} from './rental-detail/rental-detail.component';  //for detail rental view
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
import { RentalSearchComponent } from './rental-search/rental-search.component';
import {RentalCreateComponent} from './rental-create/rental-create.component';
import{ RentalUpdateComponent } from './rental-update/rental-update.component';

// Services
import {RentalService} from './shared/rental.service';
import { BookingService } from '../booking/shared/booking.service';
import { HelperService } from '../common/service/helper.service';
import { UppercasePipe } from '../common/pipes/uppercase.pipe';

import { AuthGuard } from '../auth/shared/auth.guard';
import { RentalGuard } from './shared/rental.guard';

const routes: Routes =[

    { path: 'rentals',
        component: RentalComponent,
        children: [

            { path: '', component: RentalListComponent },
            { path: 'new', component: RentalCreateComponent, canActivate: [AuthGuard]},
            { path: ':rentalId/edit', component: RentalUpdateComponent, canActivate: [AuthGuard,RentalGuard]},
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
        RentalCreateComponent,
        RentalUpdateComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes), //for detail rental view
        HttpClientModule,
        NgPipesModule,
        MapModule,
        Daterangepicker,//date range picker
        FormsModule,
        EditableModule,
        ImageUploadModule
    ],
    providers: [
        RentalService,
        HelperService,
        BookingService,
        UcWordsPipe,
        RentalGuard
    ]
})

export class RentalModule{

}