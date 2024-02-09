import { Component, OnInit } from '@angular/core';
import {UserP} from '../shared/user-detail.model';
import {UserService} from '../shared/user.service';
import { ActivatedRoute } from '@angular/router'; // to link detail
import { Rental } from '../../rental/shared/rental.model';
//import { RentalService } from '../../rental/shared/rental.service';
import {User} from '../shared/user.model';
@Component({
  selector: 'bwm-user-public-detail',
  templateUrl: './user-public-detail.component.html',
  styleUrls: ['./user-public-detail.component.scss']
})
export class UserPublicDetailComponent implements OnInit {
 
  constructor(private route: ActivatedRoute, private userService: UserService) { 

  }
  userp: UserP|any;
  rentals: Rental[] |any
  user: User|any;
  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.getUserP(params['userpId']); // Function call method for  rental object to be retrieved by router number
       
       
      })
     
      
  }



 
  
    // assign rental to a variable for individual item in array
  getUserP(userpId: string){

    this.userService.getUserpById(userpId).subscribe(
    (userp: UserP)=>{

      this.userp = userp;
      this.rentals = this.userp.user.rentals;
      let rentid = this.userp.user.rentals[0]._id
      //this.varifyInfo(this.userp);
      //console.log(userp);
    },
    (err)=>{})
  }
 
 

 




}
