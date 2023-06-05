const Hotel = require('../models/hotel');



async function getAllHotels(req, res){
    // const user = req.loggedInUser;
    // if (!user.admin) {
    //     return res.status(400).json({ error: 'Unauthorized Access' });
    //   }
    const hotels = await Hotel.find();
    res.json(hotels);  
};

async function addHotel (req, res){
    const user = req.loggedInUser;
    if (!user.admin) {
        return res.status(400).json({ error: 'Unauthorized Access' });
      }
    const hotel = req.body;
    const result = await Hotel.create(hotel);
    
    res.json({message: "hotel added successfully"});
  
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
      const feedbacks = hotel.feedbacks;
      res.json(feedbacks);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  };


  async function searchHotels(req, res){
    try {
      const { location,roomType } = req.query;
  
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

module.exports = { getAllHotels,addHotel,editHotel,giveFeedback,getAllFeedbacks,searchHotels}