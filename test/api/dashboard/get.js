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


describe('GET /api/dashboard/parkingplaces', () => {
    it('should return all parking places', (done) => {
        request(server).get('/api/dashboard/parkingplaces')
        .then((res) => {
            console.log(res.body);
            expect(res.status).to.be.equal(200);
            done()
        })
        .catch((err) => done(err))
    })
})