const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  amenities: [{
    type: String
  }],
  location:{
    type: String
  },
  photos: {
    type: String
  },
  category: {
    type: String
  },
  feedbacks: [{
    type: String
  }],
  roomType:{
    type: String,
  },
  avaliableRooms:{
    type: Number
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  cost :{
    type: Number,
    required : true
  }

});

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
