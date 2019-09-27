const Booking = require('../models/booking');
const Rental = require('../models/rental');
const Payment = require ('../models/payment');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const moment = require('moment');

const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SK);
const CUSTOMER_SHARE = 0.051;
const STRIPE_FEE = 0.029;








exports.createBooking = function(req, res) {
    // for creating booking localy
    const { startAt, endAt, totalPrice, guests, days, rental, paymentToken } = req.body;
    const user = res.locals.user;
    const booking = new Booking({ startAt, endAt, totalPrice, guests, days});

    Rental.findById(rental._id)
    .populate('bookings')
    .populate('user')
    .exec(async function(err, foundRental){
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if(foundRental.user.id === user.id){
            return res.status(422).send({errors: [{title: 'Invalid Booking', detail: 'Cannot create a booking on your rental!'}] });
        }
        

        if(isValidBooking(booking, foundRental)){
            booking.user = user;
            booking.rental = foundRental;
            const { payment, err } = await createPayment(booking, foundRental.user, paymentToken);
            if(payment){
                booking.payment = payment;
                foundRental.bookings.push(booking);

                booking.save(function(err){
                    if(err){
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }

                    foundRental.save()
                    User.update({_id: user.id},{$push: {bookings: booking}}, function(){});
                    return res.json({startAt: booking.startAt, endAt: booking.endAt});
                });
            }else{
                return res.status(422).send({errors: [{title: 'Payment Error', detail: err }] });
            }
        }else{
            return res.status(422).send({errors: [{title: 'Invalid User', detail: 'Chosen dates are already taken!'}] });
        }
    
    })

} // end exports.createbooking


// to manage user bookings
exports.getUserBookings = function(req, res){
    const user = res.locals.user;
    Booking
    .where({user})
    .populate('rental')
    .exec(function(err, foundBookings){
        if (err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        return res.json(foundBookings);
    });
}





function isValidBooking(proposedBooking, rental){
    let isValid = true;
    if(rental.bookings && rental.bookings.length >0){
        isValid = rental.bookings.every(function(booking){
            const proposedStart = moment(proposedBooking.startAt);
            const proposedEnd = moment(proposedBooking.endAt);

            const actualStart = moment(booking.startAt);
            const actualEnd = moment(booking.endAt);
            return ((actualStart < proposedStart && actualEnd < proposedStart)|| (proposedEnd < actualEnd && proposedEnd < actualStart));
        });
    }
    return isValid;
}// end  isValidBooking







//Create Payment to owner
async function createPayment(booking, toUser, token){
const { user } =  booking; 

const PLATFORM_FEE = booking.totalPrice * (CUSTOMER_SHARE + STRIPE_FEE);
    const customer = await stripe.customers.create({
    source: token.id,
    email: user.email
    },{
        
            stripe_account: toUser.stripeAccountId,
           
    }); 
  

    if (customer){
        User.update({_id: user.id}, { $set: {stripeCustomerId: customer.id}}, () =>{});
        const payment = new Payment({
            fromUser: user,
            toUser,
            fromStripeCustomerId: customer.id,
            booking,
            tokenId: token.id,
            amount: (booking.totalPrice - PLATFORM_FEE) * 100,
        });

        try{
            const savedPayment = await payment.save();
            return {payment: savedPayment};
        }catch(err){
            return {err: err.message};
        }
    }else{
        return {err: 'Cannot process Payment!'}
    }


}