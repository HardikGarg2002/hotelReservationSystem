const Hotel = require('../models/hotel');



async function getAllHotels(req, res){
    try{
    // const user = req.loggedInUser;
    if (!user.admin) {
        return res.status(400).json({ error: 'Unauthorized Access' });
      }
    const hotels = await Hotel.find();
    res.json(hotels);  
    }catch(error){
        res.status(500).json({ error: 'Failed to getall hotels' });
    }
};

async function addHotel (req, res){
    try{
    const user = req.loggedInUser;
    if (!user.admin) {
        return res.status(400).json({ error: 'Unauthorized Access' });
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

    if (!user.admin) {
        return res.status(400).json({ error: 'Unauthorized Access' });
    }
    const hotel = req.body;
    const id = req.params.id;
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(id,hotel);
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

    if (!hotel) {
      return res.json({ error: 'Hotel not found' });
    }
    hotel.feedbacks.push(feedback);
    await hotel.save();

  } catch (err) {
    console.error(err);
    res.json({ error: 'Server Error' });
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
      
      res.json(hotels);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to perform hotel search' });
    }
}

async function searchHotelByPrice(req,res){
    try {
        const { minCost, maxCost } = req.params;
        const hotels = await Hotel.find({
            cost : { $gte: minCost, $lte: maxCost },
        });
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
            return res.json({ error: 'Hotel not found' });
        }

        await Hotel.findByIdAndUpdate(hotelId,{isActive : false});
        res.status(200).send("hotel deleted successfully");
    }catch(error){
        res.status(500).json({ error: 'Failed to delete hotel' });
    }
}



module.exports = { getAllHotels,addHotel,editHotel,giveFeedback,getAllFeedbacks,searchHotelByCategory,searchHotelByPrice,deleteHotel}