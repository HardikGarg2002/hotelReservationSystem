const express= require('express');
const app = express();
require("dotenv").config();
const PORT =process.env.PORT || 5000;

const cors = require('cors');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(cors());
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

const authRouter = require("./routes/authRoute");
const hotelRouter = require("./routes/hotelRoute");
const conn = require('./Utils/dbUtils');
const bookingRouter = require("./routes/bookingRoutes");
const paymentRouter = require('./routes/paymentRoutes');

conn.initDB();

app.use("/auth",authRouter);
app.use("/hotels",hotelRouter);
app.use("/hotel/:id/booking",bookingRouter);
app.use('/',paymentRouter)
app.get("/",(req,res)=>{
    res.send("home page dashboard");
})

process.on("SIGINT", () => {
    try{
    conn.disconnectDB();
    console.log("Closing sever");
    }catch(error){
        console.log('error during db connection close')
    }
    process.exit();
    

});

process.on("exit", () => {

    console.log("Server closed");
});

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));


app.listen(PORT,()=>{
    console.log("server listening at port no.",PORT);
})