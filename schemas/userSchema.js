const Joi = require("joi");


const setUserSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),

    lastname: Joi.string()
        .max(50)
        .required(),

    cellphone: Joi.string()
        .regex(new RegExp(/^\d{10}$/))
        .max(10)
        .min(10)
        .optional()
        .messages({
            "string.pattern.base": "Invalid number. Must be a numeric string"
        }),

    social_networks: Joi.object()
        .pattern(
            Joi.string()
                .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
                .required(),

            Joi.string()
                .required()
        )
        .required()

}).options({
    abortEarly: true
});

module.exports = {setUserSchema};