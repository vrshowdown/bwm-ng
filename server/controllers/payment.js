const User = require('../models/user');
const UserP = require('../models/userp');
const Booking = require('../models/rental');
const Rental = require('../models/rental');
const Payment = require ('../models/payment');

const { normalizeErrors } = require('../helpers/mongoose');

const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SK);

const CUSTOMER_SHARE = 0.051;
//
exports.getPendingPayments = function(req, res) {
    const user = res.locals.user;
    Payment
    .where({toUser: user})
    .populate({
        path: 'booking',
        populate: {path: 'rental'}
    })
    .populate('fromUser')
    .exec(function(err, foundPayments){
        if (err){
        return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        return res.json(foundPayments);
    //return res.json({success: 'OK'});
    })
}

exports.confirmPayment = function(req, res){
    const payment =  req.body;
    const user = res.locals.user;
    Payment.findById(payment._id)
        .populate('toUser')
        .populate('booking')
        .exec(async function(err, foundPayment){
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if(foundPayment.status === 'pending' && user.id === foundPayment.toUser.id){
            const booking = foundPayment.booking;
            /*
            const charge = await stripe.charges.create({
                amount: booking.totalPrice * 100,
                currency: 'usd',
                customer: payment.fromStripeCustomerId
            }) */
            
            // STRIPE_FEE = 0.029;
            const PLATFORM_FEE = booking.totalPrice * CUSTOMER_SHARE*100;
         const charge = await stripe.charges.create({
              amount: booking.totalPrice * 100,
              currency: 'usd',
              customer: payment.fromStripeCustomerId,
              application_fee_amount: PLATFORM_FEE
            },{
              stripe_account: user.stripeAccountId,
            })

            if(charge){
                Booking.update({_id: booking.id}, {status: 'active'}, function(){});
                foundPayment.charge = charge;
                foundPayment.status = 'paid';
                foundPayment.save(function(err){
                    if(err){
                    return res.status(422).send({errors: normalizeErrors(err.errors)});
                    }
                    User.update({_id: foundPayment.toUser}, {$inc: {revenue: foundPayment.amount-30}}, function(err,user){
                        if(err){
                        return res.status(422).send({errors: normalizeErrors(err.errors)});
                        }
                        return res.json({status: 'paid'});
                    })
                })
            }
        }
    });
}

exports.declinePayment = function (req, res){
    const payment = req.body;
    const { booking } = payment;
    Booking.deleteOne({id: booking._id}, (err, deleteBooking)=>{
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        Payment.update({_id: payment._id}, {status: 'declined'}, function(){});
        Rental.update({_id: booking.rental}, {$pull: {bookings: booking._id}}, ()=>{});
        return res.json({status: 'deleted'});
    })
}


exports.MoneyWithdrawl = async function(req, res){
  debugger;
  const user =  res.locals.user;
  const userData =   req.body;
 
  User.findById(user.id,function(err,foundUser){
    if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    if(foundUser.activated !== true){
      return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'User is not activated!'}] });
     
    }
    
    if(foundUser.hasSamePassword(userData.password)){
     
        if(userData.amount > foundUser.revenue){
          return res.status(422).send({errors: [{title: 'Insuffecient funds', detail: 'The amount you requested is too high'}] });
        }
        stripe.payouts.create({
          amount: userData.amount.toString()*100,
          currency: 'usd',
          destination: user.stripeCid,
          },{stripe_account: user.stripeAccountId}).then(function(payout) {
            User.findById(user.id,function(err,foundUser){
              if(err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
              }
              User.update({_id: foundUser.id}, {$inc: {revenue:-userData.amount*100}}, function(err,user){});
            });

          });
          return res.json('payout');
        }else{
          return res.status(422).send({errors: [{title: 'Incorrect Password', detail: 'The password you entered is not correct'}] });
        }
     
    
    });
  
    }


    
    
// tos agreement
      exports.StripeAgreement = function(req, res) {
        debugger;
        const user =  res.locals.user;
       
        const personInfo =  req.body;
       
       const ipaddress =  req.connection.remoteAddress;
       User.findById(user.id,async function(err,foundUser){
          stripe.accounts.update(foundUser.stripeAccountId,
            {
              tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip:  ipaddress // Assumes you're not using a proxy
              }
            });
          });
        
           return res.json('Done');
        
      }


      //Create Stripe Account
exports.stripeAcc =  function(req, res, next){
        const user =  res.locals.user;
  
       
        User.findById(user.id,async function(err,foundUser){

          if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
          }
          
          if(foundUser.activated !== true){
            return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'User is not activated!'}] });
           
        }
          if(foundUser){
            if(user.stripeAccountId){
              //return res.status(422).send({errors:[{title: 'Account Exist!', detail: 'This User already has a Stripe account!'}]}); 
              //StripeAccount(req,res);
              next();
            }else{
              const account = await stripe.accounts.create({
                country: 'US',
                type: 'custom',
                requested_capabilities: ['card_payments', 'transfers'],
              },function(err, account) {
                  if(account){
                    User.update({_id: foundUser.id}, { $set: {stripeAccountId: account.id}}, () =>{
                      next();
                  });
                  
                 }
              });
            
            // return res.json('done');
          }//foundUser.Stripeacc else
        }//foundUser
      });//findById
      
  }




      
//update Account
exports.StripeAccount = function(req,res, next) {
        debugger;
        const personInfo =  req.body;
        const user =  res.locals.user;
      
  User.findById(user.id,function(err,foundUser){
    if(foundUser.activated !== true){
      return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'User is not activated!'}] }); 
    }
      stripe.accounts.update(
        foundUser.stripeAccountId,
           {
            business_type: 'individual',
            email: foundUser.email,
           

            individual:{ 
               //phone: personInfo.phone,
                //email: personInfo.email,
               // ssn_last_4:'',
               // id_number: '',
                //first_name: personInfo.firstName,
                //last_name: personInfo.lastName,
              //  dob:{
                   // day:'',
                   // month:'',
                  //  year:''
               // },
              //  address:{
                   // city:'',
                   // state:'',
                   // postal_code: '',
                   // line1: ''
              //  },
            },
            business_profile:{
               //url: 'www.jmu3d.com',
               mcc:'5734',
               product_description: "I provide services in renting out  Real Estate to my clients"
               
           },
           settings:{
             payouts:{
               schedule:{
                interval: 'manual'
               }

             }
            }
           

          });
          updateSAccount(req,res,foundUser.stripeAccountId);

          next();
        });
       
        //return res.json('done');
    }


   async function updateSAccount(req,res, stripeacc){
      debugger;
     
      const user =  res.locals.user;
       const token = req.body; // Using Express
   
       await stripe.accounts.update(
         //foundUser.stripeAccountId,
         stripeacc,
           {account_token: token.id},
           function(err, person) {
               // asynchronously called
               
           });  
    }






//not in use

/*
    exports.MoneyTransfer = function(req,res){
      const user =  res.locals.user;
        stripe.transfers.create({
            amount: 7000,
            currency: "usd",
            destination: user.stripeAccountId,
            transfer_group: "{ORDER10}",
          }).then(function(transfer) {
            // asynchronously called
          });
          return res.json('done');
    }




    exports.Getpayouts = function(req,res){
        stripe.payouts.retrieve(
            'payoutid',
            function(err, payout) {
              // asynchronously called
           
            });
    }
*/

//Add Debt card  to Connected account
 exports.CreateCardAccount =  function(req, res){
  debugger;
  const user =  res.locals.user;
  const card = req.body;
  stripe.accounts.createExternalAccount(
    user.stripeAccountId, 
        {
            external_account: card.bankToken.id
           
        },function(err, card) {
          debugger;
          updateCard(req, res, card);    
      });  
 }
 
 function updateCard(req, res, card){
  debugger;
  const user =  res.locals.user;
  const cards = req.body;
  User.findById(user.id,function(err,foundUser){
    User.update({_id: foundUser.id}, { $set: {stripeCid: card.id}}, () =>{});
  });
  return res.json('done');
}


    //not in use
     exports.deleteAccount = function(req, res){
      const user =  res.locals.user;
        stripe.accounts.del(user.stripeAccountId);
        return res.json('Done');
     }


 