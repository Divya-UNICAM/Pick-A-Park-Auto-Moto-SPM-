const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    startingLocation: {
        type: Object,
        required: true
    },
    targetLocation: {
        type: Object,
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
    assignedplace: {
        type: Object
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