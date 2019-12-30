const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    },
    usertype: {
        type: String,
        default: 'Parking company'
    },
    privileges: {
        type: Number,
        default: "1" //1 is simple user
    }
});

module.exports = mongoose.model('User', userSchema);