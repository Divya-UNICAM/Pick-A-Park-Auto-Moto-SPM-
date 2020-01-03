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
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    policeOfficers : {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Municipality', municipalitySchema);