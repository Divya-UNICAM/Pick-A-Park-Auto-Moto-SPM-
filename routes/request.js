const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const bcrypt = require('bcryptjs');
const Request = require('../db/models/Request');
const { requestValidation } = require('../validation');
const payment = require('./payment');
const { geolocate, geolocatev2, geolocatev3, reverseGeolocatev1 } = require('../utils/geolocator');
const { extractIp } = require('../utils/extract-ip');
const hasher = require('../utils/salt');
const faker = require('faker');

router.post('/', async (req,res) => {
    //Validate the req. data before creating a request
    const { error } = requestValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let loction = null;
    //Request came from non HTML5 browser, geolocation must be done manually
    if (typeof req.body.startingLocation === 'string' || req.body.startingLocation instanceof String) {
        //Detect location of user from request ip address
        let ip = extractIp(req);
        loction = JSON.parse(await geolocatev3(ip));
    } else {
        loction = req.body.startingLocation
    }
    //With HTML5 geolocation ip would be localhost
    loction = JSON.parse(await geolocatev3(faker.internet.ip()));
    let startingLoc = {
        lat: hasher.encrypt(loction.lat+""),
        lng: hasher.encrypt(loction.lng+"")
    }
    //reverse geocode the target location
    //Address is already validate
    targetLoction = await reverseGeolocatev1(req.body.targetLocation);
    console.log(targetLoction)
    let targetLoc = {
        lat: hasher.encrypt(targetLoction[1]+""),
        lng: hasher.encrypt(targetLoction[0]+"")
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
            .catch((err) => { return res.status(500).send(err) })
    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;
