const express = require('express');
const app = express();
app.use(express.static('public'));
const Booking = require('../models/booking');
// const PORT = process.env.PORT;
const stripe = require('stripe')('sk_test_51NGQJ1SIHaxxv2Kbv0WKF2S8aS81WrlAFoo6Miyl9R5hG4sU7aPjQx3lEC7nWnp2upyVG9ltoG6u4IElUSuCII5o00RwH6mYwd');

const YOUR_DOMAIN = 'http://localhost:3000';

async function makePayment(req,res){
    try{
        
        const user = req.loggedInUser;
        const bookings = await Booking.find({user: user._id});
        if(bookings.length == 0){
            throw new Error("no user bookings found")
        }
        let totalCost = 0;
        for(let i=0;i<bookings.length;i++){
            totalCost+=bookings[i].cost;
        }
        
        const session = await stripe.checkout.sessions.create({
            
            line_items: [
                {
                  price_data: {
                    currency: 'inr',
                    product_data: {
                      name: 'HotelRoom',
                    },
                    unit_amount: totalCost*100,
                  },
                  quantity: 1,
                },
              ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
          });
          console.log(session.url);
          for(let i=0;i<bookings.length;i++){
            bookings[i].paymentStatus = paid;
          }
          bookings.save();
          res.redirect(session.url);

    }catch(error){
        console.log("payment failed");
        res.status(500).json({error : error})
    }
}


module.exports = {makePayment};