const mongoose = require('mongoose');

const parkingPlaceSchema = new mongoose.Schema({
    municipality: {
        type: String
    },
    location: {
        lat: {
            type: String,
            required: true
        },
        lng: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
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