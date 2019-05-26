
// Rental Service is  the main area for  rental data to be accessed and shared for multiple purposes.
//BY JIBREEL UTLEY
import {Injectable} from '@angular/core'; // declares Injectable function from angular to inject data to other components 

import {Observable} from 'rxjs'; // declares Observables from Reactive Extensions for JavaScript to manage data asynchronously

import { Rental } from './rental.model'; // for rental type

import {HttpClient} from '@angular/common/http';
 @Injectable()
 export class RentalService{
//the array of object data  for Rental Service
constructor(private http: HttpClient){}
//Make observable function for data ids,    will look up id  in the array
public getRentalById(rentalId: string): Observable<any>{
  // changed observer function to this
  return   this.http.get('/api/v1/rentals/' + rentalId);     
}



    public  getRentals(): Observable<any>{
//while recieving rental data  asynchronously, rentalObservable  gets  stream of data 
     return   this.http.get('/api/v1/rentals');
    }

}