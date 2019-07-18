// will contain all route handlers for user
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getUser = function(req,res){
    const requestedUserId = req.params.id;
    const user = res.locals.user;
    if(requestedUserId === user.id){
        User.findById(requestedUserId,function(err,foundUser){
            if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
           
            return res.json(foundUser);
        })           
    }else{
      
        User.findById(requestedUserId)
        .select('-revenue -stripeCustomerId -password')
        .exec(function(err, foundUser){
            if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            return res.json(foundUser);
        })
    }
}

// function for login authentication
exports.auth = function(req, res){
    const { email, password} = req.body;// gets e mail and password variable
    if (!password || !email){//if no password or no e mail
        // send error to provide email and password
        return res.status(422).send({errors: [{title: 'Data Missing!', detail: 'Provide email and password!'}] });
    }
    User.findOne({email}, function(err, user){// function to find user in database
        if (err){ // if a misc error happens
            return res.status(422).send({errors: normalizeErrors(err.errors)});// send mongoose error, normalized by  body parser
        }
        if (!user) {//if no user was found
            // send error message
            return res.status(422).send({errors: [{title: 'Invalid User', detail: 'User does not  exist!'}] });
        }
        if (user.hasSamePassword(password)) {//if user and  password is the same
                //Return JWT Token
                const token =  jwt.sign({
                    userId: user.id,
                    username: user.username
                }, config.SECRET, {expiresIn: '1h'});
                return res.json(token);
        }
        else{
            //send error
            return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email or password'}] });
        }
       
    });
}
// registration System
exports.register = function(req, res){
    const {username, email, password, passwordConfirmation} = req.body; // variables that holds user input data
        if (!password || !email){ // if no password or e mail
            // send error message
            return res.status(422).send({errors: [{title: 'Data Missing!', detail: 'Provide email and password!'}] });
        }
        
        if (password !== passwordConfirmation){ // if passwords doesn't match the confirmation pass
            // send error message
            return res.status(422).send({errors: [{title: 'Invalid password', detail: 'Password is not the same as confirmation!'}] });
        }

        //find user on database by e mail ()
        User.findOne( {email}, function(err, existingUser){
            if (err){// if other errors happen
                //return mongoose error
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            if (existingUser){ //if user exist on database
                //return error
                return res.status(422).send({errors: [{title: 'Invalid email', detail: 'A user with this email already exist!'}] });
            }
            //object to gather user data
            const user = new User({
                username,
                email,
                password
            });
            //saves user data to database (checks for errors first)
            user.save(function(err){
                if(err){// if there is an error
                    return res.status(422).send({errors: normalizeErrors(err.errors)});// return mongoose error
                }
                    return res.json({'registered': true});//  confirm complete
                })
            })

  
}

exports.authMiddleware = function(req, res, next){
    const token = req.headers.authorization;
    if (token){
        const user = parseToken(token);
        User.findById(user.userId, function(err, user){
            if (err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            if (user){
                res.locals.user = user;
                next();
            }else{
                return notAuthorized(res);
            }
        })
    }else{
        return notAuthorized(res);
    }
}

function parseToken(token){  
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res){
    return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access.'}] });
}