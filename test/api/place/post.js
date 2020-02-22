process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const db = require('../../../db/index');
const dbUtils = require('../../../utils/dbUtils');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const ParkingPlace = require('../../../db/models/ParkingPlace');

let mongoServer;
const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts)
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
})

describe('POST /api/place/tracking', () => {
    var parkingRequest, selectedParkingPlace, municipality, reqId, parkingAddress, occupiedParkingPlace, occupiedParkingPlaceTest2;
    before((done) => {
        dbUtils.addAMunicipalityTest(
            "Rome",
            "RM",
            "Lazio",
            faker.address.zipCode(),
            41.902782,
            12.496365,
            faker.commerce.price()
        ).then((mun) => {
            municipality = mun;
            dbUtils.addAParkingPlaceTest(//Roma via tuscolana
                mun.postcode,
                41.839385,
                12.592560,
                faker.address.streetAddress(),
                false,'OCCUPIED'
            ).then((pp) => {
                occupiedParkingPlace = pp;
                parkingAddress = pp.location.address;
            }).catch(err => done(err));
            dbUtils.addAParkingPlaceTest(//Roma via Pomezia
                mun.postcode,
                41.880470,
                12.511670,
                faker.address.streetAddress()
            )
            dbUtils.addAParkingPlaceTest(//Roma via salaria
                mun.postcode,
                42.396540,
                12.860140,
                faker.address.streetAddress(),
                false,'OCCUPIED'
            )
            dbUtils.addAParkingPlaceTest(//Roma via Flaminia
                mun.postcode,
                41.902782,
                12.496365,
                faker.address.streetAddress()
            ).then((pp) => {
                selectedParkingPlace = pp;
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
    })
    it('OK, choosing the nearest parking place as destination works', (done) => {
        dbUtils.addARequestTest(
            "Camerino",
            "Roma",
            Date.now(),
            "1111111",
            10, true
        ).then((res) => {
            reqId = res.headers['set-cookie'][0];
            dbUtils.getNearParkingPlaces({ //Rome
                lat: 41.902782,
                lng: 12.496365
            }).then(places => {
                const selectedParkingPlace = places.reduce((prev,curr) => {
                    return prev.distance < curr.distance ? prev : curr;
                });
                expect(res.body.assignedplace.place.lat).to.be.equal(selectedParkingPlace.place.lat);
                expect(res.body.assignedplace.place.lng).to.be.equal(selectedParkingPlace.place.lng);
                done();
            }).catch(err => done(err)); 
        }).catch(err => done(err));
        
    });
    it('OK, the parking place destination will change if a new parking place is added and is nearer w.r.t the current position', (done) => {
        //This test means: i want to park in rome, any place is fine. by the time i sent
        //the request, there were 2 places to park in: one in via flaminia and one in via pomezia
        //the system selected the one in via pomezia being the nearest one
        //now i am travelling in via appia and the municipality adds a new parking place in this street
        //so when i will send my coords, the system will switch the destination with this newly added place
        dbUtils.addAParkingPlaceTest(//Roma via Appia
            municipality.postcode,
            41.851879,
            12.527260,
            faker.address.streetAddress()
        ).then(pp => {
            var options = {
                uri: 'http://localhost:3001/api/place/tracking',
                method: "POST",
                headers: {
                    'Cookie': reqId
                },
                body: { //a place near via Appia, destination was via flaminia
                    lat: 41.851879,
                    lng: 12.527260
                },
                json:true,
                simple: false,
                resolveWithFullResponse: true
            }
            request(options)
            .then(res => {
                expect(res.statusCode).to.be.equal(302);
                done();
            }).catch(err => done(err));
        })
    });
    it('OK, the parking place destination will not change if a parking place freed and is too far from the current one', (done) => {
        
        ParkingPlace.findByIdAndUpdate(occupiedParkingPlace.id,{
            status: 'FREE'
        }).then((doc) => { //parking place in tuscolana freed
            //send coordinates far from tuscolana
            var options = {
                uri: 'http://localhost:3001/api/place/tracking',
                method: "POST",
                headers: {
                    'Cookie': reqId
                },
                body: { //a place far from via tuscolana
                    lat: 41.841802,
                    lng: 12.542555
                },
                json:true,
                simple: false,
                resolveWithFullResponse: true
            }
            request(options)//update on driver position doesn't change the route
            .then(res => {
                expect(res.statusCode).to.be.equal(304);
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
        
    });
    
    it('OK, the parking place destination will change if a nearer parking place frees', (done) => {
        
        ParkingPlace.findByIdAndUpdate(occupiedParkingPlace.id,{
            status: 'FREE'
        }).then((doc) => { //parking place in salaria frees
            //send coordinates near salaria
            var options = {
                uri: 'http://localhost:3001/api/place/tracking',
                method: "POST",
                headers: {
                    'Cookie': reqId
                },
                body: { //a place near via salaria
                    lat: 42.396540,
                    lng: 12.860140
                },
                json:true,
                simple: false,
                resolveWithFullResponse: true
            }
            request(options)//update on driver position changes the route
            .then(res => {
                expect(res.statusCode).to.be.equal(302);
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
    })
})

