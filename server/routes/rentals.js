
const express = require ('express'); // nodejs framework
const Rental = require('../models/rental');//data type structure and schema rules
const router = express.Router(); //using routing method

router.get('', function(req,res){  
   //Changed from res.json({'ok': true}); //responds with empty path
    Rental.find({}, function(err, foundRentals){ 
        res.json(foundRentals); // shows list of data on empty path

    });
});



router.get('/:id', function(req, res){      // responds with id path    
    const rentalId = req.params.id;                                  //assigns reantalid to routing id  
    Rental.findById(rentalId, function(err, foundRental){     // if it finds rental id  
        if (err){ // if not finnd rental id
            res.status(422).send({errors:[{title: 'Rental Error!', detail: 'Could not find Rental!'}]});   // Respond to unrecognized id
        }
        res.json(foundRental);                                      // route with that id  to  single rental information
    });

});



module.exports = router; //to export file