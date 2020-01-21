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

//add a new municipality in the system (municipality purchased the service)
router.post('/', async (req,res) => {
    const { error } = municipalityValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
	try {
		const addedMunicipality = await new Municipality({
			name: req.body.name.toLowerCase(),
			province: req.body.province.toUpperCase(),
			region: req.body.region.toLowerCase(),
			postcode: req.body.postcode,
			location: req.body.location,
			policeOfficers: req.body.policeOfficers,
			date: req.body.date
		}).save();
		console.log('Added a new municipality');
		res.send(addedMunicipality);	
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get('/', async (req,res) => {
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
	try {
		const requestedMunicipalities = await Municipality.find();
		if(requestedMunicipalities.length <= 0)
			return res.status(404).send('No municipalities found');
		res.send(requestedMunicipalities);
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;