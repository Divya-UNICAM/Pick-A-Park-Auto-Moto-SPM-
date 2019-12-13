const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    startingLocation: {
        type: String,
        required: true
    },
    targetLocation: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    licensePlate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model('Request', requestSchema);