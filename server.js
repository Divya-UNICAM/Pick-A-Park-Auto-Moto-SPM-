const express = require('express');
const app = express();
const db = require('./db/index.js');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const paypal = require('paypal-rest-sdk');
const hasher = require('./utils/salt');

//Import routes
const authRoute = require('./routes/auth');
const requestRoute = require('./routes/request');
const paymentRoute = require('./routes/payment');
const sensorRoute = require('./routes/sensor');
const directionsRoute = require('./routes/directions');
const placeRoute = require('./routes/place');
const dashboardRoute = require('./routes/dashboard');

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
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname + '/wwwroot/static')));
app.use('/assets', express.static(__dirname + '/wwwroot/static/dashboard/assets'));

app.options("*",cors());
//Route Middlewares - where the user will navigate
app.use('/api/users', authRoute);
app.use('/api/request', requestRoute);
app.use('/api/pay',paymentRoute);
app.use('/api/sensor',sensorRoute);
app.use('/api/directions',directionsRoute);
app.use('/api/place',placeRoute);
app.use('/api/dashboard/municipalities',dashboardRoute.municipalityRoute);
app.use('/api/dashboard/parkingplaces',dashboardRoute.parkingPlacesRoute);
app.use('/api/dashboard/sensors',dashboardRoute.sensorRoute);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/home/index.html'));
});

app.get('/request', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/static/request/index.html'));
});

app.get('/route', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/views/maps/route.html'));
});

app.get('/login', (req,res) => {
    if(req.cookies['auth_token'])
        return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname + '/wwwroot/static/login/index.html'));
});

app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname + '/wwwroot/static/register/index.html'));
});

app.get('/dashboard', (req,res) => {
    if(!req.cookies['auth_token'])
        return res.redirect('/login');
    res.sendFile(path.join(__dirname + '/wwwroot/static/dashboard/demo_1/index.html'));
});

app.listen(port, () => {
    console.log('Server Up and running!');
});

module.exports = app;