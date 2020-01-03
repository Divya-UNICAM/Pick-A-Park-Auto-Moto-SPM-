const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    policeOfficer: {
        type: String
    },
    parkingPlace: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Job', sensorSchema);