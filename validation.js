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
            lat: Joi.string().required(),
            lng: Joi.string().required()
        }).required(),
        targetLocation: Joi.object({
            lat: Joi.string().required(),
            lng: Joi.string().required()
        }).required(),
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
        location: Joi.object({
            lat: Joi.number(),
            lng: Joi.number()
        })
        .required(),
        date: Joi.date()
            .required(),
        detected: Joi.number(),
        status: Joi.string()
    });
    return schema.validate(body);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.requestValidation = requestValidation;
module.exports.sensorValidation = sensorValidation;