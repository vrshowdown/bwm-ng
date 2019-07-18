import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';  //for detail user view
import {HttpClientModule} from '@angular/common/http';
import { UserDetailComponent } from './user-detail/user-detail.component';
import{ FormsModule } from '@angular/forms';

import { UserComponent } from './user.component'; 

import { UserService } from './shared/user.service';
import { AuthGuard } from '../auth/shared/auth.guard';
import { AuthService } from '../auth/shared/auth.service';

const routes: Routes =[

    { path: 'users',
        component: UserComponent,
        children: [

            { path: 'profile', canActivate: [AuthGuard], component: UserDetailComponent }
          
            ]
    },
]



@NgModule({
imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule
],
declarations: [
    UserComponent,
    UserDetailComponent
],
providers: [
    UserService,
    AuthService
]
})
export class UserModule {}