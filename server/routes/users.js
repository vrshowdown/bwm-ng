const express = require ('express'); // nodejs framework
const User = require('../controllers/user'); // adds route handler 
const UserP = require('../controllers/userp'); // adds route handler 
const router = express.Router(); //using routing method



router.get('/owner/:id', UserP.getUserP);

router.post('/forgotpassword/email', User.forgotPassword);
router.put('/resetpassword/form/:token',User.authMiddleware,User.getPassChangeAuth);


// for user info on profile
router.get('/:id', User.authMiddleware, User.getUser);
// for Update user info on profile
router.patch('/:id', User.authMiddleware, User.updateUser);
router.patch('/:id/account', User.authMiddleware, User.checkEmailforUpdate,User.updateAccount);
router.patch('/:id/password', User.authMiddleware, User.updatePassword);
// route based on registration and authentication Process
router.post('/auth', User.auth);
router.post('/register', User.register); 
router.put('/activation/:token',User.authMiddleware,User.getActivation);
router.post('/resendactivation',User.authMiddleware,User.requestActivation);  


//to get rental detail by id


module.exports = router;