
//The Rental-list.component is the component that will loop through the information to display each rental list item with its own attributes
import { Component, OnInit } from '@angular/core';

import {RentalService} from '../shared/rental.service';

import { Rental } from '../shared/rental.model';
@Component({
  selector: 'bwm-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {
// this is the list of data,  it is placed in an array called rentals

  rentals: Rental[] = [];   //changed from rentals: any[] = [];   
  constructor(private rentalService: RentalService){}

  ngOnInit(){
    
    const rentalObservable = this.rentalService.getRentals();

 rentalObservable.subscribe(
 
  //changed from (rentals)=>{
    (rentals: Rental[])=>{
    this.rentals = rentals;     //where data goes and binded  to the variable in this function
  },
 
  (err)=>{}, // checks for errors
 
  ()=>{} //complete
 
  );
  
  
  }
}
