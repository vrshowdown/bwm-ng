// this file represents the configuration to connect to database
const express = require('express');  // import express framework in node
const  mongoose = require('mongoose'); // lib  for to connect to database
const bodyParser = require('body-parser');// to parse info from  responses
const  config = require('./config'); //connection address to db
const Rental =  require('./models/rental'); // Rental model for database
const FakeDb = require('./fake-db');  //adds file to push data
const path = require('path');

const rentalRoutes = require('./routes/rentals'),
       userRoutes = require('./routes/users'),
       bookingRoutes = require('./routes/bookings');
// username and password entered into the URI

mongoose.connect(config.DB_URI,{ useNewUrlParser: true }).then(() =>{
   if (process.env.NODE_ENV !== 'production') {
      const fakeDb = new FakeDb();
      //fakeDb.seedDb();
   }
});


const app = express(); // assigning app variable all the functions  required to run  server side application
app.use(bodyParser.json());

app.use('/api/v1/rentals', rentalRoutes); //Express Middleware to manage  to retrieve route  from rental.js
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

if (process.env.NODE_ENV === 'production') {
   const appPath = path.join(__dirname, '..', 'dist');
   app.use(express.static(appPath));

   app.get('*', function(req, res){
      res.sendFile(path.resolve(appPath, 'index.html'));
   });
}
// at localhost:3001 OR a assigned environment PORT is available,    function is be called when  application is running
const PORT = process.env.PORT || 3001;

//used to allow server-side code listen to front end functions
// at localhost:3001  is available,    function is be called when  application is running
app.listen(PORT, function(){
console.log('I am running!');
});

