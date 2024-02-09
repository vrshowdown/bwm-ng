
import { Component, OnInit,ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
import { Location } from '@angular/common';
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
  birthDateSplit:any;
  @Input() formDatax:any| ConnectedAccount; //JMU
  @Input() isValidatingAccount: boolean = false;
  @Output() stipeIdEvent = new EventEmitter();
  individual:any;
  business_profile:any;
  settings:any;
  company:any;
  ssn:any;
  tos_shown_and_accepted:any;
  statement_descriptor:any;
  statement_descriptor_prefix:any;
  
  constructor( private toastr: ToastrService,
               private paymentService: PaymentService,
               private auth: AuthService,
               private userService: UserService,
               private router: Router,
               ){
                
                
               }
  ngOnInit(){
    if(this.formDatax.requirements){
      this.state=  this.formDatax.requirements.some((ele: string)=>{ return ele == ('individual.address.state' || 'company.address.state') });
      this.personDocument = this.formDatax.requirements.some((ele: string)=>{return ele == 'person.document'});
      this.tos = this.formDatax.requirements.some((ele: string)=>{return ele == 'tos_acceptance.date' || 'tos_acceptance.ip'});
      this.taxId = this.formDatax.requirements.some((ele: string)=>{return ele == 'company.tax_id'});
      this.statement_descriptor = this.formDatax.requirements.some((ele: string)=>{return ele == 'settings.payments.statement_descriptor'});
      this.statement_descriptor_prefix = this.formDatax.requirements.some((ele: string)=>{return ele == 'settings.payments.statement_descriptor_prefix'});
      this.ssn = this.formDatax.requirements.some((ele: string)=>{return ele == 'individual.id_number'});
     // console.log('state',this.state);
      }
      //console.log('state',this.state);
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


  
  userDatap:any =PAYMENT;
  
 
  errors: any[] =[]; 
 token2: any = {};
 error: string = '';
 fileData: any;
forPublic:any= UserP;
user:any= User;
userData:any;
personDocument:any;
tos:any;
state:any;
taxId:any;
 async submitforToken(formDatax:ConnectedAccount){
//1

   formDatax = this.formDatax;
  this.birthDateSplit = formDatax.birthDate.split("-",);
  
      this.individual=  {
        first_name: this.formDatax.firstName,
        last_name:this.formDatax.lastName,
        email: this.formDatax.email,
        phone: this.formDatax.phone,
        ssn_last_4: this.formDatax.ssLast4,
        id_number: this.formDatax.id_number,
        dob:{
          day: this.birthDateSplit[2],
          month: this.birthDateSplit[1],
          year: this.birthDateSplit[0]
        },
        address: {
          line1: this.formDatax.address,
          city: this.formDatax.city,
          state: this.formDatax.state.abv,
          postal_code: this.formDatax.zipCode.toString()
      },/*
        verification: {
          document: {
              front: this.fileData.id
          },
        },*/

      
      };
      this.business_profile ={
        url: 'http://www.jmu3d.com',//add later
        product_description: "I provide services in renting out  Real Estate to my clients", //add later
        mcc:'5734',
    },
    this.settings ={
      payouts:{
        schedule:{
        interval: 'manual'
        },
      
      },
      
      payments:{
      statement_descriptor:this.formDatax.name,
      statement_descriptor_prefix:this.formDatax.prefix,
      }
      
    },
    this.company ={
      tax_id:this.formDatax.tax_id,
      name:this.formDatax.name
    },
   
  //this.formDatax.name = `${this.formDatax.firstName} ${this.formDatax.lastName}`;
   this.isValidatingAccount = false;
    this.stripe= Stripe(environment.STRIPE_PK);
   this.isValidatingAccount = true;
   if( !this.user.rentalOwner){
    this.tos_shown_and_accepted= this.formDatax.tos; 
    if(this.formDatax.requirements &&this.fileData &&this.fileData.id){
    this.individual.verification = {document:{front:this.fileData.id}};
    }
    if(this.state){
      this.individual.address.state = this.formDatax.state.abv
    }
  
   }
   const accountResult =  await this.stripe.createToken('account', {
    
      //business_type:'individual',
       //email: this.formDatax.email,
        
      
       individual:this.individual,
       business_profile:this.business_profile,
       settings:this.settings,
       company:this.company,
       tos_shown_and_accepted:this.tos_shown_and_accepted       
      });
    
    
    
      if (accountResult.token) {
        const token  = accountResult.token;
        this.updateSAccount(token);
      }
     
        
         
      }
     
  

  updateSAccount(token:any){ //JMU
//2
   /// this.userDatap = this.formDatax;
   let datat;
   delete this.individual.id_number; //after reciving token  remove SS number
   datat = {
    token,
    data:{
      individual:this.individual,
       business_profile:this.business_profile,
       settings:this.settings,
       company:this.company,
       tos_shown_and_accepted:this.tos_shown_and_accepted,
       tosLastCreated:this.formDatax.tosCreated
    }
   }
   //console.log('Name', datat);
  
    this.paymentService.userCreateCAccount(datat).subscribe(
      (token)=>{ 
        this.token2 = token;
        this.isValidatingAccount = false;
        this.toastr.success('You have Successfully updated your account', 'Success!');
        this.getUser();
        if(this.formDatax.stripeAccountId){
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        
      },
      (errorResponse)=>{
        this.errors = errorResponse.error.errors;
        this.isValidatingAccount = false;
      })      
  }



async uploadFile(event:any){

    const file = event.target.files[0];
    const data = new FormData();  
    data.append('purpose', 'identity_document');
    data.append('file', file);
    data.get('file');
     this.stripe = Stripe(environment.STRIPE_PK);
 
     const fileResult = await fetch('https://uploads.stripe.com/v1/files', {
       method: 'POST',
       headers: {'Authorization': `Bearer ${this.stripe._apiKey}`},
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
        this.isValidatingAccount = false;
      });
  }





}