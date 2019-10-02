import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import {User} from '../shared/user.model';
import { AuthService } from '../../auth/shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; 
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';

@Component({
  selector: 'bwm-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService, 
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.token = this.route.snapshot.params.token;
    this.ActivationAuth(this.token);
  }
  token: any;
  errors: any= {}; 
  user: User;
  userData: any;

  ActivationAuth(token: any){
    
 const userData = 'done'
    this.userService.getActivationAuth(this.token,userData).subscribe(
      ()=>{
        //this.user = updatedUser;  
        //this.logout(userData);
        this.toastr.success('You have Successfully Activated your account', 'Success!');
        //this.formData = {};
        this.router.navigate(['/login', {activated: 'success'}]);
      },
      (errorResponse)=>{
     
        this.errors = errorResponse.error.errors;
      })

  }



}
