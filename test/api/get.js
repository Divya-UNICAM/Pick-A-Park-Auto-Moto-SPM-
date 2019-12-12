process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const should = require('chai').should;
const request = require('supertest');
const server = require('../../server');

describe('GET /', () => {
    it('should return Home page', (done) => {
        request(server).get('/')
        .then((res) => {
            const body = res.body;
            expect(res.status).to.be.equal(200);
            done()
        })
        .catch((err) => done(err))
    })
})