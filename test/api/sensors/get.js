process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const expect = require('chai').expect;
const should = require('chai').should;
const request = require('supertest');
const db = require('../../../db/index');
const Sensor = require('../../../db/models/Sensor');
const SensorClass = require('../../../utils/sensors');
const faker = require('faker');
const server = require('../../../server');

let refs = [];
describe('GET /api/sensor', () => {
    beforeEach((done) => {
        for(let i = 0; i < 2; i++)
            refs.push(new SensorClass());
        done();
    });
    it('should create some jobs for officers', (done) => {
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
    for(let i = 0; i<refs.length;i++)
        refs.pop();
})