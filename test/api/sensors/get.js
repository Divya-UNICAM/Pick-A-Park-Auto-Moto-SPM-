process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const expect = require('chai').expect;
const should = require('chai').should;
const request = require('supertest');
const db = require('../../../db/index');
const Sensor = require('../../../db/models/Sensor');
const Municipality = require('../../../db/models/Municipality');
const ParkingPlace = require('../../../db/models/ParkingPlace');
const faker = require('faker');
const server = require('../../../server');

before((done) => {
    db.connect()
        .then(() => done()) 
        .catch((err) => done(err));
})
after((done) => {
    db.close()
    .then(() => done())
    .catch((err) => done(err));
})

describe('GET /api/sensor', () => {

    beforeEach((done) => {
        const municpt1 = new Municipality({
            name: 'Camerino',
            province: 'MC',
            region: 'Marche',
            postcode: 62032,
            location: {
                lat: faker.address.latitude(),
                lng: faker.address.longitude()
            }
        }).save();
        municpt1.then((doc) => {
            new ParkingPlace({
                municipality: doc.id,
                location: {
                    lat: faker.address.latitude(),
                    lng: faker.address.longitude(),
                    address: 'aaa'
                }
            }).save().then((doc) => {
                new Sensor({
                    parkingplace: doc.id,
                    position: 0,
                    ipAddress: faker.internet.ip()
                }).save().then((doc) => {
                    done();
                }).catch((err) => done(err));
            }).catch((err) => done(err));
        }).catch((err) => done(err));
    })
    it('should return all sensors', (done) => {
        request(server).get('/api/dashboard/sensors/62032/aaa')
        .set("Cookie",'auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
        .then((res) => {
            expect(res.status).to.be.equal(200);
            done()
        })
        .catch((err) => done(err))
    })
})

after((done) => {

    db.close();
})