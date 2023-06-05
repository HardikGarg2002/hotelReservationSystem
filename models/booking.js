const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  roomType: {
    type: String,
  },
  cost : {
    type: Number,
    default: 0
  },
  paymentStatus:{
    type: String
  }

});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
