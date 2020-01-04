//Sensor class used to simulate sensors in a real application
const request = require('supertest');
const server = require('../server');
const Municipality = require('../db/models/Municipality');
const SensorModel = require('../db/models/Sensor');


module.exports = class Sensor {
    constructor() {
        this.sensors = await SensorModel.find();
    }

    
    obtainMunicipalityID() {
        const mun = await this.sensors.find((index) => Math.floor(Math.random()))
        if(!mun)
            return 0;
        return mun[0].id;
    }

    sendUpdate() {
        if(Math.random() <= 0.5) {
            this.status = "OCCUPIED";
            this.plateNumber = "111111";
        } else {
            this.status = "FREE";
            this.plateNumber = "";
        }
        return request(server).post('/api/dashboard/parkingplaces/'+this.obtainMunicipalityID()+'/'+'Le mosse, 23'+'/update', JSON.parse(this))
            .then((body) => {
                return body;
            })
            .catch((err) => {
                return err;
            })
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve,ms));
    }

    async simulateDetection() {
        while(true) {
            let interval = Math.floor(Math.random()*1000);
            await this.sleep(interval);
            this.sendUpdate();
        }
    }
}