const mongoose= require('mongoose');

const initDB =()=>{ 
    mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    })
    .then(()=>{
        console.log("database connected successfully")
    })
    .catch(err => console.log(err.reason));
}
const disconnectDB = () => {
    mongoose.disconnect();
    console.log("Database disconnected successfully");
}
module.exports = {initDB,disconnectDB};