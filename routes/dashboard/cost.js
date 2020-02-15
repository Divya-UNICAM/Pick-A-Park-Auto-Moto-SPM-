const router = require('express').Router();
const Cost = require('../../db/models/Cost');
const Municipality = require('../../db/models/Municipality');
const jwt = require('jsonwebtoken');

router.get('/all', async (req, res) => {
    return res.send(await Cost.find());
});

router.get('/', async (req,res) => {
    if(!req.cookies['auth_token'])
        return res.sendStatus(403);
    try {
        const postcode = jwt.decode(req.cookies['auth_token']).domain;
        const mun = await Municipality.findOne({postcode: postcode});
        
        const currentCost = await Cost.findOne({municipality: mun.id});
        
        res.send(currentCost);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/', async (req,res) => {
    if(!req.cookies['auth_token'])
        return res.sendStatus(403);
    try {
        console.log(req.body)
        const curst = await new Cost(req.body).save();
        res.send(curst);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;