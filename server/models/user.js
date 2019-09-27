
// Rental.js is used as a data stuct similar to rental.model.ts
//extra rules are set up  for serverside transfer
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//  create front end rules  for entering information
const userSchema = new Schema({
        username: {
            type: String,
            min: [4, 'Too short, min is 4 characters'],
            max: [32, 'Too long, max is 32 characters']
        },
        email: {
            type: String,
            min: [4, 'Too short, min is 4 characters'],
            max: [32, 'Too long, max is 32 characters'],
            unique: true,
            lowercase: true,
            required: 'Email is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
        },
        password: {
            type: String,
            min: [4, 'Too short, min is 4 characters'],
            max: [32, 'Too long, max is 32 characters'],
            required: 'Password is required'
        },
        name: {
            type: String,
            min: [4, 'Too short, min is 4 characters'],
            max: [32, 'Too long, max is 32 characters']
        },
        phone:Number,
        image:String,
        address:String,
        stripeCustomerId: String,
        stripeCid: String,
        about: String,
        revenue: Number,
        randomToken: String,
        stripeAccountId: String,
        rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}], // reference rental array ids for user
        bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking'}], // reference booking array ids for user
      
    
});
//Compare Encrypted passwords
userSchema.methods.hasSamePassword = function(requestedPassword){   
    return bcrypt.compareSync(requestedPassword, this.password);
    }

userSchema.pre('save', function(next){
    const user = this;
    user.randomToken = Math.random();
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
    user.password = hash;
    next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);





