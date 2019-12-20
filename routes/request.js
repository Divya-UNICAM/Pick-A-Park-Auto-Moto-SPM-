const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const bcrypt = require('bcryptjs');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const payment = require('./payment');
const { geolocate, geolocatev2, geolocatev3 } = require('../utils/geolocator');
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
    //let ip = faker.internet.ip();
    //console.log(ip)
    //let loction = JSON.parse(await geolocatev3(ip));
    //console.log(loction)
    let startingLoc = {
        lat: hasher.encrypt(43.140362+""),
        lng: hasher.encrypt(13.068770+"")
    }
    //reverse geocode the target location
    //Address is already validate
    // targetLoction = JSON.parse(await reverseGeolocate(req.body.targetLocation));
    let targetLoc = {
        lat: hasher.encrypt(41.902782+""),
        lng: hasher.encrypt(12.496365+"")
    } 
    
    //Create a new request
    const parkingRequest = new Request({
        startingLocation : startingLoc,
        targetLocation : targetLoc,
        date : req.body.date,
        duration : req.body.duration,
        licensePlate: req.body.licensePlate,
        status: ""
    });
    try{
        const savedRequest = await parkingRequest.save();
        //Process the payment
        console.log(savedRequest)
        return request.get(url.resolve('http://localhost:'+process.env.PORT,'/api/pay'),{ headers: { "Cookie": savedRequest._id } },)
            .then((link) => { 
                res.send(link);
            }) //Return the link to the confirmation payment page becusae using redirect gives error cors
            .catch((err) => { return res.status(400).send(err) })
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;
