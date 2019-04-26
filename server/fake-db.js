
const Rental =require('./models/rental');  // adds model
const User =require('./models/user');
class FakeDb{ 

    constructor(){
        this.rentals = [{
            title: "Nice view on ocean",
            city: "San Francisco",
            street: "Main street",
            category: "condo",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 4,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 43
            },
            {
            title: "Modern apartment in center",
            city: "New York",
            street: "Time Square",
            category: "apartment",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 1,
            shared: false,
            description: "Very nice apartment in center of the city.",
            dailyRate: 11
            },
            {
            title: "Old house in nature",
            city: "Spisska Nova Ves",
            street: "Banicka 1",
            category: "house",
            image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
            bedrooms: 5,
            shared: true,
            description: "Very nice apartment in center of the city.",
            dailyRate: 23
            }];
            this.users = [{
                username: "Test User",
                email: "test@gmail.com",
                password: "testtest"
            }];
    } 

    
async cleanDb(){    // removes all rentals
    await Rental.deleteMany({});
    await User.deleteMany({});  //make sure  remove is executed first before  anything else starts
    // DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
}


pushDataToDb(){
    const user = new User(this.users[0]);
        this.rentals.forEach((rental) => {      // forloops each rental to save to database 
            const newRental = new Rental(rental);
            newRental.user = user;
            user.rentals.push(newRental);
            newRental.save();   // saves each rental data
        });
        user.save();
    }

    async seedDb(){
        await this.cleanDb(); //removes data from database  
         this.pushDataToDb();   // saves data to database
    }
}
module.exports = FakeDb;  // enables importing to another file