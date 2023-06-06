const Booking = require('../models/booking');
const Hotel = require('../models/hotel');
const nodemailer = require('nodemailer');

// Create a hotel booking
async function makeBooking (req, res){
  try {

    const { hotelId, checkInDate, checkOutDate, roomType,paymentStatus,roomsRequired } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        res.status(404).json({ error: 'Hotel not found' });
      }
    if(!hotel.isActive){
        res.status(404).json({error:'hotel no longer listed'})
    }
    if(hotel.avaliableRooms< roomsRequired) {
      return res.status(400).json({ error: 'Rooms are not available in this hotel' });
    }


    // validation checks on dates
    const today = new Date();
    const day = today.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    if(today< new Date(checkInDate)){
        throw new Error("CheckIn date can not be in past")  
    }


    const durationInDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / ( 24 * 60 * 60 * 1000)));

    const cost = durationInDays * hotel.cost* roomsRequired;

    const booking = new Booking({
      hotel: hotelId,
      user: req.loggedInUser.id,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      roomType: roomType,
      paymentStatus: paymentStatus,
      cost:cost
    });

    await booking.save();

    hotel.avaliableRooms-=roomsRequired;
    await hotel.save();
    sendConfirmationEmail(hotel.name,req.loggedInUser.email);

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





async function sendConfirmationEmail(hotel,email){
    const transporter = nodemailer.createTransport({
        // connect with the smtp
        service: "gmail",
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        },
      });
    
      await transporter.sendMail({
        from: `<process.env.AUTH_EMAIL>`,
        to: email, 
        subject: "confirmation mail",
        html: `<b> your hotel ${hotel} is confirmed successfully  </b>`, // html body
      });
}


module.exports = {makeBooking,cancelBooking};
