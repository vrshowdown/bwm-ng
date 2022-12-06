import { Injectable } from '@angular/core';
import { Boolean } from 'aws-sdk/clients/apigateway';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { AuthService } from '../../auth/shared/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RentalOwnerService {
    rentalOwner = false;
    validOwner: BehaviorSubject<Boolean>;
    constructor(private auth:AuthService) {

        this.validOwner = new BehaviorSubject(this.rentalOwner);
        this.enableOwner(false);

   
    }
    enableOwner(owner) {
     
        this.validOwner.next(owner);
    }


 hideRentalOwner(){
   let rentalOwnerChange:boolean;
        const token = this.auth.getAuthToken();
        console.log(token);
        if(token != undefined){
            let rentowner:any = this.auth.getRentalowner();
            console.log(rentowner);
            if(rentowner == true){ // if from token meta data  is true 
                this.enableOwner(true);
               this.validOwner.subscribe((c)=>{ 
                rentalOwnerChange = c;
                console.log("Token Captured rentowner available is... "+c)
               });
            }else{ //If  metadata from token is false
                this.validOwner.subscribe((c)=>{ 
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