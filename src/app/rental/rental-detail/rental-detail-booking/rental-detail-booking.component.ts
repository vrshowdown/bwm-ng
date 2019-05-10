import { Component, OnInit, Input }from '@angular/core';
import { Rental } from '../../shared/rental.model';
@Component({
    selector: 'bwm-rental-detail-booking',
    templateUrl: './rental-detail-booking.component.html',
    styleUrls: ['./rental-detail-booking.component.scss']
})

export class RentalDetailBookingComponent implements OnInit {
  @Input() price: number;
  daterange: any = {};
  constructor() { }
  ngOnInit() {}
 

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
    opens: 'left'
  };

  public selectedDate(value: any, datepicker?: any) {

  // this is the date the iser selected
  console.log(value);

  // any object can be passed to the selected event and it will be passed back here
  datepicker.start = value.start;
  datepicker.end = value.end;

  // or manipulate your own internal property
  this.daterange.start = value.start;
  this.daterange.end = value.end;
  this.daterange.label = value.label;
  }
}