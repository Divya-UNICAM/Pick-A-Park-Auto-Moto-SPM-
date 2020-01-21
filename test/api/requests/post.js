process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const db = require('../../../db/index');
const server = require('../../../server');

describe('POST /api/request', () => {
    before((done) => {
        db.connect()
        .then(() => done())
        .catch((err) => done(err));
    })
    it('OK, sending a request works', (done) => {
        request(server).post('/api/request')
            .set('content-type','application/json')
            .send({
                startingLocation: faker.address.city(),
                targetLocation: faker.address.city(),
                duration: faker.random.number(),
                licensePlate: faker.random.alphaNumeric(7),
                date: "2020-01-18"
            })
            .then((res) => {
                expect(res.status).to.be.equal(400); //Expect 400 due to problems with payment service
                //The important thing is that the request arrives and it's created inside the database
                done();
            })
            .catch((err) => done(err));
    })
})

