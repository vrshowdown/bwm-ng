import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';  //for detail user view
import {HttpClientModule} from '@angular/common/http';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserPublicDetailComponent } from './user-public-detail/user-public-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RentalService } from '../rental/shared/rental.service';

import { UserComponent } from './user.component'; 
import { ResetpasswordComponent } from '../user/resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from '../user/forgot-password/forgot-password.component';
import { CreateBankComponent } from './create-bank/create-bank.component';

import { EditableModule } from '../common/components/editable/editable.module';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import {PaymentModule} from '../payment/payment.module';

import { UserService } from './shared/user.service';
import{ PaymentService } from './shared/payment.service';
import { AuthGuard } from '../auth/shared/auth.guard';
import { AuthService } from '../auth/shared/auth.service';
import { CreateIndividualComponent } from './create-individual/create-individual.component';
import { WithdrawMoneyComponent } from './withdraw-money/withdraw-money.component';

const routes: Routes =[

    { path: 'users',
        component: UserComponent,
        children: [

            { path: 'profile', canActivate: [AuthGuard], component: UserDetailComponent },
            { path: 'forgotpassword/email', component:ForgotPasswordComponent},
            { path: 'resetpassword/form/:token', component:ResetpasswordComponent},
            { path: 'owner/:userpId', component:UserPublicDetailComponent}
            ]
    }
  
]



@NgModule({
imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EditableModule,
    ImageUploadModule,
    PaymentModule
],
declarations: [
    UserComponent,
    UserDetailComponent,
    ResetpasswordComponent,
    ForgotPasswordComponent,
    UserPublicDetailComponent,
    CreateBankComponent,
    CreateIndividualComponent,
    WithdrawMoneyComponent
],
providers: [
    UserService,
    RentalService,
    AuthService,
    PaymentService
]
})
export class UserModule {}