const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

var port = process.env.PORT || 3001
app.use(express.json());

let mongod = new MongoMemoryServer();
conny = async () => {
    const uri = await mongod.getConnectionString();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();
    mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
}

printy = async () => {
    console.log(await new MongoMemoryServer().getConnectionString());
}

app.route('/')
    .get((req,res) => {
        res.send('Hello');
    })

app.listen(port, async () => {
    printy();
    console.log('Server started!');
})

module.exports = app;