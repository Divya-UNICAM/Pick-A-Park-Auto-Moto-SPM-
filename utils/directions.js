const request = require('request-promise');

async function getDirections(coordinates) {
    let stlat = coordinates[0][0];
    let stlng = coordinates[0][1];

    let tglat = coordinates[1][0];
    let tglng = coordinates[1][1];
    console.log(stlat+', '+stlng)
    console.log(tglat+', '+tglng)
    return request.post('https://api.openrouteservice.org/v2/directions/driving-car?api_key='+process.env.OPEN_ROUTE_API
    +'&start='+stlat+','+stlng+'&end='+tglat+','+tglng)
        .then((body) => {
            return body;
        })
        .catch((err) => {
            return err;
        })
}

module.exports = { getDirections };