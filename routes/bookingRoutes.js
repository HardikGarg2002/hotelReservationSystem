const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');


router.post('/',authController.verifyToken, bookingController.makeBooking);
router.delete('/:bookingId',authController.verifyToken, bookingController.cancelBooking);
router.get('/',authController.verifyToken,bookingController.getAllBookingsOfHotel)
router.get('/user',authController.verifyToken, bookingController.getUserBookings)

module.exports = router;
