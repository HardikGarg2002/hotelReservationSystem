const express= require('express');
const app = express();
require("dotenv").config();
const PORT =process.env.PORT || 5000;

const cors = require('cors');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(cors());

const authRouter = require("./routes/authRoute");
const hotelRouter = require("./routes/hotelRoute");
const conn = require('./Utils/dbUtils');
const bookingRouter = require("./routes/bookingRoutes");


conn.initDB();

app.use("/auth",authRouter);
app.use("/hotels",hotelRouter);
app.use("/hotel/:id/booking",bookingRouter);
app.get("/",(req,res)=>{
    res.send("home page dashboard");
})

process.on("SIGINT", () => {
    conn.disconnectDB();
    console.log("Closing server");
    process.exit();
});

process.on("exit", () => {
    console.log("Server closed");
});

// app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));


app.listen(PORT,()=>{
    console.log("server listening at port no.",PORT);
})