import { Component,OnInit } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import{ Router } from '@angular/router';
import{RentalOwnerService} from '../../user/shared/rental-owner.service';
@Component({
    selector: 'bwm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements  OnInit{
constructor(public auth: AuthService, private router: Router,private rentalowner:RentalOwnerService){}
isMenuCollapsed:boolean = true;
owner:any;
    ngOnInit(){
        this.rentalowner.hideRentalOwner();//From app module
        this.rentalowner.validOwner.subscribe((c:any) => {
            this.owner = c;
        });
        //console.log("property recived from service   "+this.owner);
    }
    logout(){
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    search(city: string){
        city ? this.router.navigate([`/rentals/${city}/homes`]) : this.router.navigate(['/rentals']);
    }  
    
 toggler(){
  
   this.isMenuCollapsed? this.isMenuCollapsed=false :this.isMenuCollapsed=true;
 }
   
}
