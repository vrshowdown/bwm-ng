import{ Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking/shared/booking.service';
import { PaymentService } from '../../payment/shared/payment.service';
import { Booking } from '../../booking/shared/booking.model';


@Component({
selector: 'bwm-manage-booking',
templateUrl: './manage-booking.component.html',
styleUrls: ['./manage-booking.component.scss']
})

export class ManageBookingComponent implements OnInit {
 
  bookings?: any[];
  payments?: any[];
  constructor(private bookingService: BookingService, 
                     private paymentService: PaymentService){}
  
  ngOnInit(){
    this.bookingService.getUserBookings().subscribe(
    (bookings: Booking[]) => {
      this.bookings = bookings;
    },
    () => {})

this.getPendingPayments();
  }

getPendingPayments() {
this.paymentService.getPendingPayments().subscribe(
(payments: any)=>{
this.payments = payments;
},
()=>{})
}
acceptPayment(payment:any){
this.paymentService.acceptPayment(payment).subscribe(
(json)=>{
payment.status =  'paid';
},
(err)=>{})
}

declinePayment(payment:any){
this.paymentService.declinePayment(payment).subscribe(
(json)=>{
payment.status =  'declined';
},
(err)=>{})
}
}