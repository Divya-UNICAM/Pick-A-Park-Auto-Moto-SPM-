const mongoose = require('mongoose');
const Municipality = require('./Municipality');

const sensorSchema = new mongoose.Schema({
    municipality: {
        type: String
    },
    location : {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    update: {
        type: String
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
        required: true
    }
});

module.exports = mongoose.model('Sensor', sensorSchema);