const router = require('express').Router();
const request = require('request-promise');
const Request = require('../../db/models/Request');
const Sensor = require('../../db/models/Sensor');
const ParkingPlace = require('../../db/models/ParkingPlace');
const PoliceOfficer = require('../../db/models/PoliceOfficer');
const Job = require('../../db/models/Job');
const Municipality = require('../../db/models/Municipality');
const User = require('../../db/models/User');
const Cost = require('../../db/models/Cost');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jobValidation,policeOfficerValidation, sensorValidation, municipalityValidation, parkingPlaceValidation } = require('../../validation');
const { reverseGeolocatev1 } = require('../../utils/geolocator');

router.get('/:postcode/:address', async (req,res) => {
    const munId = req.params.postcode;
    const address = decodeURI(req.params.address.toLowerCase());
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munId});
        if(!requestedMunicipality)
            return res.status(404).send('Municipality not found');
        const requestedParkingPlace = await ParkingPlace.findOne({
            "location.address": address
        });
        if(!requestedParkingPlace)
            return res.status(404).send('No parking place found in this address');
        const requestedSensors = await Sensor.find({
            parkingplace : requestedParkingPlace.id
        });
        if(!requestedSensors)
            return res.status(404).send('Parking place has no sensors installed');
        res.send(requestedSensors);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;