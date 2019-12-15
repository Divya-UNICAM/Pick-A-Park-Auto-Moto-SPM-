const mongoose = require('mongoose');
const Municipality = require('./Municipality');

const sensorSchema = new mongoose.Schema({
    location: {
        lat: {
            type: String,
            required: true
        },
        lng: {
            type: String,
            required: true
        }
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