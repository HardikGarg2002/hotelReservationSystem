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
module.exports = {initDB};