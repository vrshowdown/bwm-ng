
// will contain all route handlers for user
const Rental = require('../models/rental');
const UserP = require('../models/userp');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
//const jwt = require('jsonwebtoken');
const config = require('../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API_KEY);




//to get user detail by id and display Public user rentals
exports.getUserP = function(req, res){

    const userId = req.params.id;                                    
    UserP.findById(userId)
    .populate({
        path: 'user',
        select: 'rentals image-_id username-_id about-_id',
        populate: {
            path: 'rentals',
            model: 'Rental',
           select: 'category-_id image-_id shared-_id city-_id title-_id dailyRate-_id'
          }
    })  
    .exec(function(err, foundUser){
        
     if (err){
           return res.status(422).send({errors:[{title: 'User Error!', detail: 'Could not find User!'}]});   
        }
       //req.locals.id = foundUser.id;
        return res.json(foundUser); 
    });
}



// to get public id 

exports.getUserP2 = function(req, res){
   
    const user =  res.locals.user;
    
       
        UserP.findOne({user}, function(err, foundUserPId){
            if (err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }


          
            return res.json(foundUserPId.id);   
    });


//return res.json('You did it');
//return res.json(user);
}