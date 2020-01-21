//Validation
const Joi = require('@hapi/joi');

//Register validation
const registerValidation = body => {
    const schema = Joi.object({
        name: Joi.string()
            .min(4)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(8)
            .required(),
        privileges: Joi.number()
    });
    return schema.validate(body);
};

//Login validation
const loginValidation = body => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(8)
            .required()
    });
    return schema.validate(body);
};

//Request validation
const requestValidation = body => {
    const schema = Joi.object({
        startingLocation: Joi.object({
            lat: Joi.number(),
            lng: Joi.number()
        }),
        targetLocation: Joi.object({
            lat: Joi.number(),
            lng: Joi.number()
        }),
        date: Joi.date()
            .required(),
        licensePlate: Joi.string()
            .required(),
        duration: Joi.number()
            .required(),
        status: Joi.string()
    });
    return schema.validate(body);
};

//Sensor validation
const sensorValidation = body => {
    const schema = Joi.object({
        parkingPlace: Joi.string().hex(),
        position: Joi.number().required(),
        ipAddress: Joi.string().ip().required(),
        update: Joi.string(),
        date: Joi.date(),
        detected: Joi.number(),
        status: Joi.string()
    });
    return schema.validate(body);
};

//Parking place validation
const parkingPlaceValidation = body => {
    const schema = Joi.object({
        municipality: Joi.string()
            .hex(),
        location: Joi.object({
            lat: Joi.number()
                .required(),
            lng: Joi.number()
                .required(),
            address: Joi.string()
                .required()
        }),
        date: Joi.date(),
        status: Joi.string()
    });
    return schema.validate(body);
};

//Municipality Validation
const municipalityValidation = body => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),
        province: Joi.string()
            .required(),
        region: Joi.string()
            .required(),
        postcode: Joi.string()
            .required(),
        location: Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        }),
        policeOfficers: Joi.array(),
        date: Joi.date()
    });
    return schema.validate(body);
};

//Police officers Validation
const policeOfficerValidation = body => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
        badge: Joi.string(),
        status: Joi.string()
    });
    return schema.validate(body);
};

//Job Validation
const jobValidation = body => {
    const schema = Joi.object({
        municipality: Joi.string(),
        policeOfficer: Joi.string(),
        parkingPlace: Joi.string(),
        date: Joi.date(),
        status: Joi.string()
    });
    return schema.validate(body);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.requestValidation = requestValidation;
module.exports.sensorValidation = sensorValidation;
module.exports.parkingPlaceValidation = parkingPlaceValidation;
module.exports.municipalityValidation = municipalityValidation;
module.exports.policeOfficerValidation = policeOfficerValidation;
module.exports.jobValidation = jobValidation;