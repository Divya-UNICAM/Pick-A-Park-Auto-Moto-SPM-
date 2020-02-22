const express = require('express');
const app = express();
const db = require('./db/index.js');
const dbUtils = require('./utils/dbUtils');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const paypal = require('paypal-rest-sdk');
const hasher = require('./utils/salt');
const faker = require('faker');

//Import routes
const authRoute = require('./routes/auth');
const requestRoute = require('./routes/request');
const paymentRoute = require('./routes/payment');
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
if(process.env.NODE_ENV !== 'test')
    db.connect()
        .then((done) => console.log('Connected to DB'))
        .catch((err) => console.log(err));

if(process.env.NODE_ENV !== 'production') {
    dbUtils.addAUserTest('automoto@login.com','hello1234',5,'*')
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    dbUtils.addAUserTest('camerino@login.com','hello1234',4,'62032')
    dbUtils.addAUserTest('camerano@login.com','hello1234',4,'60021')
        dbUtils.addAMunicipalityTest("Camerino","MC","Marche","62032",43.140362,13.068770,1)
            .then((mun) => {
                return dbUtils.addAParkingPlaceTest(mun.postcode,43.132590,13.064660,'Via le mosse, 23')
                .then((parking) => {
                    return dbUtils.addASensorTest(mun.postcode,parking.location.address,'193.145.200.2',0)
                })
            
            }).catch((err) => console.log(err));
        dbUtils.addAMunicipalityTest("Camerano","AN","Marche","60021",43.529940,13.547900,2)
            .then((mun) => {
                return dbUtils.addAParkingPlaceTest(mun.postcode,43.5279754,13.5420382,"Via dante alighieri, 1")
                .then((parking) => {
                    return dbUtils.addASensorTest(mun.postcode,parking.location.address,'192.168.100.1',1)
                })
            }).catch((err) => console.log(err));
        

        dbUtils.addAnOfficerTest('James','james.officer@62032.com','hello1234',"JM-001","62032")
        dbUtils.addAnOfficerTest('Lawrence','lawrence.officer@60021.com','hello1234',"LR-001","60021")
    }
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
app.use('/api/directions',directionsRoute);
app.use('/api/place',placeRoute);
app.use('/api/dashboard/municipalities',dashboardRoute.municipalityRoute);
app.use('/api/dashboard/parkingplaces',dashboardRoute.parkingPlacesRoute);
app.use('/api/dashboard/sensors',dashboardRoute.sensorRoute);
app.use('/api/dashboard/officers',dashboardRoute.officerRoute);
app.use('/api/dashboard/tasks',dashboardRoute.taskRoute);

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

//sensorUtils.simulate(10);

module.exports = app;