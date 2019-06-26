// this component is the main component that displays individual  pages that show details of  the selected  item in the list.
//this 'page' also uses current router id to retrieve  rental object data from   rental service  -JIBREEL UTLEY

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // to link detail
//to get rental data from service 
import { RentalService } from '../shared/rental.service';      //imported database from service
import { Rental } from '../shared/rental.model';    //imported type array


@Component({
  selector: 'bwm-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {
  
  
  rental: Rental;   // assign rental to a variable for individual item in array
 

  
  constructor(private route: ActivatedRoute, private rentalService: RentalService) { }// inject service into the constructor

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.getRental(params['rentalId']); // Function call method for  rental object to be retrieved by router number
      })
  }

//This function to  gets rental data by router id 

  getRental(rentalId: string){
    this.rentalService.getRentalById(rentalId).subscribe(
    (rental: Rental)=>{ //by rental object and type
      this.rental = rental;  //current  number in rentals array  is assigned to the current individual  item in rental  service  
    });
  }
  



} // end export class RentalDetailComponent
