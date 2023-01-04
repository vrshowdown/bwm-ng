import { Component, OnInit,Output, EventEmitter,Input,ChangeDetectorRef,ChangeDetectionStrategy, OnChanges } from '@angular/core';
import {UserService} from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import {User} from '../shared/user.model';
import { AuthService } from '../../auth/shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; 



import{ PaymentService } from '../shared/payment.service';
@Component({
  selector: 'bwm-withdraw-money',
  templateUrl: './withdraw-money.component.html',
  styleUrls: ['./withdraw-money.component.scss'],
})
export class WithdrawMoneyComponent implements OnInit {


  user: User = new User();
  userData:any;
  errors: any[] =[];
  revenue: any;
  @Input() formDataz: any = {};
  @Output() childEvent = new EventEmitter();

  constructor(private userService: UserService,
    private toastr: ToastrService, 
    private auth: AuthService,
    private paymentService:PaymentService){}

ngOnInit() {
 this.formDataz.amount = 0;
}

ngOnDestroy(){
}
  onSubmitToPay(){
    this.paymentService.payoutToBankCard(this.formDataz).subscribe(
      (res: any)=>{
        this.getUser();
        //user = this.user;
        //console.log(res);
        this.toastr.success('You have Successfully withdraw money from your account. It will be available in 2 days', 'Success!');
      },
      (errorResponse)=>{
        this.errors = errorResponse.error.errors;
      });
  }




getUser(){
  const userId = this.auth.getUserId();
  this.userService.getUser(userId).subscribe(
  (user:User)=>{
    this.user = user;
    this.revenue = this.user.revenue;
    if(this.revenue){this.revenue =  (this.revenue/100) - this.formDataz.amount;  this.childEvent.emit(this.revenue);}
      },
      (err)=>{
      });
  }

 

}
