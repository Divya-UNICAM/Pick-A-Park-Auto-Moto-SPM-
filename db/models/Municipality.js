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
    zip : {
        type: String,
        required: true,
        min: 5,
        max: 5
    },
    sensors : {
        type: Array
    },
    policeofficers : {
        type: Array
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Municipality', municipalitySchema);