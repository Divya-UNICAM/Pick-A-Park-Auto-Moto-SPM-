//Validation
const Joi = require('@hapi/joi');

//Register validation
const registerValidation = body => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .required(),
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
        startingLocation: Joi.string()
            .required(),
        targetLocation: Joi.string()
            .required(),
        duration: Joi.number()
            .required(),
        plateNumber: Joi.string()
            .required(),
        status: Joi.string()
    });
    return schema.validate(body);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.requestValidation = requestValidation;