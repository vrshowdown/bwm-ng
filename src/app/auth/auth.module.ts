import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{ Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { AuthService } from './shared/auth.service';
import { AuthGuard } from './shared/auth.guard';
import { TokenInterceptor } from './shared/token.interceptor';
import { RentalOwnerService } from '../user/shared/rental-owner.service'; // for login

const routes: Routes = [
    { path: 'login', component: LoginComponent,  canActivate: [AuthGuard]  },
    { path: 'register', component:RegisterComponent,  canActivate: [AuthGuard] },
   
]

@NgModule({
    declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent,
   
    ],
    imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    ReactiveFormsModule
    ],
    providers: [
    AuthService,
    AuthGuard,
    RentalOwnerService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
    }
    ]
})
export class AuthModule { }