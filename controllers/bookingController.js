const Booking = require('../models/booking');
const Hotel = require('../models/hotel');
const nodemailer = require('nodemailer');

// Create a hotel booking
async function makeBooking (req, res){
  try {
    const hotelId = req.params.hotelId;
    const {checkInDate, checkOutDate, roomType,roomsRequired } = req.body;
    const hotel = await Hotel.findById(hotelId);
    const paymentStatus = req.body.paymentStatus || "unpaid";
    if (!hotel) {
      console.error('hotel not found');
      return res.status(404).json({ error: 'Hotel not found' });
    }
    if(!hotel.isActive){
        console.error("hotel not listed")
        return res.status(404).json({error:'hotel no longer listed'})
    }
    if(hotel.avaliableRooms< roomsRequired) {
      console.error('Rooms are not available in this hotel');
      return res.status(400).json({ error: 'Rooms are not available in this hotel' });
    }


    // validation checks on dates
    const today = new Date();
    // const day = today.getDate();
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();
    
    if(today> new Date(checkInDate) && today> new Date(checkOutDate)){
        throw new Error("CheckIn date can not be in past")  
    }
    const bookings = await Booking.find({
      hotel: hotelId,
      checkIndate: {$lte :checkOutDate},
      checkOutDate : {$gte : checkInDate}
    });
    const Rooms = hotel.avaliableRooms - bookings.length;
    if(bookings.length+roomsRequired>hotel.avaliableRooms){
      throw new Error({error:`Not enough rooms avalianble. you may book only ${Rooms}`});
    }

    const durationInDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / ( 24 * 60 * 60 * 1000)));

    const cost = durationInDays * hotel.cost* roomsRequired;

    const booking = new Booking({
      hotel: hotelId,
      user: req.loggedInUser._id,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      roomType: roomType,
      paymentStatus: paymentStatus,
      cost:cost
    });

    const result= await booking.save();

    hotel.avaliableRooms-=roomsRequired;
    await hotel.save();
    sendConfirmationEmail(hotel.name,req.loggedInUser.email);

    return res.json({ message: 'Reservation made successfully',bookingId:result._id});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to make a reservation' });
  }
};

async function cancelBooking(req,res){

  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ error: 'Booking not found' });
    }

    const hotel = await Hotel.findById(booking.hotel);

    // Update room availability
    hotel.avaliableRooms+=booking.roomsRequired;
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
async function getAllBookingsOfHotel(req,res){
  try{
    // Todo 
      const user = req.loggedInUser;
      if(!user.admin){
        throw new Error("Unauthorized access");
      }
      const hotelId = req.params.hotelId;
      const bookings = await Booking.find({hotel : hotelId})
      if(!bookings){
        return res.status(200).json({message: "no bookings found"});
      }
      return res.status(200).json(bookings);
    } catch(e){
        console.log(e);
        res.status(500).json({error : e});
      }
 }


async function getUserBookings(req,res){
  try{
    const user = req.loggedInUser;
    const bookings = await Booking.find({ user: user._id });
    if(!bookings){
      res.status(200).send("no bookings by the user");
    }
    res.send( bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user bookings' });
  }
}

module.exports = {makeBooking,cancelBooking,getUserBookings,getAllBookingsOfHotel};
