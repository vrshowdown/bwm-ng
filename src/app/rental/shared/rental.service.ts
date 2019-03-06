
// Rental Service is  the main area for  rental data to be shared for multiple purposes. This  file will store data, or will retrieve data from the database
// the array/code does not have to be repeated  for each component, it is injectected in the destined component
//BY JIBREEL UTLEY
import {Injectable} from '@angular/core'; // declares Injectable function from angular to inject data to other components 

import {Observable} from 'rxjs'; // declares Observables from Reactive Extensions for JavaScript to manage data asynchronously

import { Rental } from './rental.model'; // for rental type

import {HttpClient} from '@angular/common/http';
 @Injectable()
 export class RentalService{
//the array of object data  for Rental Service
// changed from private rentals: any[] =[{  
// removed private rentals: Rental[] = [{ all data }];
constructor(private http: HttpClient){}
//Make observable function for data ids,    will look up id and compare it to the id in the array
public getRentalById(rentalId: string): Observable<any>{
  // changed observer function to this
  return   this.http.get('/api/v1/rentals/' + rentalId);     
}


// changed from getRentals(): any{
    public  getRentals(): Observable<any>{
//while recieving rental data  asynchronously, rentalObservable  Manages  stream of data  before displaying data
     //1. changed from const rentalObservable = new Observable((observer)=>{ 
     //2. Changed from const rentalObservable: Observable<Rental[]>= new Observable((observer)=>{ 
     //3. changed from  return new Observable<Rental[]>((observer)=>{all of the functions});
     return   this.http.get('/api/v1/rentals');
    }

}