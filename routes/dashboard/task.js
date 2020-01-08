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

//retrieve all tasks assigned to police officers
router.get('officers/:postcode/jobs', async (req,res) => {
	const munPostcode = req.params.postcode;
	const officerId = req.params.pid;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const jobs = await Job.find({
			municipality: requestedMunicipality.id,
		});
        res.send(jobs);

    }catch(err) {
        res.status(500).send(err);
    }
});

//assign a new task to an existing police officer
router.post('/officers/:postcode/:badge/job', async (req,res) => {
    const { error } = jobValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const munPostcode = req.params.postcode;
	const officerId = req.params.badge;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		//Check if the parking place in the request body exists
		const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: requestedMunicipality._id, 
			'location.address': decodeURI(req.body.address.toLowerCase())});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const requestedPoliceOfficer = await PoliceOfficer.findOne({municipality: requestedMunicipality._id, _id: officerId});
		if(!requestedPoliceOfficer)
			return res.status(404).send('Police officer not found');
		const jobToAdd = new Job({
			municipality: requestedMunicipality.id,
			parkingPlace: requestedParkingPlace.id,
			policeOfficer: requestedPoliceOfficer.id,
			date: req.body.date,
			status: req.body.status
		}).save();
        res.send(jobToAdd);

    }catch(err) {
        res.status(500).send(err);
    }
});

//receive update from a single parking place
//when a sensor detects a change in the parking place, it will send its data to this service
//data will be then checked and if there is a violation, a new job will be added
router.post('/parkingplaces/update', async (req,res) => {
    //const { error } = parkingUpdateValidation(req.body);
    //if(error) return res.status(400).send(error.details[0].message);
    //check if plate number is legit or there is a running violation
    //sensors will be recognized by their token
    const munPostcode = req.params.postcode;
	const parkAddress = decodeURI(req.params.address.toLowerCase());
	if(!req.cookies['sensor_token'])
		return res.status(403).send('You are not authorized');
    try{
		const updatingSensor = await Sensor.findOne({ipAddress: req.cookies['sensor_token']});
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({municipality: requestedMunicipality._id, location:{address: parkAddress}});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const requestedRequest = Request.findOne({targetLocation:{parkingPlace:requestedParkingPlace.id}});
		if(!requestedRequest)
			return res.status(404).send('Request not found');
		if(requestedRequest.plateNumber !== req.body.plateNumber) {
			const requestedPoliceOfficer = await PoliceOfficer.findOne();
			if(!requestedPoliceOfficer)
				return res.status(404).send('No police officers available for dispatch');
			const jobToSend = await new Job({
				municipality: requestedMunicipality.id,
				parkingPlace: requestedParkingPlace.id,
				policeOfficer: requestedPoliceOfficer.id,
				date: Date.now(),
				status: "VIOLATION"
			}).save();
			res.send(jobToSend);
		} else {
			res.send('Car is legit');
		}
    }catch(err) {
        res.status(500).send(err);
    }
});