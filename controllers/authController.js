const jwt = require("jsonwebtoken");
const User = require('../models/user');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

async function registerUser(req,res){
    let { name,phoneNumber,email,password} = req.body;
    // console.log(name,phoneNumber,email,password);

    const salt = await bcrypt.genSalt(5);
    password = await bcrypt.hash(password,salt);

    const otp = generateOtp();
    // sendOtpToEmail(email,otp);

    const user = new User ({
        "name" : name,
        "phoneNumber": phoneNumber,
        "email": email,
       "password": password,
        "emailOtp": otp
    })
    
    await user.save();
    res.send("user registered successfully");
}

async function generateToken(req,res){
    const {email,password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        throw new Error( "User not found");
    }
    // console.log(password,user.password);
    var correctPassword = await bcrypt.compare(password,user.password);
    if(!(correctPassword)){
        console.log("incorrect password");
        throw new Error( "password not correct")
    }

    await User.updateOne({email: email},
        {$set: {
                "isActive" : true
    }})

    var token = jwt.sign(user.toObject(), process.env.SECRET_KEY, { expiresIn: '5h' });

    res.json({authentication : token});
 }


async function sendOtpToEmail(email,otp){
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
        subject: "OTP Verifictaion",
        html: `<b> OTP for verification: ${otp}  </b>`, // html body
      });

}

function generateOtp(){
    const otp = Math.floor(Math.random()*100000);
    console.log(otp);
    return otp;
}


async function verifyEmail(req,res){
    const {email,otp} = req.body;
    const user = await User.findOne({email: email});
    console.log(user);
    if(!(otp==user.emailOtp)){
        throw new Error("otp verification failed")
    }

    await User.updateOne({email: email},
        {$set: {
                "verification.emailVerified" : true
    }})

    res.json({message: "otp verified succcessfuly"});
}


async function verifyToken(req,res,next) {
    try{
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if (!token)
      throw new Error({ message: "Token not present" });
    

    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    
    const user = await User.findOne({ email: payload.email});
    if (!user) {
        throw new Error("User not found");
    } 
    req.loggedInUser = user;
    console.log("user token verified")
    next();
    return user;
    }
    catch (error) {
        console.error("Token verification error:", error);
        // Handle the error and send an appropriate response
        res.status(401).json({ error: error.message });
      }
};

async function logOut(req,res) {
    try{

    const user = req.loggedInUser;
    console.log("In Auth logout ");
    await User.findOneAndUpdate({ email : user.email }, { token: "" });
    res.json({message: "user logged out"})
    
    }catch(error){
        res.status(400).json({errorMessage: "error while logging out"})
    }

  };

module.exports = {registerUser,generateToken,verifyEmail,verifyToken,logOut};