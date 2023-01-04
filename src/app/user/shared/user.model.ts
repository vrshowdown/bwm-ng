//BY JIBREEL UTLEY
import { Booking } from '../../booking/shared/booking.model';
import { Rental } from '../../rental/shared/rental.model';

export class User{
    _id?:string;
    username?: string;
    email?: string;
    name?:string;
    address?:string;
    phone?: string;
    image?: string; 
    about?: string;
    rentals?:Rental[];
    revenue?: number;
    bankToken: any;
    currency?: string;
    activated?: boolean;
    stripeAccountId:string|undefined;
    rentalOwner?:boolean;

}