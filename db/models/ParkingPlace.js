const mongoose = require('mongoose');

const parkingPlaceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        max: 255
    },
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
    type: {
        type: String,
        default: 'Parking company',
        required: true
    }
});

module.exports = mongoose.model('ParkingPlace', parkingPlaceSchema);