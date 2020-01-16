const router = require('express').Router();
const Municipality = require('../db/models/Municipality');
const ParkingPlace = require('../db/models/ParkingPlace');

router.get('/autocomplete/:output', async (req,res) => {
    let places = [];
    const output = req.params.output;
    const input = req.query.term.toLowerCase();
    if(output !== 'json')
        return res.status(400).send('Malformed request');
    
    const possibleMunicipalities = await Municipality.find({
       name: { $regex: input, $options: 'i' } 
    }, (err, doc) => {
        try {
            if(err)
                throw err;
            if(doc.length <= 0)
                return;
            doc.forEach((val,index,array) => {
                let ret = {
                    label: val.name,
                    value: val.location
                }
                places.push(ret);
            })
            
        } catch (err) {
            console.log(err);
        }
    });
    const possibleParkingPlaces = await ParkingPlace.find({
        'location.address': { $regex: input, $options: 'i' }
    }, (err, doc) => {
        try {
            if(err)
                throw err;
            if(doc.length <= 0)
                return;
            doc.forEach((val,index,array) => {
                let ret = {
                    label: val.name,
                    value: val.location.address
                }
                places.push(ret);
            })
            
        } catch (err) {
            console.log(err);
        }
    });
    //Value is what you put in the text input, label is what you see in the dropdown
    //If there is only one item, value and label are used the same way
    //If you specify only value, value will be used both as label and value
    if(places.length <= 0) {
        ret = {
            label: "Unavailable municipality",
            value: ""
        };
        res.send(ret);
    }
    else {
        
        res.send(places);
    }
});

module.exports = router;