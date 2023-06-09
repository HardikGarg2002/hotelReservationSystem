const Hotel = require('../models/hotel');
const Booking = require('../models/booking')
const authController = require('./authController');

async function getAllHotels(req, res){
    try{
    // const user = req.loggedInUser;
    // if (!user.admin) {
    //     return res.status(400).json({ error: 'Unauthorized Access' });
    //   }
    console.log('in get All hotels');
    const hotels = await Hotel.find();
    
    if(req.headers.authorization){
      await authController.verifyToken(req,res);
      const user = req.loggedInUser;

      if(user.admin==true){
        console.log(hotels.length)
        return res.status(200).json(hotels);
      }
    }

    const activeHotels = [];
    for(let i=0; i< hotels.length;i++){
      
      if(hotels[i].isActive){
        activeHotels.push(hotels[i]);
      }
    }
    console.log("active hotels are" ,activeHotels.length);
    return res.json(activeHotels);  
    }catch(error){
        res.status(500).json({ error: 'Failed to getall hotels' });
    }
};


async function getAllHotelsForAdmin(req,res){
  try{
    const user = req.loggedInUser;
    if(!user.admin){
      throw new Error("Only admin can make this request ")
    }
    const hotels = await Hotel.find();
    res.json(hotels);  

    }catch(error){
        res.status(500).json({ error: 'Failed to get all hotels' });
    }

}

async function addHotel (req, res){
    try{
    const user = req.loggedInUser;
    if (!user.admin) {
        return res.status(401).json({ error: 'Unauthorized Access' });
      }
    const hotel = req.body;
    const result = await Hotel.create(hotel);
    
    res.json({message: "hotel added successfully" , hotelid : result._id});
    }catch(error){
        console.log("error in adding hotel")
        res.status(500).json({ error: 'Failed to add hotels' });
    }
};

async function editHotel (req, res) {
    const user = req.loggedInUser;
    if (!user.admin) {
        return res.status(401).json({ error: 'Unauthorized Access' });
    }
    const updates = req.body;
    const id = req.params.id;
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(id,updates, {new: true});
        res.json(updatedHotel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

async function giveFeedback (req, res){
  try {
    const { feedback } = req.body;
    const hotel = await Hotel.findById(req.params.id);
    const user = req.loggedInUser;
    const bookings = Booking.find({user: user._id});
    if(!bookings){
      return res.status(402).json({message: "user need to book a hotel to give feedback"})
    }
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    hotel.feedbacks.push(feedback);
    await hotel.save();
    return res.status(200).json({message: "feedback accepted"})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
};

async function getAllFeedbacks (req, res){
    try {
      const hotelId = req.params.id;
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.json({ error: 'Hotel not found' });
      }
      const feedbacks = hotel.feedbacks;
      if(feedbacks.length===0) {
        res.status(200).json({message: "Hotels do not have feedbacks"})
      }
      res.json(feedbacks);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  };


  async function searchHotelByCategory(req, res){
    try {
      const { location,roomType } = req.body;
  
      // Perform the search based on the provided criteria
      const hotels = await Hotel.find({
        location: location,
        roomType: roomType
      });
      if(hotels.length===0){
        res.status(200).json({message: "Modify preference, no hotel with this category"})
      }
      res.json(hotels);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to perform hotel search' });
    }
}

async function searchHotelByPrice(req,res){
    try {
        const { minCost, maxCost } = req.body;
        const hotels = await Hotel.find({
            cost : { $gte: minCost, $lte: maxCost },
        });
        if(hotels.length===0){
          return res.status(200).send({message: "no hotel within this cost range"})
        }
        res.status(200).json(hotels);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

async function deleteHotel(req,res){
    try{
        const hotelId= req.params.id;
        const user = req.loggedInUser;
        if(!user.admin) throw new Error({message: "not authorised to delete the hotel"})
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(200).json({ error: 'Hotel not found' });
        }

        const result =await Hotel.findByIdAndUpdate(hotelId,{isActive : false});
        if(!result){
          res.status(200).json({message: "hotel already deleted"})
        }
        res.status(200).send("hotel deleted successfully");
    }catch(error){
        res.status(500).json({ error: 'Failed to delete hotel' });
    }
}



module.exports = { getAllHotels,getAllHotelsForAdmin,addHotel,editHotel,giveFeedback,getAllFeedbacks,searchHotelByCategory,searchHotelByPrice,deleteHotel}