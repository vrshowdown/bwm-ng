
const Rental =require('./models/rental');  // adds model

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
            }]
    } 

    
async cleanDb(){    // removes all rentals
    await Rental.deleteMany({});  //make sure  remove is executed first before  anything else starts
    // DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
}


    pushRentalsToDb(){
        this.rentals.forEach((rental) => {      // forloops each rental to save to database 
            const newRental = new Rental(rental);
            newRental.save();   // saves each rental data
        })
    }

    seedDb(){
    this.cleanDb(); //removes data from database  
     this.pushRentalsToDb();   // saves data to database
    }
}
module.exports = FakeDb;  // enables importing to another file