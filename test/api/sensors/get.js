process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const expect = require('chai').expect;
const should = require('chai').should;
const request = require('supertest');
const db = require('../../../db/index');
const Sensor = require('../../../db/models/Sensor');
const faker = require('faker');
const server = require('../../../server');

before((done) => {
    db.connect()
        .then(() => { console.log('Connected to test DB!'); done(); }) 
        .catch((err) => { console.log(err); done(err)});
})

describe('GET /api/sensor', () => {

    beforeEach((done) => {
        for(let i=0; i < 10; i++)
            Sensor.create({
                location: {
                    lat: faker.address.latitude(),
                    lng: faker.address.longitude()
                },
                date: faker.date.recent(2),
                detected: 0,
                status: "FREE"
            });
        done();
    })
    it('should return all sensors', (done) => {
        request(server).get('/')
        .then((res) => {
            const body = res.body;
            expect(res.status).to.be.equal(200);
            console.log(res.body);
            done()
        })
        .catch((err) => done(err))
    })
})

after((done) => {

    db.close();
})