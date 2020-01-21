const mongoose = require('mongoose');
const faker = require('faker');
const request = require('request-promise');
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
            connection = mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
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

//Quick user creation for testing functionalities
async function addAnUserTest(email, password, privileges) {
    const user = {
        name: faker.name.firstName(),
        email: email,
        password: password,
        privileges: privileges
    };
    var options = {
        method: 'POST',
        uri: 'http://localhost:3001/api/users/register',
        body: user,
        json: true // Automatically stringifies the body to JSON
    };
    //console.log('User added '+addedUser.password);
    return request.post('http://localhost:3001/api/users/register',options)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => console.log(err));
}

async function close() {
    if(connection !== null) {
        if(mongod)
            await mongod.stop();
        return mongoose.disconnect();
    }
}

module.exports = { connect, close, connection, addAnUserTest };
