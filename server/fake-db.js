
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
             //this.pushDataToDb(1);
            
            } catch(error){
                console.log(error);
            }
        }
    }
    module.exports = FakeDb;  // enables importing to another file
    /*
    **************************************** 
    Note: Must  Register as a rental owner before creating and  booking rentals
     Important Test List:
     1. test registration system (check)
     2. test login system (check)
     3. test activation system including activation (check) re-submit, from profile (check) (user options should be limited before activation) (from registered users only)
     4. test forgot password  (check)                                               (from registered users only)
     5. test change password from profile (check)
     6. test change username and email from profile   (check)                        (from registered users only)
     7. test registering as a rental owner (includes debt card submission) (checked)
     8. test to see when  rental owner is verified ( verification stays false untill rental owner registration and card submission is complete) (checked)
     9. test withdrawing  money from account (checked)
     10.test uploading profile picture (checked)
     11. test Creating Rental (checked)
     12. Test editing Rental (checked)
     13. Test Booking  (includes datepicker booking  submition and seeing bookedout dates on calendar)(checked)
     14. test manage booking ( accept booking to receive money from rental owner & see receipts of  booked dates from customer) (checked)
     15. test User  profile edits  and Public User profile (checked)
     16. Test user rental list on public and private profile (check if rental links of user displays and works)(checked)
     17. Test  Public rental page and Search engine on rentals (rental needs to be displayed)(checked)

    */