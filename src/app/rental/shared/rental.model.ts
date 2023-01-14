//BY JIBREEL UTLEY
import { Booking } from '../../booking/shared/booking.model';
import {User} from '../../user/shared/user.model';
export class Rental{
    static readonly CATEGORIES = ['house', 'apartment', 'condo'];
    _id: string|undefined;
    title?: string;
    city?: string;
    street?: string;
    category?: string;
    image?: string;
    bedrooms?: number;
    description?: string;
    dailyRate?: number;
    shared?: boolean;
    createdAt?: string;
    bookings: Booking[]|undefined;
    user?:User;
    anemities:string[]|undefined;
    
}
    
    