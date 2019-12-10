const express = require('express');
const app = express();
const db = require('./db/index.js');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const requestRoute = require('./routes/request');
const homeRoute = require('./routes/home');

dotenv.config();

var port = process.env.PORT || 3000

//Init EJS
app.set('view engine', 'ejs');

//Connect to DB
db.connect().then(() => console.log('Connected to DB!'));

//Use Middlewares
app.use(bodyParser.json()); //Body-parser
app.use(cors());

//Route Middlewares - where the user will navigate
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);
app.use('/api/request', requestRoute);
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/home/index.html'));
});

app.listen(port, () => {
    console.log('Server Up and running!');
});

module.exports = app;