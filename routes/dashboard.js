const router = require('express').Router();
const Sensor = require('../db/models/Sensor');
const ParkingPlace = require('../db/models/ParkingPlace');
const PoliceOfficer = require('../db/models/PoliceOfficer');
const Municipality = require('../db/models/Municipality');
const User = require('../db/models/User');
const Cost = require('../db/models/Cost');
const { sensorValidation, municipalityValidation } = require('../validation');

//add a new municipality in the system (municipality purchased the service)
router.post('/municipalities', async (req,res) => {
    const { error } = municipalityValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const addedMunicipality = await new Municipality(req.body).save();
    console.log(addedMunicipality);
    res.send(addedMunicipality);
});

//retrieve all parking places in the system and display their status
router.get('/parkingplaces', async (req,res) => {
    res.send(ParkingPlace.find().lean());
});

//retrieve all police officers working on the municipality
//id is the municipality id
router.get('/police/:mid', async (req,res) => {
    const munId = req.params.mid;
    try{
        const requestedMunicipality = Municipality.findById(munId, function(err,doc) {
            res.send(doc.policeofficers);
        });
        
    }catch(err) {
        res.send(err);
    }
    
});

//retrieve a single parking place from the specified municipality
router.get('/parkingplaces/:mid/:id', async (req,res) => {
    const munId = req.params.mid;
    const parkId = req.params.id;
    try {
        ParkingPlace.findOne({
            municipality: Municipality.findById(munId).lean(),
            _id: id
        }, (err, doc) => {
            if(err)
                return res.status(400).send(err);
            res.send(doc);
        })
    } catch (error) {
        res.status(400).send(error);
    }
});

//add a new parking place in the system
//id is the municipality id
router.post('/parkingplaces/:mid', async (req,res) => {
    const { error } = parkingPlaceValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const parkingPlaceToAdd = req.body;
    const munId = req.params.mid;
    try{
        const addedParkingPlace = Municipality.findByIdAndUpdate(munId,{
            $push: { parkingplaces: parkingPlaceToAdd }
        });
        res.send(addedParkingPlace);

    }catch(err) {
        res.status(400).send(err);
    }
});

//Update and exisisting parking place
router.put('/parkingplaces/:mid/:pid', async (req,res) => {
    const munId = req.params.mid;
    const parkId = req.params.pid;
    const toUpdate = req.body;
    try {
        const munObj = Municipality.findOne({
            _id: munId,
            parkingplaces: ParkingPlace.findById(parkId)
        });
        var parkPlace = munObj.parkingplaces;
        const updated = await parkPlace.set(toUpdate).save();
        res.send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Delete an existing parking place
router.delete('/parkingplaces/:mid/:pid', async (req,res) => {
    const munId = req.params.mid;
    const parkId = req.params.pid;
    const toUpdate = req.body;
    try {
        const munObj = Municipality.findOne({
            _id: munId,
            parkingplaces: ParkingPlace.findById(parkId)
        });
        var parkPlace = munObj.parkingplaces;
        const deleted = parkPlace.remove();
        res.send(deleted);
    } catch (err) {
        res.status(400).send(err);
    }
});

//adding a new sensor to a municipality
router.post('sensors/:mid', async (req,res) => {
    const munId = req.params.mid;
    const sensorParameters = req.body;
    const sensorToAdd = new Sensor(sensorParameters);
    try {
        const addedSensor = Municipality.findByIdAndUpdate(munId,{
            $push: { sensors: sensorToAdd }
        });
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
//id is the municipality id
router.post('/police/:{mid}', async (req,res) => {
    const { error } = policeOfficerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const policeOfficerToAdd = req.body;
    const munId = req.params.mid;
    try{
        const addedPoliceOfficer = Municipality.findByIdAndUpdate(munId,{
            $push: { policeofficers: policeOfficerToAdd }
        });
        res.send(addedPoliceOfficer);

    }catch(err) {
        res.status(400).send(err);
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