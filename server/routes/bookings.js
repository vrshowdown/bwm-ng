//Back End Booking Route
const express = require ('express'); // nodejs framework
const router = express.Router(); //using routing method
const UserCtrl = require('../controllers/user');
const BookingCtrl = require('../controllers/booking');

router.post('', UserCtrl.authMiddleware, BookingCtrl.createBooking);

module.exports = router; 