process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const db = require('../../../db/index');
const server = require('../../../server');



describe('POST /api/request', () => {
    after((done) => {
        db.close()
        .then(() => done())
        .catch((err) => done(err));
    });
    
    it('after confirming a request, I receive the payment URL', (done) => {
        request(server).post('/api/request')
            .set('content-type','application/json')
            .send({
                startingLocation: faker.address.city(),
                targetLocation: faker.address.city(),
                duration: faker.random.number(),
                date: faker.date.recent(),
                licensePlate: faker.random.alphaNumeric(7)
            })
            .then((res) => {
                expect(res).to.have.property('status',200);
                done();
            })
            .catch((err) => done(err));
    })
})

