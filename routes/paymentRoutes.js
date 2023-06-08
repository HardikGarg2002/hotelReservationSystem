const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const paymentController = require('../controllers/paymentController')

// router.route('/cost').get(authController.verifyToken,paymentController.getPaymentDetails);
router.route('/pay').post(authController.verifyToken,paymentController.makePayment);

// router.route('/pay/status').get(authController.verifyToken,paymentController.getPaymentstatus);

module.exports = router;