process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('request-promise');
const faker = require('faker');
const Request = require('../../../db/models/Request');
const db = require('../../../db/index');
const dbUtils = require('../../../utils/dbUtils');
const server = require('../../../server');
const tough = require('tough-cookie').Cookie;

describe('POST /api/pay', () => {
    var cookie;
    before((done) => {
        dbUtils.addARequestTest("Camerino","Camerano",'12-12-19','1111111',10,true)
            .then((res) => {
                cookie = res.headers['set-cookie'][0];
                done();
            })
            .catch((err) => done(err));
        
    })
    it('OK, paying for a request works', (done) => {
        var options = {
            method: "post",
            uri: 'http://localhost:3001/api/pay',
            headers: {
                'Cookie': cookie
            },
            resolveWithFullResponse: true
        }
        request(options)
            .then((res) => {
                expect(res).to.have.property('statusCode',200);
                done();
            })
            .catch((err) => done(err));
    })
})

