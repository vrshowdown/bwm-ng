import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {UserService} from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import {User} from '../shared/user.model';
import { AuthService } from '../../auth/shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; 
import { Router} from '@angular/router';

import { Rental } from '../../rental/shared/rental.model';
import { RentalService } from '../../rental/shared/rental.service';

import{ PaymentService } from '../shared/payment.service';
@Component({
selector: 'bwm-user-detail',
templateUrl: './user-detail.component.html',
styleUrls: ['./user-detail.component.scss'],
animations: [

  trigger('simpleFadeAnimation', [
    state('in', style({opacity: 1, height: 232,})),

    transition(':enter', [
      style({opacity: 0, height:0}),animate(600 )
    ]),
    transition(':leave', animate(600, style({opacity: 0, height:0})))
    //transition(':leave',
    //
    
  ])
]
})




export class UserDetailComponent implements  OnInit {



  
  isValidatingAccount: boolean = false;

  
  user: User;
  errors: any[] =[]; 
  userData:any;
  UserTrigger:any;
  formData: any = {};
  formData2: any = {};
  formData3: any = {};
  formData4: any = {};
  formDatax: any = {};//create individual
  formDataz: any = {};
  emailForm: any = {};
  image: string;
  token: String;
  token2:String;
  rentals: Rental[];
  rev: number;
  stipeId: string;
 
 

  constructor(private userService: UserService,
                   private toastr: ToastrService, 
                   private auth: AuthService,
                   private router: Router,
                   private rentalService: RentalService,
                   private paymentService:PaymentService,
                   /*private ref:ChangeDetectorRef*/){
                
                   }
  ngOnInit(){
    
    this.getUser();
    
    this.rentalService.getUserRentals().subscribe(
      (rentals: Rental[])=>{
        this.rentals = rentals;
        //this.ref.detectChanges();
      },
      ()=>{});
      //this.ref.detectChanges();
  }


  

  

// for recieving  debt card token;
  onBankConfirmed( bankToken: any ){
    this.user.bankToken = bankToken;
  }

    updateBank(){

      this.userService.CreateCardAccount(this.user).subscribe(
      (userData: any)=>{
      
        userData = new User();
        
        this.toastr.success('You have successfully added your bank debt card', 'Success!');
       // this.ref.markForCheck();
      },
      (errorResponse: any)=>{
        this.errors = errorResponse.error.errors;
      })
    }



  getUser(){
   
    const userId = this.auth.getUserId();
     
    this.userService.getUser(userId).subscribe(
    (user)=>{
      
      this.user = user;
      this.user.revenue = user.revenue;
      
      this.formData2.username = user.username;
      this.formData2.email = user.email;
      this.formData3.email = user.email;
      this.formData4.email = user.email;
      this.isValidatingAccount=false;
      this.rev = user.revenue/100;
      this.stipeId = user.stripeAccountId;
    },
    (err)=>{
     // this.ref.detectChanges();
    })
  }

// to update/save  user data
  updateProfile(userId: string, userData: any){
    userId = this.auth.getUserId();
   
    userData = this.formData;
    
    this.userService.updateUser(userId, userData).subscribe(
      (updatedUser: User)=>{
        this.user = updatedUser;
      },
      (errorResponse: HttpErrorResponse)=>{
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
      })
  }








//update user account
  updateUserEmail(userId: string, userData: any){
    this.userService.updateAccount(userId, userData).subscribe(
      (updatedUser: User)=>{
        this.user = updatedUser;  
         if(this.user.activated===false){
          this.auth.logout();
          this.router.navigate(['/login', {reactivationNewEmailRequest: 'success'}]);
         }else{
          this.auth.logout();
          this.router.navigate(['/login', {emailchange: 'success'}]);
         }
      },
      (errorResponse)=>{
        this.errors = errorResponse.error.errors;
      })
  }


 

  updateUserName(userId: string, userData: any){
     this.userService.updateAccount(userId, userData).subscribe(
       (updatedUser: User)=>{
         this.user = updatedUser;  
             this.auth.logout();
             
             this.router.navigate(['/login', {usernamechange: 'success'}]);
       },
       (errorResponse)=>{
         this.errors = errorResponse.error.errors;
       })
   }

updateUserAccount(userId: string, userData: any){
  userId = this.auth.getUserId();
  userData = this.formData2;
  if(userData.email != this.user.email){
    this.updateUserEmail(userId, userData);
  }else{
    this.updateUserName(userId, userData);
  }
}


resendActivationAuth(user){
  user = this.user.email;
  this.userService.ResendActivationAuth(user).subscribe(
    ()=>{
      
      this.auth.logout();
      this.router.navigate(['/login', {reactivationRequest: 'success'}]);
    },
    (errorResponse)=>{
      this.errors = errorResponse.error.errors;
    })
}







  
// update user password
  updatePassword(userId: string, userData: any){
    userId = this.auth.getUserId();
    userData = this.formData3;
   
    this.userService.updatePassword(userId, userData).subscribe(
      (updatedUser: User)=>{
        this.user = updatedUser;  
        //this.logout(userData);
        this.toastr.success('You have Successfully updated your password', 'Success!');
      },
      (errorResponse)=>{
        this.errors = errorResponse.error.errors;
      })
  }


//update profile image
  updateImage(userId: string, userData: any){
    this.userService.updateUser(userId, userData).subscribe(
      (updatedUser: User)=>{
        this.user = updatedUser;
      },
      (errorResponse: HttpErrorResponse)=>{
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
      })
    }





    
    login(userData: any){
      userData = this.formData2;
      this.auth.login(userData).subscribe(
      (token)=>{
       // this.router.navigate(['/rentals']);
      },
      (errorResponse)=>{
        this.router.navigate(['/login', {registered: 'success'}]);
        this.errors = errorResponse.error.errors;

      })
    }
  

    logout(userData){
      this.login(userData);
      this.auth.logout();
    }


    



}