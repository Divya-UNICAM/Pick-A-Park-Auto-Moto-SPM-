process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const db = require('../../../db/index');
const server = require('../../../server');

describe('POST /api/request', () => {
    before((done) => {
        db.connect('local').then(() => done()).catch((err) => done(err));
    })
    after((done) => {
        db.close().then(() => done()).catch((err) => done(err));
    })
    it('OK, sending a request works', (done) => {
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

