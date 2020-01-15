const mongoose = require('mongoose');
const Municipality = require('./Municipality');

const sensorSchema = new mongoose.Schema({
    parkingplace: {
        type: String
    },
    position: {
        type: Number,
        required: true
    },
    ipAddress: { //Each sensor that is part of the same ParkingPlace shares the same Ip address
        type: String,
        required:true
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