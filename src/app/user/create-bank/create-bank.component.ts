import { Component, OnInit,ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
@Component({
  selector: 'bwm-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent implements OnInit {

  stripe: any;
  elements: any;

  @ViewChild('cardNumber',{static: true}) cardNumRef: ElementRef|any;
  @ViewChild('cardExp',{static: true}) cardExpRef: ElementRef|any;
  @ViewChild('cardCvc',{static: true}) cardCvcRef: ElementRef|any;

  //@ViewChild('currency',{static: true}) currencyRef: ElementRef;
 
  @Output() bankConfirmed = new EventEmitter();

  

  cardNumber: any;
  cardExp: any;
  cardCvc: any;

  currency: any;

  isValidatingCard: boolean = false;
  error: string = '';
  token: any;

  constructor(){
/* global Stripe */
  this.stripe = Stripe(environment.STRIPE_PK);
  this.elements = this.stripe.elements();

  this.onChange = this.onChange.bind(this);
  }
  ngOnInit(){
    this.cardNumber = this.elements.create('cardNumber', {style});
    this.cardNumber.mount(this.cardNumRef.nativeElement);

    this.cardExp = this.elements.create('cardExpiry', {style});
    this.cardExp.mount(this.cardExpRef.nativeElement);

    this.cardCvc= this.elements.create('cardCvc', {style});
    this.cardCvc.mount(this.cardCvcRef.nativeElement);

   

    this.cardNumber.addEventListener('change', this.onChange);
    this.cardExp.addEventListener('change', this.onChange);
    this.cardCvc.addEventListener('change', this.onChange);
 
    this.currency = 'usd';

    
  }



// debt test card 4000056655665556


  ngOnDestroy(){
    this.cardNumber.removeEventListener('change', this.onChange);
    this.cardExp.removeEventListener('change', this.onChange);
    this.cardCvc.removeEventListener('change', this.onChange);
   // this.currency.removeEventListener('change', this.onChange);

    this.cardNumber.destroy();
    this.cardExp.destroy();
    this.cardCvc.destroy();
    //this.currency.destroy();
  }

  onChange({error}:any){
    if (error){
      this.error = error.message;
    } else {
      this.error='';
    }
  }

  stripeTokenHandler = (token:any) => {
    // Insert the token ID into the form so it gets submitted to the server
    
    const form:any = document.getElementById('group');
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute(token.card.currency, 'usd');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
  }
  

 

  async onSubmit(){

    this.isValidatingCard= true;
   
    const {token, error } = await this.stripe.createToken(this.cardNumber,{
      card:{
        currency: 'usd'
      }
    });
    this.isValidatingCard= false;
    if (error){
      console.error(error);
    }else{

      this.token = token;
 
      this.bankConfirmed.next(token);
    }
  }

  isCardValid():boolean {
    return this.cardNumber._complete && this.cardExp._complete && this.cardCvc._complete;
  }
  
}

const style = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};