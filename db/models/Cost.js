const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    pricePerMinute: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cost', costSchema);