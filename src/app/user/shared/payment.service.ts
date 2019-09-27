import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
@Injectable()
export class PaymentService {


    constructor(private http: HttpClient){}


 
  

    public CreateCardAccount(userData: any): Observable<any>{
        return   this.http.post('/api/v1/payments/accountcard/', userData); 
    }

    public userUpdateCAccount(token: any): Observable<any>{
        return   this.http.post('/api/v1/payments/updateaccount/', token); 
    }
    public userCreateCAccount(token: any): Observable<any>{
        return   this.http.post('/api/v1/payments/createaccount', token); 
    }
    
    public userUploadId(userData: any): Observable<any>{
        return   this.http.post('/api/v1/payments/fileidupload/', userData); 
    }
    public payoutToBankCard(userData: any): Observable<any>{
        return   this.http.post('/api/v1/payments/payout/', userData); 
    }

}