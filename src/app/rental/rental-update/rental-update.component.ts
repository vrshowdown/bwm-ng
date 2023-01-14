import {Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';     
import { Rental } from '../shared/rental.model'; 
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http'; 
import{ UcWordsPipe } from 'ngx-pipes';

import { Subject } from 'rxjs';


@Component({
  selector: 'bwm-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})

export class RentalUpdateComponent implements OnInit{  

rental: Rental|any; 
rentalId:string|any;
rentalCopy:any;

rentalCategories: string[] = Rental.CATEGORIES;
locationSubject: Subject<any> = new Subject();


animitySelect1:any={};
animitySelect2:any={};
animitySelect3:any={};
animitySelect4:any={};
animitySelect5:any={};
animitySelect6:any={};
constructor ( private route: ActivatedRoute,
  private rentalService: RentalService,
  private toastr: ToastrService,
  private upperPipe: UcWordsPipe) {
this.transformLocation = this.transformLocation.bind(this);

}

  ngOnInit() {
    this.rentalCopy = new Rental();
    this.route.params.subscribe(
      (params) => {
        this.rentalId = params['rentalId'];
        this.getRental(params['rentalId']);
        console.log(this.rental)
      })
     
  }
  updateRentalAnemities(rentalId: string, animitySelect: any, animity:string){
  
    console.log(animitySelect);
    if(animitySelect.toggle==false){
      if(this.rentalCopy.anemities.includes(animity)==true){
        const index = this.rentalCopy.anemities.indexOf(animity);
        this.rentalCopy.anemities.splice(index,1);
        console.log('updated..'+ this.rentalCopy.anemities);
      }
      
    }
    if(animitySelect.toggle==true){
      if(this.rentalCopy.anemities.includes(animity)==false){
        this.rentalCopy.anemities.push(animity);
        console.log('updated..'+ this.rentalCopy.anemities);
      }
    }
    debugger
    this.updateRental(rentalId, this.rentalCopy);
  }
transformLocation(location: string): string {
return this.upperPipe.transform(location);
}

  getRental(rentalId: string){
    
    this.rentalService.getRentalById(rentalId).subscribe(
    (rental: Rental)=>{
      this.rental = rental;
      this.rentalCopy.anemities = rental.anemities;
      
      console.log(rental._id);
    });
  }
  updateRental(rentalId: string|any, rentalData: any){
  debugger
    this.rentalService.updateRental(rentalId, rentalData).subscribe(
    (updatedRental: Rental)=>{
      this.rental = updatedRental;
      if (rentalData.city || rentalData.street){
        this.locationSubject.next(this.rental.city + ', '+ this.rental.street);
      }
    },
    (errorResponse: HttpErrorResponse)=>{
      this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
      this.getRental(rentalId);
    })
  }

  countBedroomAssets(assetsNum: number){
    return  parseInt(<any>this.rental?.bedrooms || 0, 10) + assetsNum;
  }

 
}