const express = require('express');
const router = express.Router();

const hotelController = require('../controllers/hotelController');
const authController = require('../controllers/authController');

router.get('/',hotelController.getAllHotels);
router.post('/',authController.verifyToken,hotelController.addHotel);
router.put('/:id', authController.verifyToken,hotelController.editHotel);
router.post('/:id/feedback', authController.verifyToken,hotelController.giveFeedback);
router.get('/:id/feedbacks', hotelController.getAllFeedbacks);
router.delete('/:id',authController.verifyToken,hotelController.deleteHotel);
router.get('/searchByCategory', hotelController.searchHotelByCategory);
router.get('/searchByPrice', hotelController.searchHotelByPrice);


module.exports = router;
