
const Rental =require('./models/rental');  // adds model
const User =require('./models/user');
const UserP =require('./models/userp');
const Booking = require('./models/booking');

const fakeDbData = require('./data.json');
class FakeDb{

    constructor(){  
        this.rentals = fakeDbData.rentals;
        this.users = fakeDbData.users;
        this.userp = fakeDbData.userps;
    }

    
    async cleanDb(){    // removes all rentals
        try{
            await Rental.deleteMany({});
            await User.deleteMany({});  //make sure  remove is executed first before  anything else starts
            await Booking.deleteMany({});
            await UserP.deleteMany({});
        }catch(error){
            console.log(error);
        }
        // DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
    }


   pushDataToDb(num){
        //USer 1
        const user = new User(this.users[num]);
        const userp = new UserP({
            username: this.users[num].username,
            user,
        });
       //user1 rentals
        this.rentals.forEach((rental) => {      // forloops each rental to save to database
                const newRental = new Rental(rental);
                newRental.user = user;
                newRental.userp = userp;
                user.rentals.push(newRental);
                newRental.save();   // saves each rental data           
        });
            user.save();
            userp.save();
        }

        async seedDb(){
            try{
            await this.cleanDb(); //removes data from database  
             this.pushDataToDb(0);   // saves data to database
             this.pushDataToDb(1);
            
            } catch(error){
                console.log(error);
            }
        }
    }
    module.exports = FakeDb;  // enables importing to another file