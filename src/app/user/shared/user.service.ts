import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
@Injectable()
export class UserService {

    constructor(private http: HttpClient){}

    public getUser(userId: string): Observable<any>{
    return this.http.get(`/api/v1/users/${userId}`);
    }
    // for to update rental
    public updateUser(userId: string, userData: any): Observable<any> {
    return this.http.patch(`/api/v1/users/${userId}`, userData);
    }
    public updateAccount(userId: string, userData: any): Observable<any> {
        return this.http.patch(`/api/v1/users/${userId}/account`, userData);
    }
    public updatePassword(userId: string, userData: any): Observable<any> {
        return this.http.patch(`/api/v1/users/${userId}/password`, userData);
    }
    public forgotPassword(userData: any): Observable<any> {
        return this.http.post('/api/v1/users/forgotpassword/email', userData);
    }
    public getPassChangeAuth(token: string, userData: any): Observable<any> {
        return this.http.put(`/api/v1/users/resetpassword/form/${token}`, userData);
    }
    public getUserpById(userpId: string): Observable<any>{
        return   this.http.get('/api/v1/users/owner/'+ userpId);     
      }
      public getUserRentals(userpId: string): Observable<any>{
        return   this.http.get('/api/v1/users/owner/'+ userpId);     
      }
      public CreateCardAccount(userData: any): Observable<any>{
        return   this.http.post('/api/v1/payments/accountcard/', userData); 
      }
     
     

     
}