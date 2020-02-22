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

//retrieve all tasks assigned to a single police officer
router.get('/officers/:postcode/:badge/jobs', async (req,res) => {
	const munPostcode = req.params.postcode;
	const officerId = req.params.badge;
	if(!req.cookies['auth_token'])
		return res.status(403).send('You are not authorized');
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedPoliceOfficer = await PoliceOfficer.findOne({municipality: requestedMunicipality._id, badge: officerId});
		if(!requestedPoliceOfficer)
			return res.status(404).send('Police officer not found');
		const assignedJobs = await Job.find({
			policeOfficer: requestedPoliceOfficer.id,
			municipality: requestedMunicipality.id
		});
        res.send(assignedJobs);

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
	//sensors will be recognized by their ipAddress
	//sensors update must come together with a token to represent it's from a legit device

	if(!req.cookies['sensor_token'])
		return res.status(403).send('sensor is not authorized');
    try{
		const sensorID = jwt.decode(req.cookies['sensor_token']).id;
		const updatingSensor = await Sensor.findById(sensorID);
		if(!updatingSensor)
			return res.status(404).send('Sensor not found');
		const requestedParkingPlace = await ParkingPlace.findById(updatingSensor.parkingplace);
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
			const requestedMunicipality = await Municipality.findById(requestedParkingPlace.municipality);
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
			//Get the plateNumber to compare with the one coming from the update
		const involvedRequest = await Request.findOne({
			"assignedplace.parkingplace": requestedParkingPlace.id
		});
		if(!involvedRequest)
			return res.status(404).send('No request found involving this parking place');

		//Legit car enters in a free parking place
		if(involvedRequest.licensePlate === req.body.update.plateNumber && requestedParkingPlace.status === 'FREE' && req.body.update.direction === 'entering') {
			await requestedParkingPlace.update({
				status: 'OCCUPIED'
			});
			return res.sendStatus(200);
		//Legit car leaves from an occupied parking place
		} else if(involvedRequest.licensePlate === req.body.update.plateNumber && requestedParkingPlace.status === 'OCCUPIED' && req.body.update.direction === 'leaving') {
			await requestedParkingPlace.update({
				status: 'FREE'
			});
			return res.sendStatus(304); 
		//Not allowed car enters in a free parking place
		} else if(involvedRequest.licensePlate !== req.body.update.plateNumber && requestedParkingPlace.status === 'FREE' && req.body.update.direction === 'entering') {
			const requestedPoliceOfficer = await PoliceOfficer.findOne({
				status: "FREE"
			});
			if(!requestedPoliceOfficer)
				return res.status(404).send('No police officers available for dispatch');
			const jobToSend = await new Job({
				municipality: requestedMunicipality.id,
				parkingPlace: requestedParkingPlace.id,
				policeOfficer: requestedPoliceOfficer.id,
				date: Date.now(),
				status: "VIOLATION"
			}).save();
			return res.status(401).json(jobToSend);
		} else {// any other case is an error
			throw 'Unexpected behaviour from sensor, please manually check';
		}
    }catch(err) {
        res.status(500).send(err);
    }
});

router.post('/officers/resolve', async (req,res) => {
	if(!req.body.jobId)
		return res.status(400).send('Job id is missing');
	const jobId = req.body.jobId;
	const updatedJob = await Job.findByIdAndUpdate(jobId, {
		status: 'RESOLVED'
	});
	res.status(200).send(updatedJob);
});

module.exports = router;