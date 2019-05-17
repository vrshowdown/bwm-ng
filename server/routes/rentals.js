
const express = require ('express'); // nodejs framework
const Rental = require('../models/rental');//data type structure and schema rules
const router = express.Router(); //using routing method
const UserCtrl = require('../controllers/user');

router.get('/secret', UserCtrl.authMiddleware, function(req, res){
    res.json({"secret": true});
});



router.get('', function(req,res){  
    Rental.find({})
    .select('-bookings')
    .exec(function(err, foundRentals){
        res.json(foundRentals); // shows list of data on empty path
    });
});



router.get('/:id', function(req, res){      // responds with id path    
    const rentalId = req.params.id;                                  //assigns reantalid to routing id  

    Rental.findById(rentalId)
    .populate('user', 'username-_id')
    .populate('bookings', 'startAt endAt -_id')
    .exec(function(err, foundRental){
     if (err){
           return res.status(422).send({errors:[{title: 'Rental Error!', detail: 'Could not find Rental!'}]});   
        }
        return res.json(foundRental);  
    });

});



module.exports = router; //to export file