const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

dotenv.config();

var connection = null;
var mongod = new MongoMemoryServer();

async function connect() {
    if(connection === null)
        if(process.env.NODE_ENV !== 'production') {
            const uri = await mongod.getConnectionString();
            const port = await mongod.getPort();
            const dbPath = await mongod.getDbPath();
            const dbName = await mongod.getDbName();
            mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
            const PAPAdmin = await new User({
                name: "PAP Admin",
                email: "admin@automoto.pickapark.com",
                password: "admin",
                privileges: 5
            }).save();
            console.log(PAPAdmin.id)
            console.log(uri);
        }
        else //If it's a production environment
            connection = mongoose.connect(
                process.env.MONGO_URI,
                { 
                    useNewUrlParser : true,
                    useUnifiedTopology : true
                });
    return connection;
};

async function close() {
    if(connection !== null) {
        if(mongod)
            await mongod.stop();
        return mongoose.disconnect();
    }
}

module.exports = { connect, close, connection };