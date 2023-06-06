const express= require('express');
const app = express();
require("dotenv").config();
const PORT =process.env.PORT || 5000;
const authRouter = require("./routes/authRoute");
const hotelRouter = require("./routes/hotelRoute");
const conn = require('./Utils/dbUtils');
const bookingRouter = require("./routes/bookingRoutes");
app.use(express.json())

conn.initDB();

app.use("/auth",authRouter);
app.use("/",hotelRouter);
app.use("/",bookingRouter);
app.get("/",(req,res)=>{
    res.send("home page dashboard");
})


app.listen(PORT,()=>{
    console.log("server listening at port no.",PORT);
})