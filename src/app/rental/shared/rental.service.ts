
// Rental Service is  the main area for  rental data to be shared for multiple purposes. This  file will store data, or will retrieve data from the database
// the array/code does not have to be repeated  for each component, it is injectected in the destined component
//BY JIBREEL UTLEY
import {Injectable} from '@angular/core'; // declares Injectable function from angular to inject data to other components 

import {Observable} from 'rxjs'; // declares Observables from Reactive Extensions for JavaScript to manage data asynchronously

import { Rental } from './rental.model'; // for rental type

 @Injectable()
 export class RentalService{
//the array of object data  for Rental Service
// changed from private rentals: any[] =[{  
private rentals: Rental[] =[   
             {
            id: "1", //ids are changed to a string  for single page address 
            title: "Central Apartment",
            city: "New York",
            street: "Times Square",
            category: "apartment",
            image: "http://via.placeholder.com/350x250",
            bedrooms: 2,
            description: "Very nice apartment", 
            dailyRate: 34,
            shared: false,
            createdAt: "24/12/2017"
            },
            {
              id: "2",  
              title: "Central Apartment 2",
              city: "San Francisco",
              street: "Main street",
              category: "condo",
              image: "http://via.placeholder.com/350x250",
              bedrooms: 3,
              description: "Very Nice Condo", 
              dailyRate: 25,
              shared: true,
              createdAt: "24/12/2017"
            },
            {
              id: "3",  
              title: "Central Apartment 3",
              city: "Bratislava",
              street: "Hlavna",
              category: "condo",
              image: "http://via.placeholder.com/350x250",
              bedrooms: 3, 
              description: "Very Nice Condo",
              dailyRate: 334,
              shared: true,
              createdAt: "24/12/2017"
            },
            {
              id: "4",  
              title: "Central Apartment",
              city: "Berlin",
              street: "Haupt strasse",
              category: "house",
              image: "http://via.placeholder.com/350x250",
              bedrooms: 3,
              description: "Very Nice House", 
              dailyRate: 15,
              shared: true,
              createdAt: "24/12/2017"
            }, 

    ];

//Make observable function for data ids,    will look up id and compare it to the id in the array
public getRentalById(rentalId: string): Observable<Rental>{
  return new Observable<Rental>((observer)=>{
    setTimeout(()=>{
      const foundRental = this.rentals.find((rental)=>{ 
        return rental.id == rentalId; //if rental.id == rentalid,  return true
      });
      observer.next(foundRental);  // emit found data  from service
    }, 500); 
  });
}


// changed from getRentals(): any{
    public  getRentals(): Observable<Rental[]>{
//while recieving rental data  asynchronously, rentalObservable  Manages  stream of data  before displaying data
     //1. changed from const rentalObservable = new Observable((observer)=>{ 
     //2. Changed from const rentalObservable: Observable<Rental[]>= new Observable((observer)=>{ 
      return new Observable<Rental[]>((observer)=>{ 
        setTimeout(()=>{
          observer.next(this.rentals);
        }, 1000); 
        //observer.error & observer.complete
      });
      // return rentalObservable;  was removed
 
    }

}