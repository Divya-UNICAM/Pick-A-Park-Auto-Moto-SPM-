const router = require('express').Router();
const Sensor = require('../db/models/Sensor');
const ParkingPlace = require('../db/models/ParkingPlace');
const PoliceOfficer = require('../db/models/PoliceOfficer');
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
		const munId = mun._id;
		const requestedPoliceOfficers = await PoliceOfficer.find({municipality: munId});
		if(!requestedPoliceOfficers)
			return res.status(404).send('No police officers found in specified municipality');
		console.log('Retrieved all police officers');
		res.send(requestedParkingPlaces);
        
    }catch(err) {
        return res.status(500).send(err);
    }
    
});

//retrieve a single police officer in the specified municipality
router.get('/officers/:postcode')

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
		const addedSensor = await new Sensor({
			municipality: munId,
			location: {
				lat: req.body.location.lat,
				lng: req.body.location.lng,
				address: req.body.location.address.toLowerCase()
			},
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

router.put('sensors/:mid/:sid', async (req,res) => {
    const munId = req.params.mid;
    const sensorId = req.params.sid;
    const toUpdate = req.body;
    try {
        const munObj = Municipality.findOne({
            _id: munId,
            sensors: Sensor.findById(sensorId)
        });
        var sensors = munObj.sensors;
        const updated = await sensors.set(toUpdate).save();
        res.send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('sensors/:mid/:sid', async (req,res) => {
    const munId = req.params.mid;
    const sensorId = req.params.sid;
    try {
        const munObj = Municipality.findOne({
            _id: munId,
            sensors: Sensor.findById(sensorId)
        });
        var sensors = munObj.sensors;
        const deleted = sensors.remove();
        res.send(deleted);
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

//id is police officer id, assign a new task to an existing police officer
router.post('/police/:mid/:pid/job', async (req,res) => {
    const { error } = jobValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const jobToAdd = req.body;
    const munId = req.params.mid;
    const polId = req.params.pid;
    try{
        const modifiedPoliceOfficer = PoliceOfficer.findOneAndUpdate({_id: polId, municipality: munId},{
            $push: { jobs: jobToAdd }
        });
        res.send(modifiedPoliceOfficer);

    }catch(err) {
        res.status(400).send(err);
    }
});

//receive update from a single parking place
//each sensor in a parking place can detect a car parking
//it will then read the plate number and send it to this service
router.post('/parkingplaces/:mid/update/:parkid', async (req,res) => {
    const { error } = parkingUpdateValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const parkingUpdate = req.body;
    //check if plate number is legit or there is a running violation
    ParkingPlace.findOne({})
    const munId = req.params.mid;
    const parkId = req.params.parkid;
    try{
        const modifiedPoliceOfficer = ParkingPlace.findOneAndUpdate({_id: parkId, municipality: munId, "sensors.id": parkingUpdate.id},{
            $push: { "sensors.$.updates": parkingUpdate }
        });
        res.send(modifiedPoliceOfficer);

    }catch(err) {
        res.status(400).send(err);
    }
});

//receive updates from all parking places in the specificed municipality
//when the service is called, the parking places are requested info
router.get('/parkingplaces/:{mid}/updates', async (req,res) => {

});

//retrieve all sensors from the current municipality
router.get('/sensors/:mid', async (req,res) => {
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