import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { RentalService } from '../shared/rental.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {UserP} from '../../user/shared/user-detail.model';
@Component({
selector: 'bwm-rental-create',
templateUrl: './rental-create.component.html',
styleUrls: ['./rental-create.component.scss']
})

export class RentalCreateComponent implements OnInit{

  newRental: Rental|any;
  anemities:any =[];
  
  rentalCategories = Rental.CATEGORIES;
  errors: any[] = [];
  constructor(private rentalService: RentalService,
              private router: Router
             ){}
  handleImageChange(){
    this.newRental.image = "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/13/image.jpeg";
  }
  ngOnInit(){
    this.newRental = new Rental();
    this.newRental.shared = false;
   
  }
handleImageUpload(imageUrl: string){
this.newRental.image = imageUrl;
console.log("handle image upload"+this.newRental);
}
handleImageError(){
this.newRental.image = '';
}
  createRental(){
    console.log("handle image upload"+this.newRental);
    this.rentalService.createRental(this.newRental).subscribe(
    (rental: Rental)=>{
      this.router.navigate([`/rentals/${rental._id}`]);
    },
    (errorResponse: HttpErrorResponse)=>{
      this.errors = errorResponse.error.errors;
    })
  }


addAnemities(entry:string,checkmark:any){
  
  if(checkmark.currentTarget.checked == true){
    this.anemities.push(entry);
    console.log(this.anemities);
  }else{
    const index = this.anemities.indexOf(entry);
    this.anemities.splice(index,1);
    console.log(this.anemities);
  }

  if(this.newRental){
    this.newRental.anemities =this.anemities;
  }
 
}


 

}