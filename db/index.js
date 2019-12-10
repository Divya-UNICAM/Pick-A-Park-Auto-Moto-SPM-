const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

function connect() {
    return mongoose.connect(
        process.env.MONGO_URI,
        { 
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
};

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };