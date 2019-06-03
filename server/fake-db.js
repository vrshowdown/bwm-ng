
const Rental =require('./models/rental');  // adds model
const User =require('./models/user');
const Booking = require('./models/booking');

const fakeDbData = require('./data.json');
class FakeDb{

    constructor(){
        this.rentals = fakeDbData.rentals;
        this.users = fakeDbData.users ;
    }

    
async cleanDb(){    // removes all rentals
    await Rental.deleteMany({});
    await User.deleteMany({});  //make sure  remove is executed first before  anything else starts
    await Booking.deleteMany({});
    // DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
}


pushDataToDb(){
    const user = new User(this.users[0]);
    const user2 = new User(this.users[1]);
        this.rentals.forEach((rental) => {      // forloops each rental to save to database
            const newRental = new Rental(rental);
            newRental.user = user;
            user.rentals.push(newRental);
            newRental.save();   // saves each rental data
        });
        user.save();
        user2.save();
    }

    async seedDb(){
        await this.cleanDb(); //removes data from database  
         this.pushDataToDb();   // saves data to database
    }
}
module.exports = FakeDb;  // enables importing to another file