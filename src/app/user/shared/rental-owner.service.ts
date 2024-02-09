import { Injectable } from '@angular/core';
//import * as AWS from 'aws-sdk';
//import { Boolean } from 'aws-sdk/clients/apigateway';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { AuthService } from '../../auth/shared/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RentalOwnerService {
    //apigateway?:AWS.APIGateway;
    boolean:any;
    rentalOwner = false;
    validOwner:any = BehaviorSubject<Boolean>;
    constructor(private auth:AuthService) {

        //this.apigateway = new AWS.APIGateway();
        //this.boolean = this.apigateway;
        this.validOwner = new BehaviorSubject(this.rentalOwner);
        this.enableOwner(false);

   
    }
    enableOwner(owner:any) {
     
        this.validOwner.next(owner);
    }


 hideRentalOwner(){
   let rentalOwnerChange:boolean = false;
        const token = this.auth.getAuthToken();
        console.log(token);
        if(token != undefined){
            let rentowner:any = this.auth.getRentalowner(); //Gets Token with rentwoner
            console.log(rentowner);
            if(rentowner == true){ // if from token meta data  is true 
                this.enableOwner(true);
               this.validOwner.subscribe((c:any)=>{ 
                rentalOwnerChange = c;
                console.log("Token Captured rentowner available is... "+c)
               });
            }else{ //If  metadata from token is false
                this.validOwner.subscribe((c:any)=>{ 
                    rentalOwnerChange = c;  
                });
                this.enableOwner(false);
                console.log("Token captured Rent owner not avilable.. "+rentalOwnerChange);  
            }

        }else{
            this.enableOwner(false);
            this.auth.logout();
            console.log("Token not captured Rent owner not avilable.. "+this.validOwner);
        
        }
    }
}