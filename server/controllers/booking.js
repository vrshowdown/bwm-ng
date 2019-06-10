const Rental = require('../models/rental');
const Booking = require('../models/booking');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const moment = require('moment');


exports.createBooking = function(req, res) {
    // for creating booking localy
    const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
    const user = res.locals.user;
    const booking = new Booking({ startAt, endAt, totalPrice, guests, days});

    Rental.findById(rental._id)
    .populate('bookings')
    .populate('user')
    .exec(function(err, foundRental){
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if(foundRental.user.id === user.id){
            return res.status(422).send({errors: [{title: 'Invalid Booking', detail: 'Cannot create a booking on your rental!'}] });
        }

        if(isValidBooking(booking, foundRental)){
            booking.user = user;
            booking.rental = foundRental;
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
            return res.status(422).send({errors: [{title: 'Invalid User', detail: 'Chosen dates are already taken!'}] });
        }
    //return res.json({'booking', foundRental});
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