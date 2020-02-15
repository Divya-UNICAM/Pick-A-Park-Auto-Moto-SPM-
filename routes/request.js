const router = require('express').Router();
const request = require('request-promise');
const url = require('url');
const bcrypt = require('bcryptjs');
const Request = require('../db/models/Request');
const ParkingPlace = require('../db/models/ParkingPlace');
const { requestValidation } = require('../validation');
const payment = require('./payment');
const { geolocate, geolocatev2, geolocatev3, reverseGeolocatev1 } = require('../utils/geolocator');
const { extractIp } = require('../utils/extract-ip');
const hasher = require('../utils/salt');
const faker = require('faker');
const dbUtils = require('../utils/dbUtils');

router.post('/', async (req,res) => {
    //Validate the req. data before creating a request
    const { error } = requestValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    try{
        56600189
        //Decide the target parking place according to the distance
        let places = await dbUtils.getNearParkingPlaces(req.body.targetLocation);
        const elementMinDistance = places.reduce((prev,curr) => {
            return prev.distance < curr.distance ? prev : curr;
        });
        
        //Create a new request
        const parkingRequest = new Request({
            startingLocation : req.body.startingLocation,
            targetLocation : req.body.targetLocation,
            assignedplace: elementMinDistance,
            date : req.body.date,
            duration : req.body.duration,
            licensePlate: req.body.licensePlate
        });
        const savedRequest = await parkingRequest.save();
        res.cookie("reqId",savedRequest.id).status(200).send(savedRequest);

    }catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;
