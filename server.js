const express = require('express');
const app = express();
const db = require('./db/index.js');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const paypal = require('paypal-rest-sdk');
const hasher = require('./utils/salt');

//Import routes
const authRoute = require('./routes/auth');
const requestRoute = require('./routes/request');
const paymentRoute = require('./routes/payment');
const sensorRoute = require('./routes/sensor');
const directionsRoute = require('./routes/directions');

//Configurations
hasher.generateSalt();
dotenv.config();
paypal.configure({
    mode: 'sandbox', // Sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET_ID});

var port = process.env.PORT || 3001
process.env.PORT = port

//Init EJS
app.set('view engine', 'ejs');

//Connect to DB
db.connect()
    .then((done) => console.log('Connected to DB'))
    .catch((err) => console.log(err));

db.addAnUserTest('automoto@login.com','hello1234',5);

//Use Middlewares
app.use(bodyParser.json()); //Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', express.static(path.join(__dirname + '/wwwroot/static')));
//app.use('/static', express.static(__dirname + '/src/assets'));

//Route Middlewares - where the user will navigate
app.use('/api/users', authRoute);
app.use('/api/request', requestRoute);
app.use('/api/pay',paymentRoute);
app.use('/api/sensor',sensorRoute);
app.use('/api/directions',directionsRoute);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/home/index.html'));
});

app.get('/request', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/home/request.html'));
});

app.get('/route', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/maps/route.html'));
});

app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/static/login/index.html'));
});

app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/static/register/index.html'));
});

app.get('/dashboard', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/static/dashboard/demo_1/index.html'));
});

app.listen(port, () => {
    console.log('Server Up and running!');
});

module.exports = app;