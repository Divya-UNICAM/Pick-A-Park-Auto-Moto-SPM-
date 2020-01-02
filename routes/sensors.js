//Sensor class used to simulate sensors in a real application

const request = require('request-promise');
const server = require('../server');
const Municipality = require('../db/models/Municipality');

class Sensor {
    constructor(lat, lng, ) {
        this.lat = lat;
        this.lng = lng;
        this.detect = 0;
        this.updates = [];
        this.date = Date.now();
        this.status = "FREE";
        this.plateNumber = "";
    }

    
    obtainMunicipalityID() {
        const mun = Municipality.findOne({
            sensors: Sensor.findOne({
                lat: this.lat,
                lng: this.lng
            })
        });
        return mun.lean()._id;
    }

    sendUpdate() {
        if(Math.random() <= 0.5) {
            this.status = "OCCUPIED";
            this.plateNumber = "111111";
        } else {
            this.status = "FREE";
            this.plateNumber = "";
        }
        return request('http://localhost:3001/api/dashboard/parkingplaces/'+this.obtainMunicipalityID()+'/update/:parkid', JSON.parse(this))
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

    simulateDetection() {
        while(true) {
            let interval = Math.floor(Math.random()*1000);
            await this.sleep(interval);
            this.sendUpdate();
        }
    }
}

module.exports = Sensor;