const {setUserSchema} = require("../../models/schemaValidator/userSchema");
const {setAuthSchema} = require("../../models/schemaValidator/authSchema");
const {HandlerHttpVerbs} = require("../../errors/handlerHttpVerbs");
const {ValidationError} = require("joi");


const validateUserData = async (req, res, next) => {
    try {
        const {name, lastname, cellphone, social_networks, email, password} = req.body;

        await setUserSchema.validateAsync(
            {
                name: name,
                lastname: lastname,
                cellphone: cellphone,
                social_networks: social_networks
            },
            {abortEarly: false}
        );

        if (req.method === "POST") {
            await setAuthSchema.validateAsync(
                {
                    email: email,
                    password: password
                },
                {abortEarly: false}
            );
        }

        next();

    } catch (err) {

        if (err instanceof ValidationError) {
            res.status(400).json(
                HandlerHttpVerbs.badRequest(
                    err.message, {url: req.baseUrl, verb: req.method}
                )
            );

        } else {
            res.status(500).json(
                HandlerHttpVerbs.internalServerError(
                    err.message, {url: req.baseUrl, verb: req.method}
                )
            );
        }
    }
}

module.exports = {validateUserData}