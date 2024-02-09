import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  formData: any = {};
  errors: any[] =[]; 
  ArrayProfiles: any = [];
  myLastName: any;
  constructor(private auth: AuthService, private router: Router, private http: HttpClient, private toastr:ToastrService){
    
  }
  ngOnInit(){
  }
  register(user:any){
  
    this.formData = {
      username:user.username,
      email:user.email,
      password:user.passCompare.password,
      passwordConfirmation:user.passCompare.confPass
    };
    this.auth.register(this.formData).subscribe(
    ()=>{
      this.router.navigate(['/login', {registered: 'success'}]);
    },
    (errorResponse)=>{
      this.errors = errorResponse.error.errors;
    })
  }
  onSubmit(profileForm: any){ //JMU5 pass Form ref variable in as is, to access validation status 
  
    if(profileForm.form.controls.username.invalid){ //JMU5  looks in form control to find if first name is valid based on  requirement validation
      return this.toastr.error('Requires First Name', 'Failed!');
    }
    if(profileForm.form.controls.passCompare.controls.confPass.invalid){ //JMU5 looks in formcontrol to find if confirm password is  valid, based on MustMatch Validation
      return this.toastr.error('Pass Need to Be the Same', 'Failed!');
    }
    if(profileForm.form.controls.email.invalid){
      return this.toastr.error('Incorrect Email Format', 'Failed!');
    }
    //console.log(profileForm.value);
    return this.register(profileForm.value);
  }


getIpAddress(){

}

}