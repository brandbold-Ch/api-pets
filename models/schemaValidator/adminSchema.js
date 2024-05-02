const Joi = require("joi");
require("dotenv").config();


const setAdminSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required(),

    lastname: Joi.string()
        .max(50)
        .required(),

    token: Joi.string()
        .valid(process.env.TRUSTED_PERMISSIONS)
        .required()
        .messages({
            "any.only": "Invalid access token"
        })
});

module.exports = {setAdminSchema}
