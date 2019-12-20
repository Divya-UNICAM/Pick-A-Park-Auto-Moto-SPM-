process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const Sensor = require('../../../db/models/Sensor');
const ParkingPlace = require('../../../db/models/ParkingPlace');
const Municipality = require('../../../db/models/Municipality');
const db = require('../../../db/index');
const server = require('../../../server');

before((done) => {
    db.connect('local').then(() => done()).catch((err) => done(err));
})
after((done) => {
    db.close().then(() => done()).catch((err) => done(err));
})

describe('get directions', () => {
    beforeEach((done) => {
        //Mock sensors and parking places
        
        
        Municipality.create({
            name: "Camerino",
            province: "MC",
            region: "Marche",
            postcode: 60032,
            parkingPlaces: [
                ParkingPlace.create({
                    sensors: [ 
                        Sensor.create({
                            location: {
                                lat: faker.address.latitude(),
                                lng: faker.address.longitude()
                            },
                            date: faker.date(),
                            detected: 0,
                            status: "FREE"
                        }),Sensor.create({
                            location: {
                                lat: faker.address.latitude(),
                                lng: faker.address.longitude()
                            },
                            date: faker.date(),
                            detected: 0,
                            status: "FREE"
                        }),Sensor.create({
                            location: {
                                lat: faker.address.latitude(),
                                lng: faker.address.longitude()
                            },
                            date: faker.date(),
                            detected: 0,
                            status: "FREE"
                        })
                    ],
                    date: faker.date(),
                    status: "FREE"
                })
            ],
            policeofficers: [

            ],
            date: Date.now()
            
        });
        
    });
    it('should create a route between position and sensor', (done) => {
        request(server).post('/api/request')
            .set('content-type','application/json')
            .send({
                startingLocation: faker.address.city(),
                targetLocation: faker.address.city(),
                duration: faker.random.number(),
                licensePlate: faker.random.alphaNumeric(7)
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('_id');
                expect(body).to.contain.property('startingLocation');
                expect(body).to.contain.property('targetLocation');
                expect(body).to.contain.property('duration');
                expect(body).to.contain.property('licensePlate');
                expect(body).to.contain.property('status');
                done();
            })
            .catch((err) => done(err));
    })
})

