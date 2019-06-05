import {Injectable} from '@angular/core';
import {Observable} from 'rxjs'; 
import { Rental } from './rental.model'; // for rental type
import {HttpClient} from '@angular/common/http';

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
  public createRental(rental: Rental): Observable<any>{
    return this.http.post('/api/v1/rentals', rental);
  }
}