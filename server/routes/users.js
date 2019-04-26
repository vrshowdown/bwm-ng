const express = require ('express'); // nodejs framework
const User = require('../controllers/user'); // adds route handler
const router = express.Router(); //using routing method
// route based on registration and authentication Process

router.post('/auth', User.auth);
router.post('/register', User.register);   

module.exports = router; 