
import { Component, OnInit,ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import{ PAYMENT} from '../shared/payment.model';
import{ PaymentService } from '../shared/payment.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http'; 
import { AuthService } from '../../auth/shared/auth.service';
import {UserP} from '../shared/user-detail.model';
import {User} from '../shared/user.model';
import {UserService} from '../shared/user.service';
import {ConnectedAccount} from '../shared/stripeAccount.model';
@Component({
  selector: 'bwm-create-individual',
  templateUrl: './create-individual.component.html',
  styleUrls: ['./create-individual.component.scss']
})

export class CreateIndividualComponent implements OnInit {
  stripe: any;
  elements: any;
  stripeId:any;
  states: any = [];
 
  @Input() formDatax: ConnectedAccount;
  @Input() isValidatingAccount: boolean = false;
  @Output() stipeIdEvent = new EventEmitter();

  constructor( private toastr: ToastrService,
               private paymentService: PaymentService,
               private auth: AuthService,
               private userService: UserService,
               ){
                
                
               }
  ngOnInit(){ 
    
  
                  this.states = [{abv:'AL',name:'Alabama'},
                                {abv:'AK',name:'Alaska'},
                                {abv:'AZ',name:'Arizona'},
                                {abv:'AR',name:'Arkansas'}, 
                                {abv:'CA',name:'California'}, 
                                {abv:'CO',name:'Colorado'},
                                {abv:'CT',name:'Connecticut'}, 
                                {abv:'DE',name:'Delaware'},
                                {abv:'FL',name:'Florida'},
                                {abv:'GA',name:'Georgia'},
                                {abv:'HI',name:'Hawaii'},
                                {abv:'ID',name:'Idaho'},
                                {abv:'IL',name:'Illinois'},
                                {abv:'IN',name:'Indiana'}, 
                                {abv:'IA',name:'Iowa'},
                                {abv:'KS',name:'Kansas'},
                                {abv:'KY',name:'Kentucky'},
                                {abv:'LA',name:'Louisiana'},
                                {abv:'ME',name:'Maine'},
                                {abv:'MD',name:'Maryland'},
                                {abv:'MA',name:'Massachusetts'},
                                {abv:'MI',name:'Michigan'},
                                {abv:'MN',name:'Minnesota'},
                                {abv:'MS',name:'Mississippi'},
                                {abv:'MO',name:'Missouri'},
                                {abv:'MT',name:'Montana'},
                                {abv:'NE',name:'Nebraska'},
                                {abv:'NV',name:'Nevada'},
                                {abv:'NH',name:'New Hampshire'},
                                {abv:'NJ',name:'New Jersey'},
                                {abv:'NM',name:'New Mexico'},
                                {abv:'NY',name:'New York'},
                                {abv:'NC',name:'North Carolina'},
                                {abv:'ND',name:'North Dakota'},
                                {abv:'OH',name:'Ohio'},
                                {abv:'OK',name:'Oklahoma'},
                                {abv:'OR',name:'Oregon'},
                                {abv:'PA',name:'Pennsylvania'},
                                {abv:'RI',name:'Rhode Island'},
                                {abv:'SC',name:'South Carolina'},
                                {abv:'SD',name:'South Dakota'},
                                {abv:'TN',name:'Tennessee'},
                                {abv:'TX',name:'Texas'},
                                {abv:'UT',name:'Utah'},
                                {abv:'VT',name:'Vermont'},
                                {abv:'VA',name:'Virginia'},
                                {abv:'WA',name:'Washington'},
                                {abv:'WV',name:'West Virginia'},
                                {abv:'WI',name:'Wisconsin'},
                                {abv:'WY',name:'Wyoming'},
              ];
 
  }


  
  userDatap:PAYMENT;
  
 
  errors: any[] =[]; 
 token2: any = {};
 error: string = '';
 fileData: any;
forPublic: UserP;
user: User;
userData:any;

 async submitforToken(formDatax:ConnectedAccount){

   formDatax = this.formDatax;
  const birthDateSplit = formDatax.birthDate.split("-",); 
   
   this.isValidatingAccount = false;
   const  stripe = Stripe(environment.STRIPE_PK);
   this.isValidatingAccount = true;
   const accountResult =  await stripe.createToken('account', {
      //business_type:'individual',
       //email: this.formDatax.email,
        individual: {
          first_name: this.formDatax.firstName,
          last_name:this.formDatax.lastName,
          email: this.formDatax.email,
          phone: this.formDatax.phone,
          ssn_last_4: this.formDatax.ssLast4,
          dob:{
            day: birthDateSplit[2],
            month: birthDateSplit[1],
            year: birthDateSplit[0]
          },
          address: {
            line1: this.formDatax.address,
            city: this.formDatax.city,
            state: this.formDatax.state.abv,
            postal_code: this.formDatax.zipCode.toString()
         },
          verification: {
            document: {
                front: this.fileData.id
            },
          },
     
        
        },
        business_profile:{
          //url: 'http://localhost:4200/users/owner/',
          
          mcc:'5734'
         
      },
      tos_shown_and_accepted: this.fileData.tos,
       
      });
    
    
    
      if (accountResult.token) {
        const token  = accountResult.token;
        this.updateSAccount(token);
      }
     
        
         
      }
     
  

  updateSAccount(token){

   /// this.userDatap = this.formDatax;
    this.paymentService.userCreateCAccount(token).subscribe(
      (token)=>{ 
        this.token2 = token;
        this.isValidatingAccount = false;
        this.toastr.success('You have Successfully updated your account', 'Success!');
        this.getUser();
      },
      (errorResponse)=>{
        this.errors = errorResponse.error.errors;
      })      
  }



async uploadFile(event){

    const file = event.target.files[0];
    const data = new FormData();  
    data.append('purpose', 'identity_document');
    data.append('file', file);
    data.get('file');
     const  stripe = Stripe(environment.STRIPE_PK);
 
     const fileResult = await fetch('https://uploads.stripe.com/v1/files', {
       method: 'POST',
       headers: {'Authorization': `Bearer ${stripe._apiKey}`},
       body: data
     });
 
   this.fileData = await fileResult.json();

}

  




getUser(){
  const userId = this.auth.getUserId();
  this.userService.getUser(userId).subscribe(
  (user:User)=>{
    this.user = user;
    this.stripeId = user.stripeAccountId;
    if(this.stripeId){this.stipeIdEvent.emit(this.stripeId);}
      },
      (err)=>{
      });
  }





}