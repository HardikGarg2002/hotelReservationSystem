const express = require('express');
const router = express.Router();

const hotelController = require('../controllers/hotelController');
const authController = require('../controllers/authController');

router.get('/hotels',hotelController.getAllHotels);
router.post('/hotels',authController.verifyToken,hotelController.addHotel);
router.put('/hotels/:id', authController.verifyToken,hotelController.editHotel);
router.post('/hotels/:id/feedback', authController.verifyToken,hotelController.giveFeedback);
router.get('/hotels/:id/feedbacks', hotelController.getAllFeedbacks);

router.get('/hotels/searchByCategory', hotelController.searchHotels);


module.exports = router;
