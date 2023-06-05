const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: function(name) {
                return /^[a-zA-Z0-9 ]*$/.test(name);
            },
            message: (props) =>
                `${props.value} contains special characters, only alphanumeric characters and spaces are allowed!`,
        },
    },
    pNumber : {
        type: String,
        
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true,
        
    },
    verification:{
        emailVerified:{
            type: Boolean,
            default: false
        },
        phoneVerified: {
            type: Boolean,
            default: false
        }
    },
    isActive:{
        type: Boolean,
        default: false
    },
    password: {
        type : String,
        required: true,
        validate: {
            validator: function(password) {
                var re =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return re.test(password);
            },
            message: (props) =>
                `${props.value} need to be atleast 8 characters long contains at least a uppercase char, a lowercase char, a number and a special character(@$!%*?&)`,
        },
    },
    emailOtp:{
        type: Number
    },
    admin : {
        type: Boolean,
        default: false
    },
    joinedOn:{
        type: Date,
        default: Date.now(),
        immutable: true,
    },
    
})

const User = mongoose.model('User',userSchema)
// userSchema.pre("save",function(next){

// })
module.exports = User;