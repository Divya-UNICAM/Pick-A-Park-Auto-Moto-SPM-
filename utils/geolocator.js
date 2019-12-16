const request = require('request-promise');
const { MapboxGeocoder } = require('@mapbox/mapbox-gl-geocoder');
//User sends his/her IP address in the request and the server resolves it as geohash coordinates

let retIp = null;

var geocoder = new MapboxGeocoder();
geocoder

function geolocate(ip) {
    //Limited to 45 requests per minute from same IP address
    return request.get('http://ip-api.com/json/'+ip)
        .then((body) => {return body;})
        .catch((err) => {return err;})
}

module.exports = { geolocate };