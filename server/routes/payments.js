//Back End Booking Route
const express = require ('express'); // nodejs framework
const router = express.Router(); //using routing method
const UserCtrl = require('../controllers/user');
const PaymentCtrl = require('../controllers/payment');

router.get('', UserCtrl.authMiddleware, PaymentCtrl.getPendingPayments);

//accept and decline payments
router.post('/accept', UserCtrl.authMiddleware, PaymentCtrl.confirmPayment);
router.post('/decline', UserCtrl.authMiddleware, PaymentCtrl.declinePayment);

//create Stripe connected account
router.post('/createaccount', UserCtrl.authMiddleware, PaymentCtrl.stripeAcc, PaymentCtrl.StripeAccount,PaymentCtrl.StripeAgreement/*, PaymentCtrl.updateSAccount*/);

//add  bank card usa only
router.post('/accountcard', UserCtrl.authMiddleware, PaymentCtrl.CreateCardAccount);

//Accept Tos Agreement
router.post('/tosagreement', UserCtrl.authMiddleware, PaymentCtrl.StripeAgreement);
router.post('/updateaccount', UserCtrl.authMiddleware,PaymentCtrl.StripeAccount);/*StripeAccount*//* updateSAccount */

// transfer money to bank
router.post('/payout', UserCtrl.authMiddleware, PaymentCtrl.MoneyWithdrawl);
//router.get('/payouts',UserCtrl.authMiddleware,PaymentCtrl.Getpayouts);
//router.post('/fileidupload', UserCtrl.authMiddleware, PaymentCtrl.uploadPhotoId);
router.post('/deleteAcc', UserCtrl.authMiddleware, PaymentCtrl.deleteAccount);

module.exports = router;