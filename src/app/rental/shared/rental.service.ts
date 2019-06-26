import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { Rental } from './rental.model'; // for rental type
import {HttpClient} from '@angular/common/http';
//This service  is where the front end connect to the back end  for rentals
@Injectable()
export class RentalService{
  constructor(private http: HttpClient){}

  // for rental details
  public getRentalById(rentalId: string): Observable<any>{
    return   this.http.get('/api/v1/rentals/' + rentalId);     
  }
  // for rental list
  public  getRentals(): Observable<any>{
    return   this.http.get('/api/v1/rentals');
  }

  // for rental list by city
  public  getRentalsByCity(city: string): Observable<any>{
  return   this.http.get(`/api/v1/rentals?city=${city}`);
  }
  // To create a rental
  public createRental(rental: Rental): Observable<any>{
    return this.http.post('/api/v1/rentals', rental);
  }
  // to manage user's rentals
  public getUserRentals(): Observable<any> {
    return this.http.get('/api/v1/rentals/manage');
  }
  //for delete rental requests
  public deleteRental(rentalId: string): Observable<any>{
  return this.http.delete(`/api/v1/rentals/${rentalId}`);
  }
 // for to update rental
 public updateRental(rentalId: string, rentalData: any): Observable<any> {
   return this.http.patch(`/api/v1/rentals/${rentalId}`, rentalData);
 }
public verifyRentalUser(rentalId: string): Observable<any>{
return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
}
}