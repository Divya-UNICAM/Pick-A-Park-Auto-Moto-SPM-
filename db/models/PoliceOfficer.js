const mongoose = require('mongoose');

const policeOfficerSchema = new mongoose.Schema({
    municipality: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobs :{
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

module.exports = mongoose.model('PoliceOfficer', policeOfficerSchema);