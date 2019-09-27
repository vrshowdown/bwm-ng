//BY JIBREEL UTLEY
import { Booking } from '../../booking/shared/booking.model';
import { Rental } from '../../rental/shared/rental.model';

export class User{
    username: string;
    email: string;
    name:String;
    address:string;
    phone: string;
    image: string; 
    about: String;
    rentals:Rental;
    revenue: number;
    bankToken: any;
    currency: string;
    stripeAccountId:string;

}