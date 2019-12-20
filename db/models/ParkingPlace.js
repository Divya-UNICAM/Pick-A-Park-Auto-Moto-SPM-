const mongoose = require('mongoose');

const parkingPlaceSchema = new mongoose.Schema({
    municipality: {
        type: Object
    },
    sensors :{
        type : Array
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'FREE',
    }
});

module.exports = mongoose.model('ParkingPlace', parkingPlaceSchema);