
//Component for rental list item.
//This componant also used for to make list item attributes accessable
//This Organizes a single rental  item as a componant so it can be displayed in an array, in rental-list.component's forloop
//current processed information from the list will be passed through this component and displayed, based on item in the list
// BY JIBREEL UTLEY
import { Component, OnInit, Input } from '@angular/core';  // declare Angular component/OnInit functions and input  function for interface  

@Component({
  selector: 'bwm-rental-list-item',
  templateUrl: './rental-list-item.component.html',
  styleUrls: ['./rental-list-item.component.scss']
})
export class RentalListItemComponent implements OnInit {
  //(creates interface for object's attributes)
  @Input() rental: any;
  constructor() { }

  ngOnInit() {
  }

}