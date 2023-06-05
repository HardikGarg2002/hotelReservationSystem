const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');


router.post('/booking/makebooking',authController.verifyToken, bookingController.makeBooking);
router.post('/bookings/cancelbooking',authController.verifyToken, bookingController.cancelBooking);

module.exports = router;
