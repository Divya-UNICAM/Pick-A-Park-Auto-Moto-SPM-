const mongoose = require('mongoose');

const municipalitySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min: 6,
        max: 255
    },
    province : {
        type: String,
        required: true
    },
    region : {
        type: String,
        required: true
    },
    postcode : {
        type: String,
        required: true,
        min: 5,
        max: 5
    },
    parkingPlaces: {
        type: Array
    },
    policeOfficers : {
        type: Array
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Municipality', municipalitySchema);