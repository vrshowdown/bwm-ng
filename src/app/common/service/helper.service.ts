// service to  get booked out dates and cross out dates
import { Injectable } from '@angular/core';
import {Booking} from '../../booking/shared/booking.model'; // gets booking model
import * as moment from 'moment';
@Injectable()
export class HelperService {
  private getRangeOfDates(startAt:any,endAt:any, dateFormat:any){ //2
      const tempDates = [];
      const mEndAt = moment(endAt); // converts startat to moment
      let mStartAt = moment(startAt); //  converts end at to moment
while (mStartAt < mEndAt){ // if start is less than end
    tempDates.push(mStartAt.format(dateFormat)); //push converted dates to tempDate array
    mStartAt = mStartAt.add(1, 'day');// got to the next day
}
tempDates.push(moment(startAt).format(dateFormat));
tempDates.push(mEndAt.format(dateFormat));
return tempDates;
    }

private formatDate(date:any, dateFormat:any){
return moment(date).format(dateFormat);
}
public formatBookingDate(date:any){
return this.formatDate(date, Booking.DATE_FORMAT);
}
public getBookingRangeOfDates(startAt:any, endAt:any){ //1 
return this.getRangeOfDates(startAt, endAt, Booking.DATE_FORMAT); //converts each day to moment with date format
}
}