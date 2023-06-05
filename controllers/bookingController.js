const Booking = require('../models/booking');
const Hotel = require('../models/hotel');

// Create a hotel booking
async function makeBooking (req, res){
  try {

    const { hotelId, checkInDate, checkOutDate, roomType } = req.body;
    const hotel = await Hotel.findById(hotelId);
    
    if(hotel.avaliableRooms<1) {
      return res.status(400).json({ error: 'Rooms are not available in this hotel' });
    }

    const booking = new Booking({
      hotel: hotelId,
      user: req.loggedInUser.id,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      roomType: roomType,
      paymentStatus: paid
    });

    await booking.save();

    hotel.avaliableRooms-=1;
    await hotel.save();

    res.json({ message: 'Reservation made successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to make a reservation' });
  }
};

async function cancelBooking(req,res){

  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ error: 'Booking not found' });
    }

    const hotel = await Hotel.findById(booking.hotel);

    // Update room availability
    hotel.avaliableRooms+=1;
    hotel.save();

    await Booking.findByIdAndRemove(bookingId);
    res.json({ message: 'Booking canceled successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};








module.exports = {makeBooking,cancelBooking};
