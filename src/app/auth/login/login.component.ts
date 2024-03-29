import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RentalOwnerService } from '../../user/shared/rental-owner.service';
@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm:any = FormGroup;
  errors: any[] = [];
  notifyMessage: string = '';

  constructor(
  private fb: FormBuilder, 
  private auth: AuthService, 
  private router: Router,
  private route: ActivatedRoute,
  private rentalOwner: RentalOwnerService){}

  ngOnInit(){
    this.auth.logout();
    this.initForm();
    this.route.params.subscribe((params)=>{
      if(params['registered']=== 'success'){
        this.notifyMessage = 'You have been successfully registered, Check your email to confirm account! To send this Confirmation email agin, log in and goto Owner Section > Profile > User Settings';
      }
      if(params['reset']=== 'success'){
        this.notifyMessage = 'You have successfully reseted your password, you can log in now with your new password!';
      }
      if(params['activated']=== 'success'){
        this.notifyMessage = 'Your account has been activated, you can log in now!';
        
      }
      if(params['emailchange']=== 'success'){
        this.notifyMessage = 'You have successfully changed your e mail, you can log in now';  
      }
      if(params['usernamechange']=== 'success'){
        this.notifyMessage = 'You have successfully changed your username, you can log in now';  
      }
      if(params['reactivationNewEmailRequest']=== 'success'){
        this.notifyMessage = 'You have Successfully changed your email. please find your confirmation e mail in your inbox or junkmail, and activate your account';
      }
      if(params['reactivationRequest']=== 'success'){
        this.notifyMessage = 'You have Successfully sent a confirmation e mail. please find your e mail in the inbox or junkmail and activate your account';
      }
      if(params['rentalOwner']=== 'success'){
        this.notifyMessage = 'You have Successfully completed Your Stipe Account Activation as a rental owner. Please login to Access The New Rental Owner Features ';
      }
    })
  }
  
  initForm(){
    this.loginForm = this.fb.group({
      email: [ '',[ Validators.required, 
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$') ] ],
      password: [ '',Validators.required ]
    })
  }

  isInvalidForm(fieldName:any): boolean{
    return this.loginForm.controls[fieldName].invalid &&
    (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched)
  }
  isRequired(fieldName:any): boolean{
    return this.loginForm.controls[fieldName].errors['required'];
  }

  
  login(){
    this.auth.login(this.loginForm.value).subscribe(
    ()=>{
      this.rentalOwner.hideRentalOwner();// from auth module
      this.router.navigate(['/rentals']);
    },
    (errorResponse)=>{
      
      this.errors = errorResponse.error.errors;
      
    })
  }






}