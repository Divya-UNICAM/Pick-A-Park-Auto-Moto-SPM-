const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

var connection = null;

function connect(type) {
    if(connection === null)
        if(type === 'local')
            connection = mongoose.connect(
                process.env.LOCAL_MONGO,
                { 
                    useNewUrlParser : true,
                    useUnifiedTopology : true
                });
        else
            connection = mongoose.connect(
                process.env.MONGO_URI,
                { 
                    useNewUrlParser : true,
                    useUnifiedTopology : true
                });
    return connection;
};

function close() {
    if(connection !== null)
        return mongoose.disconnect();
}

module.exports = { connect, close, connection };