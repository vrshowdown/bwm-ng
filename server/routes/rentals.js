const express = require ('express');
const Rental = require('../models/rental');//data type structure and schema rules
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const router = express.Router(); //using routing method
const UserCtrl = require('../controllers/user');

router.get('/secret', UserCtrl.authMiddleware, function(req, res){
    res.json({"secret": true});
});
//manage rentals
router.get('/manage', UserCtrl.authMiddleware, function(req, res){
    const user = res.locals.user;
    Rental
        .where({user})
        .populate('bookings')
        .exec(function(err, foundRentals){
            if (err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            return res.json(foundRentals);
    });
});

//to get rental detail by id
router.get('/:id', function(req, res){    
    const rentalId = req.params.id;                                    

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

// to delete rental
router.delete('/:id', UserCtrl.authMiddleware, function(req, res){
    const user = res.locals.user;
    Rental.findById(req.params.id)
          .populate('user', '_id')
          .populate({
               path: 'bookings',
               select: 'startAt',
               match: { startAt:{ $gt: new Date()}}
          })
         .exec(function(err, foundRental){
                  if (err){
             return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }
                if (user.id !== foundRental.user.id){
                  return res.status(422).send({errors:[{title: 'Invalid User!', detail: 'You are not rental owner!'}]});
                }
                if (foundRental.bookings.length > 0){
                   return res.status(422).send({errors:[{title: 'No active bookings!', detail: 'Cannot delete rental with active bookings!'}]});
                }
                foundRental.remove(function(err){
                    if(err){
                      return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }
                    return res.json({'status': 'deleted'});
               });

    })
});


// to post  new rental
router.post('', UserCtrl.authMiddleware, function(req,res){
    const{ title, city, street, category, image, shared, bedrooms, description, dailyRate } = req.body;
    const user = res.locals.user;
    const rental = new Rental({title, city, street, category, image, shared, bedrooms, description, dailyRate});
   rental.user = user;
    Rental.create(rental, function(err, newRental){
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        User.update({_id: user.id}, { $push: {rentals: newRental}}, function(){});
        return res.json(newRental);
    });
});

// to get rentals by search
router.get('', function(req,res){  
    const city = req.query.city;
    const query = city ?  {city: city.toLowerCase()} : {};
    Rental.find(query)
    .select('-bookings')
    .exec(function(err, foundRentals){
        if (err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if(city && foundRentals.length === 0 ){
            return res.status(422).send({errors:[{title: 'No Rentals Found!', detail: `There are no rentals for the city ${city}`}]});   
        }
        return res.json(foundRentals); // shows list of data
    });
});

module.exports = router; //to export file