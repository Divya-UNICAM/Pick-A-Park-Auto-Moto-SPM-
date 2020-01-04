const router = require('express').Router();
const request = require('request-promise');
const Request = require('../db/models/Request');
const Sensor = require('../db/models/Sensor');
const ParkingPlace = require('../db/models/ParkingPlace');
const PoliceOfficer = require('../db/models/PoliceOfficer');
const Job = require('../db/models/Job');
const Municipality = require('../db/models/Municipality');
const User = require('../db/models/User');
const Cost = require('../db/models/Cost');
const { sensorValidation, municipalityValidation, parkingPlaceValidation } = require('../validation');
const { reverseGeolocatev1 } = require('../utils/geolocator');

//add a new municipality in the system (municipality purchased the service)
router.post('/municipalities', async (req,res) => {
    const { error } = municipalityValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
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

//retrieve all parking places in the system and display their status
router.get('/parkingplaces/:postcode', async (req,res) => {
	const munPostcode = req.params.postcode;
	try {
		const mun = await Municipality.findOne({postcode: munPostcode});
		if(!mun)
			return res.status(404).send('Municipality not found');
		const munId = mun._id;
		const requestedParkingPlaces = await ParkingPlace.find({municipality: munId});
		if(!requestedParkingPlaces)
			return res.status(404).send('No parking places found in specified municipality');
		console.log('Retrieved all parking places');
		res.send(requestedParkingPlaces);
	} catch (err) {
		return res.status(500).send(err);
	}
    res.send(ParkingPlace.find());
});

//retrieve all police officers working on the municipality
router.get('/officers/:postcode', async (req,res) => {
    const munPostcode = req.params.postcode;
    try{
        const mun = await Municipality.findOne({postcode: munPostcode});
		if(!mun)
			return res.status(404).send('Municipality not found');
		const requestedPoliceOfficers = await PoliceOfficer.find({municipality: mun.id});
		if(requestedPoliceOfficers.length <= 0)
			return res.status(404).send('No police officers found in specified municipality');
		console.log('Retrieved all police officers');
		res.send(requestedParkingPlaces);
        
    }catch(err) {
        return res.status(500).send(err);
    }
    
});

//retrieve a single police officer in the specified municipality
router.get('/officers/:postcode/:pid', async (req,res) => {
	const munPostcode = req.params.postcode;
	const officerId = req.params.pid;
	try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedOfficer = await PoliceOfficer.findOne({
			municipality: requestedMunicipality._id,
			_id: officerId
		});
		if(!requestedOfficer)
			return res.status(404).send('Police officer not found');
		res.send(requestedOfficer);
	} catch (err) {
		res.status(500).send(err);
	}
});

//retrieve a single parking place from the specified municipality in the specified address
router.get('/parkingplaces/:postcode/:address', async (req,res) => {
	//Client side must validate the address with google maps Places API
	const munPostcode = req.params.postcode;
	const parkAddress = req.params.address.toLowerCase();
    try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
        const requestedParkingPlace = await ParkingPlace.findOne({
            municipality: munId,
            location: {
				address: parkAddress
			}
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		res.send(requestedParkingPlace);
    } catch (error) {
        res.status(400).send(error);
    }
});

//add a new parking place in the system
// name is the municipality name
router.post('/parkingplaces/:postcode', async (req,res) => {
    const { error } = parkingPlaceValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
        const addedAParkingPlace = await new ParkingPlace({
			municipality: requestedMunicipality._id,
			//lat and lng are defined by the client issuing the request
			//given that you must issue the address of the pkplace
			//the client (browser) will also call the geolocation service
            location: {
				lat: req.body.location.lat,
				lng: req.body.location.lng,
				address: req.body.location.address.toLowerCase()
			},
            sensors: req.body.sensors,
            date: req.body.date,
            status: req.body.status
        }).save();
        console.log('Added a new parking place');
        res.send(addedAParkingPlace);

    }catch(err) {
        res.status(400).send(err);
    }
});

//Update and exisisting parking place
router.put('/parkingplaces/:postcode/:address', async (req,res) => {
    const munPostcode = req.params.postcode;
    const parkAddress = req.params.address;
    const toUpdate = req.body;
    try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
        let parkPlace = await ParkingPlace.findOne({
			municipality: munId,
			location: { address: parkAddress }
		});
		if(!parkPlace)
			return res.status(404).send('Parking place not found');
        const updated = await parkPlace.set(toUpdate).save();
		console.log('Parking place updated');
		res.send(updated);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//Delete an existing parking place
router.delete('/parkingplaces/:postcode/:address', async (req,res) => {
    const munPostcode = req.params.postcode;
    const parkAddress = req.params.address;
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
        const deletedParkPlace = await ParkingPlace.deleteOne({
			municipality: munId,
			location: { address: parkAddress }
		});
		if(!parkPlace)
			return res.status(404).send('Parking place not found');
		console.log('Parking place deleted');
		res.send(deletedParkPlace);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//adding a new sensor to a municipality
router.post('sensors/:postcode/:address', async (req,res) => {
	const { error } = sensorValidation(req.body);
	if(error) return res.status(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	const parkAddress = req.params.address;
    try {
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.send(404).send('Municipality not found');
		const munId = requestedMunicipality._id;
		const requestedParkingPlace = await ParkingPlace.findOne({municipality: munId, location:{address: parkAddress}});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const addedSensor = await new Sensor({
			municipality: munId,
			parkingPlace: requestedParkingPlace._id,
			update: req.body.update,
			date: req.body.date,
			detect: req.body.detect,
			status: req.body.status
		}).save();
		console.log('Sensor added');
        res.send(addedSensor);
    } catch (err) {
        res.status(400).send(err);
    }
});

//update an existing sensor in the specified municipality
router.put('sensors/:postcode/:address/:sid', async (req,res) => {
	const { error } = sensorValidation(req.body);
	if(error) return res.send(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	const parkAddress = req.params.address.toLowerCase();
    const sensorId = req.params.sid;
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: requestedMunicipality._id,
			location: {
				address: parkAddress
			}
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		let requestedSensor = await Sensor.findOneAndUpdate({_id: sensorId, parkingPlace: requestedParkingPlace._id},
			req.body,{new:true});
        res.send(requestedSensor);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('sensors/:postcode/:address/:sid', async (req,res) => {
    const { error } = sensorValidation(req.body);
	if(error) return res.send(400).send(error.details[0].message);
	const munPostcode = req.params.postcode;
	const parkAddress = req.params.address.toLowerCase();
    const sensorId = req.params.sid;
    try {
        const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({
			municipality: requestedMunicipality._id,
			location: {
				address: parkAddress
			}
		});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const requestedSensor = await Sensor.deleteOne({_id: sensorId, parkingPlace: requestedParkingPlace._id});
		if(!requestedSensor)
			return res.status(404).send('Sensor not found');
		res.send(requestedSensor);
    } catch (err) {
        res.status(400).send(err);
    }
});

//add a new police officer in the system
router.post('/officers/:postcode', async (req,res) => {
    const { error } = policeOfficerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const munPostcode = req.params.postcode;
    try{
        const requestedMunicipality = await Municipality.findOne({name: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
        const addedPoliceOfficer = await new PoliceOfficer({
			municipality: requestedMunicipality._id,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			jobs: req.body.jobs,
            date: req.body.date,
            status: req.body.status
        }).save();
        console.log('Added a new police officer');
        res.send(addedPoliceOfficer);

    }catch(err) {
        return res.status(500).send(err);
    }
});

//Update an exisiting police officer
//router.put('/police/:{mid}/:{pid}')

//Delete an exisisting police officer
//router.delete('/police/:{mid}/:{pid}')

//retrieve all tasks assigned to police officers
router.get('officers/:postcode/:address/job', async (req,res) => {
	const munPostcode = req.params.postcode;
    const officerId = req.params.pid;
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({municipality: requestedMunicipality._id, location:{address: parkAddress}});
		if(!requestedParkingPlace)
			return res.status(404).send('Parking place not found');
		const jobs = Job.find({
			municipality: requestedMunicipality.id,
			parkingPlace: requestedParkingPlace.id,
		});
        res.send(jobs);

    }catch(err) {
        res.status(500).send(err);
    }
});

//assign a new task to an existing police officer
router.post('/officers/:postcode/:address/:pid/job', async (req,res) => {
    //const { error } = jobValidation(req.body);
    //if(error) return res.status(400).send(error.details[0].message);
    const munPostcode = req.params.postcode;
    const officerId = req.params.pid;
    try{
		const requestedMunicipality = await Municipality.findOne({postcode: munPostcode});
		if(!requestedMunicipality)
			return res.status(404).send('Municipality not found');
		const requestedParkingPlace = await ParkingPlace.findOne({municipality: requestedMunicipality._id, location:{address: parkAddress}});
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
//when a sensor detects a change in the parking place will send its data to this service
//data will be then checked and if there is a violation, a new job will be added
router.post('/parkingplaces/:postcode/:address/update', async (req,res) => {
    //const { error } = parkingUpdateValidation(req.body);
    //if(error) return res.status(400).send(error.details[0].message);
    //const parkingUpdate = req.body;
    //check if plate number is legit or there is a running violation
    
    const munPostcode = req.params.postcode;
    const parkAddress = req.params.address;
    try{
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

//retrieve all sensors from the current municipality
router.get('/sensors/:postcode', async (req,res) => {
    const munId = req.params.mid;
    try {
        Municipality.findById(munId, (err,doc) => {
            return res.send(doc.sensors.lean());
        })
    } catch (err) {
        res.status(400).send(err);
    }
});

//retrieve a sensor from the specfied municiaplity
router.get('sensors/:mid/:sid',async (req,res) => {
    const munId = req.params.mid;
    const sensId = req.params.sid;
    try {
        Municipality.findById(munId, (err,doc) => {
            if(err)
                return res.status(400).send(err);
            for(let i = 0; i < doc.sensors.length;i++) {
                if(doc.sensors[i]._id === sensId) {
                    return res.send(doc.sensors[i]);
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

//SERVICES FOR ADMINS AND TESTING PURPOSES

//Add a new municipality user to the platform
router.post('/municipality/admin', async (req,res) => {
    const body = req.body;
    try{
        const addedAMunicipalityAdmin = await new User({
            name: body.name,
            email: body.email,
            password: body.password,
            privileges: 3
        }).save();
        res.send(addedAMunicipalityAdmin);
    } catch(err) {
        res.status(400).send(err);
    }
});

//Add a new parking company user to the platform
router.post('/parkingcompany/admin', async (req,res) => {
    const body = req.body;
    try{
        const addedParkingCompanyAdmin = await new User({
            name: body.name,
            email: body.email,
            password: body.password,
            privileges: 4
        }).save();
        res.send(addedParkingCompanyAdmin);
    } catch(err) {
        res.status(400).send(err);
    }
});

router.put('/price', async (req,res) => {
    const toUpdate = req.body;
    try {
        const currentCost = Cost.find();
        const updated = await currentCost.set(toUpdate).save();
        res.send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;