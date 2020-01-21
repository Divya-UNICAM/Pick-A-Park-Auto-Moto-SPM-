process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const SensorModel = require('../../../db/models/Sensor');
const ParkingPlace = require('../../../db/models/ParkingPlace');
const Municipality = require('../../../db/models/Municipality');
const db = require('../../../db/index');
const server = require('../../../server');
const Sensor = require('../../../routes/sensors');

before((done) => {
    db.connect()
    .then(() => done())
    .catch((err) => done(err));
})

describe('GET /directions', () => {
    var sentRequestId;
    beforeEach((done) => {
        //Mock sensors and parking places
        const sentRequest = new Request({
            startingLocation: {
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
            },
            targetLocation: {
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
            },
            duration: 1,
            licensePlate: "aaaaaaa",
            date: faker.date.recent()
        }).save()
        .then((doc) => {
            sentRequestId = doc.id;
            done();
        })
    });
    it('should create a route', (done) => {
        request(server).get('/api/pay/test/success?id='+sentRequestId) //force payment success
            .then((res) => {
                expect(res.status).to.be.equal(302);
                done();
            })
            .catch((err) => done(err));
    })
})

