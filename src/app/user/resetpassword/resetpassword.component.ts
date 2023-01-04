import { Component, OnInit } from '@angular/core';
import {UserService} from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import {User} from '../shared/user.model';
import { AuthService } from '../../auth/shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; 
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
@Component({
  selector: 'bwm-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  formData: any = {};
  userData: any;
  token: any;
  errors: any= {}; 
  user:any = User;

  constructor(
 private userService: UserService,
                   private route: ActivatedRoute,
                   private toastr: ToastrService, 
                   private auth: AuthService,
                   private router: Router) { }

  ngOnInit() {
    //this.getPassChange();
   
    
  }

  getPassChangeAuth(userData: any, token: any){

    token = this.route.snapshot.params['token'];
    userData = this.formData;
    this.userService.getPassChangeAuth(token,userData).subscribe(
      (updatedUser: User)=>{
        this.user = updatedUser;  
        //this.logout(userData);
        this.toastr.success('You have Successfully updated your password', 'Success!');
        this.formData = {};
        this.router.navigate(['/login', {reset: 'success'}]);
      },
      (errorResponse /*errorResponse: HttpErrorResponse*/)=>{
        //this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
        this.errors = errorResponse.error.errors;
      })

  }



  

}
