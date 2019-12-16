const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const bcrypt = require('bcryptjs');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const payment = require('./payment');
const { geolocate } = require('../utils/geolocator');
const { extractIp } = require('../utils/extract-ip');
const hasher = require('../utils/salt');
const faker = require('faker');

router.post('/', async (req,res) => {
    console.log(req.body);
    //Validate the req. data before creating a request
    const { error } = requestValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Detect location of user from request ip address
    //let ip = extractIp(req);
    //console.log(ip)
    let salt = hasher.getSalt();
    let ip = faker.internet.ip();
    let loction = JSON.parse(await geolocate(ip));
    let hashedLat = await bcrypt.hash(loction.lat+"",salt)
        .then((data) => {return data;})
        .catch((err) => {return err;})
    let hashedLng = await bcrypt.hash(loction.lon+"",salt)
        .then((data) => {return data;})
        .catch((err) => {return err;})
    let startingLocation = {
        lat: hashedLat,
        lng: hashedLng
    }
    //reverse geocode the target location
    //Address is already validate
    targetLoction = JSON.parse(await reverseGeolocate(req.body.targetLocation));
    let hashedLat = await bcrypt.hash(targetLoction.lat+"",salt)
        .then((data) => {return data;})
        .catch((err) => {return err;})
    let hashedLng = await bcrypt.hash(targetLoction.lon+"",salt)
        .then((data) => {return data;})
        .catch((err) => {return err;})
    let targetLocation = {
        lat: hashedLat,
        lng: hashedLng
    } 
    
    //Create a new request
    const parkingRequest = new Request({
        startingLocation : startingLocation,
        targetLocation : targetLocation,
        date : req.body.date,
        duration : req.body.duration,
        licensePlate: req.body.licensePlate,
        status: 'Awaiting payment'
    });
    try{
        const savedRequest = await parkingRequest.save();
        //Process the payment
        return request.get(url.resolve('http://'+window.location.host+process.env.PORT,'api/pay'))
            .then((body) => res.send(body)) //Return the link to the confirmation payment page
            .catch((err) => res.status(400).send(err))
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;
