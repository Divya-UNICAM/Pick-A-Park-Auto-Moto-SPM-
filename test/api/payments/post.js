process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const db = require('../../../db/index');
const server = require('../../../server');

describe('POST /api/pay', () => {
    before((done) => {
        db.connect()
        .then(() => done())
        .catch((err) => done(err));
    })
    it('OK, sending a payment request works', (done) => {
        request(server).get('/api/pay')
            .then((res) => {
                expect(res).to.have.property('status',200);
                done();
            })
            .catch((err) => done(err));
    })
})

