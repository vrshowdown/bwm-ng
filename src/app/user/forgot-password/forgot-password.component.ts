import { Component, OnInit,Input } from '@angular/core';
import {UserService} from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import {User} from '../shared/user.model';
import { AuthService } from '../../auth/shared/auth.service';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'bwm-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    user: User;
    //formData: any = {};
    userData: any = {};
    errors: any[] =[]; 
    emailForm: FormGroup;
    notifyMessage: string = '';
    //@Input() type: string = 'text';

    constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private toastr: ToastrService, 
      private auth: AuthService,
      private router: Router){
        
      }

    ngOnInit() {
      this.initForm();
    }





    forgotPassword(){

      this.userService.forgotPassword(this.emailForm.value).subscribe(
        ()=>{
          this.toastr.success('You have Successfully updated your password', 'Success!');
        },
        (errorResponse)=>{
          this.errors = errorResponse.error.errors;
        })
    }
  






    initForm(){
      this.emailForm = this.fb.group({
        email: [ '',[ Validators.required, 
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$') ] ]
       
      })
    }
  
    isInvalidForm(fieldName): boolean{
      return this.emailForm.controls[fieldName].invalid &&
      (this.emailForm.controls[fieldName].dirty || this.emailForm.controls[fieldName].touched)
    }
    isRequired(fieldName): boolean{
      return this.emailForm.controls[fieldName].errors.required
    }





}