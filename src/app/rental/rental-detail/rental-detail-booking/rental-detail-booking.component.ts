import { Component, OnInit, Input, ViewChild, ViewEncapsulation }from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { HelperService } from '../../../common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { NgbDatepicker, NgbDateStruct, NgbModal, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../auth/shared/auth.service';
import * as moment from 'moment';
/*******************new DatePicker imports************************************* */
import {NgbDateParserFormatter, NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { range } from 'rxjs';
/****************************************************************************** */
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'bwm-rental-detail-booking',
    templateUrl: './rental-detail-booking.component.html',
    styleUrls: ['./rental-detail-booking.component.scss']
})

export class RentalDetailBookingComponent implements OnInit {

  /************new date Picker Vars*************** */

  hoveredDate: NgbDate | null = null;
 maxDate:NgbDate|null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
  newToDate:any|null;
  newFromDate:any|null;
  disabledDates:Date[]|any = [];
  markDisabled:boolean = true;
  blockedDay:any;
  model: NgbDateStruct|any;
	date: { year: number; month: number }|any;
  /*********************************************** */
  @Input() rental: Rental= new Rental();
 // @ViewChild(DaterangePickerComponent,{static: false})//Angular 8 JMU
 // public picker: DaterangePickerComponent; JMU
  newBooking: Booking|any; // booking info received from rental model
  modalRef: any;
  daterange: any = {};
  bookedOutDates: any[] = [];
  errors: any[] = [];
  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    autoUpdateInput: false,
    isInvalidDate: this.checkForInvalidDates.bind(this) 
  };


  constructor(private helper: HelperService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastr: ToastrService,
    public auth: AuthService,
    private calendar: NgbCalendar,  //New Date Picker
    public formatter: NgbDateParserFormatter, // New Date Picker
   
    
    ){
      this.fromDate = calendar.getToday();//New Date Picker
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 3);// New Date Picker
      
    }


  ngOnInit() {
    this.newBooking = new Booking();
   this.bookedOutTranslator();
  }

  bookedOutTranslator(){
    this.getBookedOutDates();
    const set = new Set(this.bookedOutDates);
    this.bookedOutDates = [...set].sort();

    this.bookedOutDates.forEach((element,index)=>{
      let dateObj ={
        day:Number(element.split('/')[2]),
        month:Number(element.split('/')[1]),
        year:Number(element.split('/')[0]), 
      }
    
      this.disabledDates.push(dateObj);
     
   })
  }

  private checkForInvalidDates(date:any){
    return this.bookedOutDates.includes(this.helper.formatBookingDate(date)) ||  date.diff(moment(), 'days') < 0;
  }
  private getBookedOutDates(){
    const bookings: Booking[]|undefined = this.rental.bookings;
    if (bookings && bookings.length > 0){
      bookings.forEach((booking: Booking)=>{
      const dateRange = this.helper.getBookingRangeOfDates(booking.startAt, booking.endAt);
      this.bookedOutDates.push(...dateRange);

      });
    }
    console.log("bookedout dates"+ this.bookedOutDates);
  }

  private addNewBookedDates(bookingData: any){
    const dateRange = this.helper.getBookingRangeOfDates(bookingData.startAt, bookingData.endAt);
    this.bookedOutDates.push(...dateRange);
  }


  public resetDatePicker(){
    /*
      this.picker.datePicker.setStartDate(moment());
      this.picker.datePicker.setEndDate(moment());
      this.picker.datePicker.element.val('');
      */
    this.toDate = null; //else keep todate without a date
    this.newToDate = null;
    this.fromDate = null;
    this.newFromDate = null;
  }

  openConfirmModal(content:any){
    this.errors=[];
    this.modalRef = this.modalService.open(content);
    this.resetDatePicker();
  }
//// function to receive token and place it in booking data 
  onPaymentConfirmed(paymentToken: any) {
  
    this.newBooking.paymentToken = paymentToken;
    console.log(this.newBooking);
  }

  createBooking(){ //JMU1
    this.newBooking.rental = this.rental; // adds current rental information to booking
    this.bookingService.createBooking(this.newBooking).subscribe( // saves booking info to database
    (bookingData: any)=>{ //replied back with booked data in moment form
      this.addNewBookedDates(bookingData); //send to function to convert moment to range of dates
      this.newBooking = new Booking(); //delete temp booking data
      this.modalRef.close(); //close model
      this.toastr.success('Booking has been successfuly created, check your booking detail in the manage section', 'Success!');
      this.bookedOutTranslator();
    },
    (errorResponse: any)=>{
      this.errors = errorResponse.error.errors;
    })
  }


  public selectedDate(value: any, datepicker: any) { // 0
    if(this.rental.dailyRate){// 1 checks for daily rate
    this.options.autoUpdateInput = true;
      // this is the date the user selected
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);  //2 adds data to booking as a moment string
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);  //3 adds data to booking as a moment string
    this.newBooking.days = -(value.start.diff(value.end, 'days' )); //4 adds data to days
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
    }
  }


/*******************New Date picker functions************************ */
onDateSelection(date: NgbDate) {

  if (!this.fromDate && !this.toDate) { // if no date
    this.fromDate = date; //add fromdate
    this.newFromDate  = moment(this.fromDate.year+"/"+this.fromDate.month+"/"+this.fromDate.day);
    
  } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {  //if there is a fromDate but not ToDate and the chosen toDate is after fromdate
    this.toDate = date; // add toDate
    this.newToDate = moment(this.toDate.year+"/"+this.toDate.month+"/"+this.toDate.day);
  } else {
    this.toDate = null; //else keep todate without a date
    this.newToDate = null;
    this.fromDate = date;
    this.newFromDate = moment(this.fromDate.year+"/"+this.fromDate.month+"/"+this.fromDate.day);
  }
  this.rental.dailyRate;
  if(this.rental.dailyRate){
  this.newBooking.startAt = this.helper.formatBookingDate(this.newFromDate);  //2 adds data to booking as a moment string
  this.newBooking.endAt = this.helper.formatBookingDate(this.newToDate);  //3 adds data to booking as a moment string
    this.newBooking.days = -(this.newFromDate.diff(this.newToDate, 'days' )); //4 adds data to days
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }
      
  console.log("fromDate__"+this.newFromDate);
  console.log("toDate__"+this.newToDate);
  console.log("Moment fromDate__"+this.newBooking.startAt);
  console.log("Moment toDate__"+this.newBooking.endAt);
  console.log("moment days..."+ this.newBooking.days);
}

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  isInvalid(date: NgbDate) {
    this.disabledDate(date);
    return date.before(this.calendar.getToday()) || date.day == this.blockedDay;  
  }

  disabledDate(date: NgbDate):any {
    for(let i=0; i<this.disabledDates.length; i++){
      if((date.day == this.disabledDates[i].day) && (date.month == this.disabledDates[i].month) && (date.year == this.disabledDates[i].year)){
        this.blockedDay=this.disabledDates[i].day; 
        return this.blockedDay;
      }else{
        this.blockedDay = null
      }
    }   
  }
/******************************************************************** */
}