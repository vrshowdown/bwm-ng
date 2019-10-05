// will contain all route handlers for user
const User = require('../models/user');
const UserP = require('../models/userp');

const UserPctrl = require('../controllers/userp'); // adds route handler 
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API_KEY);



// For private user profile
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
      // if  were ever used outside of private user, blocks selected values
        User.findById(requestedUserId)
        .select('-revenue -stripeCustomerId -password -stripeAccountId -stripeCid -randomToken')
        .exec(function(err, foundUser){
            if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            return res.json(foundUser);
        })
    }
}




//to update profile
exports.updateUser = function(req,res){
   
    const requestedUserId = req.params.id;
    const user = res.locals.user;
    const userData = req.body;
    
    if(requestedUserId === user.id){
        User.findById(requestedUserId,function(err,foundUser){
            if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
            }

           if (foundUser.id !== user.id){
               return res.status(422).send({errors:[{title: 'Invalid User!', detail: 'User not found'}]});
            }
            if(user.activated !== true){
                return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'User is not activated!'}] });
               
            }

            foundUser.set(userData);
            foundUser.update(userData,function(err){
                if (err){
                    return res.status(422).send({errors: normalizeErrors(err.errors)});
                }
                return res.status(200).send(foundUser);
            });
        })           
    }else{
       return res.status(422).send({errors:[{title: 'Invalid User!', detail: 'You are not rental owner!'}]});
    }
}


exports.updateAccount  = function(req,res){
 
    const requestedUserId = req.params.id;
    const user = res.locals.user;
    const userData = req.body;

    const {username, email, password} = req.body; 
    if(requestedUserId === user.id){


        User.findById(requestedUserId,function(err,foundUser){
            if(err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
                }
            if (foundUser.id !== user.id){
                    return res.status(422).send({errors:[{title: 'Invalid User!', detail: 'User not found'}]});
                }
            if (!password || !email || !username){
                    return res.status(422).send({errors: [{title: 'Data Missing!', detail: 'Provide username, email and password!'}] });
                }
            if (foundUser.hasSamePassword(password)) {
              //Checks to see if form data is different in e mail, then allows user to choose a unique e mail
              
              saveAccount(res,req,userData,foundUser);
            
                   

            }else{
                return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong password'}] });
            }
        });


    }
   
}
// to check if there is an existing email that is not my own
exports.checkEmailforUpdate = function(req, res, next){
    debugger;
    const requestedUserId = req.params.id;
    const user = res.locals.user;
    const {email} = req.body; 

    if(requestedUserId === user.id){
        User.findOne( {email}, function(err, existingUser){
            if(err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
                }
            if(existingUser){
                if (existingUser.id === user.id){
                    next();
                }else{
                    return res.status(422).send({errors: [{title: 'Invalid email', detail: 'A user with this email already exist!'}] });
                }
            }else{
                next();
            }   
        });
    }
}


//for  request activation button
exports.requestActivation = function(req, res){
    
   // const requestedUserId = req.params.id;
    const user = res.locals.user;
    const userData = req.body;
    activationEmail(res,req, user.email);
    return res.json('done');
}


// To update password in Account
exports.updatePassword  = function(req,res){
    const requestedUserId = req.params.id;
    const user = res.locals.user;
    const userData = req.body;
    const {email, password, newPassword, passwordConfirmation} = req.body;
 
    if (!email || !password || !passwordConfirmation ){
        return res.status(422).send({errors: [{title: 'Data Missing!', detail: 'Provide username, email and password!'}] });
    }
   
 
        
    
        //return res.status(422).send({errors:[{title: 'valid User!', detail: 'found e mail'}]})
       
        User.findById(requestedUserId,function(err,foundUser){
            
            if(err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            if (foundUser.id !== user.id){
                return res.status(422).send({errors:[{title: 'Invalid User!', detail: 'This is  not your User '}]});
            }
            if(foundUser.email !== email){
                return res.status(422).send({errors:[{title: 'Invalid User!', detail: 'Not Rental Owner E mail'}]}); 
            }
            if (newPassword !== passwordConfirmation){ // if passwords doesn't match the confirmation pass
                // send error message
                return res.status(422).send({errors: [{title: 'Invalid password', detail: 'Password is not the same as confirmation!'}] });
            }
            if(user.activated !== true){
                //If user is not activated by e mail
                return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'User is not activated!'}] });
               
            }
                
            
           
            if (foundUser.hasSamePassword(password)) {
                
                userData.password = userData.newPassword;
             
                    //return res.status(422).send({errors: [{title: 'valid', detail: 'You found user With same password!'}] });
                    saveAccount(res,req,userData,foundUser);
            }else{
                    return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email or password'}] }); 
            }
        
        })
   


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
                        username: user.username,
                        randomToken: user.randomToken,
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
    const {username, email, password, passwordConfirmation, activated} = req.body; // variables that holds user input data
  
  
   
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
                password,
                activated
              
            });
            user.activated = false;
           // user.ipToken = ipaddress;
            
            const userp = new UserP({
                username: req.body.username,
                user 
            });
          
            
            //saves user data to database (checks for errors first)
            user.save(function(err){
                if(err){// if there is an error
                    return res.status(422).send({errors: normalizeErrors(err.errors)});// return mongoose error
                }
                if(user){
                    sendActivationEmail(res,req,email);
                    return res.json({'registered': true});
                }
            });
           
         
            userp.save(function(err){
                if(err){// if there is an error
                    return res.status(422).send({errors: normalizeErrors(err.errors)});// return mongoose error
                }
            });
             

          

        }); 
      
}

// auto request activation confirmation, after registering 
function sendActivationEmail(res,req,email){

    activationEmail(res,req,email);
    
}




//Request  activation function
function activationEmail(res,req,email){

    User.findOne({email}, function(err, foundUser){
        if(err){// if there is an error
            return res.status(422).send({errors: normalizeErrors(err.errors)});// return mongoose error
        }
      if(foundUser.id){
        const token =  jwt.sign({
            userId: foundUser.id,
            username: foundUser.username,
            randomToken: foundUser.randomToken,
            email: foundUser.email
        }, config.SECRET, {expiresIn: '1h'});

     const msg ={
                from: 'jibreelutley@jmu3d.com',
                to: foundUser.email,                   // http://localhost:4200/users/resetpassword/form/
                subject: 'BookWithMe Account Activation',    // https://jmu-bwm-ng.herokuapp.com/users/resetpassword/form/
                text: 'Hello '+ foundUser.username+', You recently Registered to a new account. click this link '+'https://jmu-bwm-ng.herokuapp.com/users/activation'+ token,
                html: 'Hello '+ foundUser.username+'</strong>,<br><br>, You recently registered to a new account. Please click this link '+'<a href ="'+'https://jmu-bwm-ng.herokuapp.com/users/activation/'+token+'">Activate Account</a>'
              }
              sgMail
                  .send(msg)
                  .then(() => {
                  //Celebrate
                  })
                  .catch(error => {
              
                  //Log friendly error
                  console.error(error.toString());
              
                  //Extract error msg
                  const {message, code, response} = error;
              
                  //Extract response msg
                  const {headers, body} = response;
                  });
                //res.json({success: true, message: 'Link to Activate Account has been sent to e mail'});
                } 
    });

}



//To authorize User
exports.authMiddleware = function(req, res, next){

    let token = '';
    const url = req.url;


    switch (url) {
        case '/activation/'+req.params.token :
            token = 'Bearer '+ req.params.token;
          break;
        case '/resetpassword/form/'+req.params.token:
            token = 'Bearer '+ req.params.token;
          break;
       default:
            token = req.headers.authorization;
         break;
      }

    try{
        const user = parseToken(token);
        const rand = user.randomToken;
        if (token){
           
            User.findById(user.userId, function(err, user){
                if (err){
                    return res.status(422).send({errors: normalizeErrors(err.errors)});
                }
                
                if (user){
                  
                    res.locals.user = user;
                    res.locals.userp = user;
                    if(rand !== user.randomToken){
                        return res.status(422).send({errors: [{title: 'Invalid Token', detail: 'Token has expired'}] });
                    }
                    
                    next();
                }else{
                    return notAuthorized(res);
                }
            })
            
        }else{
            return notAuthorized(res);
        }
    }catch (ExpiredJwtException) {
        return res.status(401).send({errors: [{title: 'Invalid Token', detail: 'Access Denied!'}] });
    }
}



function parseToken(token){  
   
    return jwt.verify(token.split(' ')[1], config.SECRET);

}

function notAuthorized(res){

    return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access.'}] });
  
}














// Forgot password, request to change
exports.forgotPassword = function(req, res){
  
    //const userData = req.body;
    const {email} = req.body;

  User.findOne({email},function(err, existingUser){
    if (err){
          return res.status(422).send({errors:[{title: 'Invalid E mail!', detail: 'E-mail was not found!'}]});
    }
    const token =  jwt.sign({
        userId: existingUser.id,
        username: existingUser.username,
        randomToken: existingUser.randomToken,
        email: existingUser.email
    }, config.SECRET, {expiresIn: '1h'});
  
    //newToken(token, userId, username, password);
    const msg ={
      from: 'jibreelutley@jmu3d.com',
      to: existingUser.email,                   // http://localhost:4200/users/resetpassword/form/
      subject: 'Localhost Password request',    // https://jmu-bwm-ng.herokuapp.com/users/resetpassword/form/
      text: 'Hello'+ existingUser.name+', You recently requested reset password. click this link '+'https://jmu-bwm-ng.herokuapp.com/users/resetpassword/form/'+ token,
      html: 'Hello'+ existingUser.name+'</strong>,<br><br>, You recently requested to reset password. Please click this link '+'<a href ="'+'https://jmu-bwm-ng.herokuapp.com/users/resetpassword/form/'+token+'">Reset Password</a>'
    }
    sgMail
        .send(msg)
        .then(() => {
        //Celebrate
        })
        .catch(error => {
    
        //Log friendly error
        console.error(error.toString());
    
        //Extract error msg
        const {message, code, response} = error;
    
        //Extract response msg
        const {headers, body} = response;
        });
      res.json({success: true, message: 'Link to Change Password has been sent to e mail'});
    
     
    });
  
  }
  
// for changing password  from forgotpass
exports.getPassChangeAuth = function(req, res){
  
    const user = res.locals.user;
   
    const { newPassword, passwordConfirmation} = req.body;

               
                if (!newPassword || !passwordConfirmation){
                    return res.status(422).send({errors: [{title: 'Data Missing!', detail: 'Provide username, email and password!'}] });
                }
                if(newPassword !== passwordConfirmation){
                    return res.status(422).send({errors: [{title: ' Data Error!', detail: 'New Password and Confirmation Password Does Not Match!'}] });
                }
                const requestedUserId = user.id;
                User.findById(requestedUserId,function(err,foundUser){
                    if (err){
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }
                    if (foundUser.id !== requestedUserId ){
                        return res.status(422).send({errors: [{title: 'Data Error!', detail: 'User Id Does not match!'}] });
                    }
                  
                    const userData = req.body;
                    userData.password = newPassword;
                    saveAccount(req,res,userData,foundUser,err); 
                
                });
    
   
}

function saveAccount(req,res,userData,foundUser,err){

    const user = res.locals.user;
     if(foundUser.email !== user.email ){
         if(foundUser.activated === false){
         activationEmail(res,req,foundUser.email);
         }
     }
     foundUser.set(userData);
     foundUser.save(userData,function(err){
         const user = res.locals.user;
         if (err){
             return res.status(422).send({errors: normalizeErrors(err.errors)});
         }
 
         return res.status(200).send(foundUser);
     }); 
  
 }

//To make account activated
exports.getActivation = function(req,res){

    const user = res.locals.user;
    const requestedUserId = user.id;
    //const ipaddress =  req.connection.remoteAddress;

    userData = req.body;

    User.findById(requestedUserId,function(err,foundUser){
        if (err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if (foundUser.id !== requestedUserId ){
            return res.status(422).send({errors: [{title: 'Data Error!', detail: 'User Id Does not match!'}] });
        }
        if (foundUser.email !== user.email ){
            return res.status(422).send({errors: [{title: 'Data Error!', detail: 'Email Does not match!'}] });
        }
        if (foundUser.activated === true ){
            return res.status(422).send({errors: [{title: 'Data Error!', detail: 'Account is already activated'}] });
        }
      /*
        if(ipaddress !== user.ipToken){
            return res.status(422).send({errors: [{title: 'Network error', detail: 'Network does not match! Please Activate account from the same Network you registered from'}] });
        }
*/

        
        
       
       userData.activated = true;
       userData.randomToken = Math.random();
       
        foundUser.set(userData);
        foundUser.update(userData,function(err){
            if (err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }

            return res.status(200).send(foundUser);
        });

    });

}





