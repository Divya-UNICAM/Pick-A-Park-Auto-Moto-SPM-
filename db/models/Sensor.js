const mongoose = require('mongoose');
const Municipality = require('./Municipality');

const sensorSchema = new mongoose.Schema({
    parkingPlace: {
        type: String
    },
    position: {
        type: Number,
        required: true
    },
    update: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    detected: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "FREE"
    }
});

module.exports = mongoose.model('Sensor', sensorSchema);