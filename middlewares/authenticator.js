/**
 * @author Brandon Jared Molina Vazquez
 * @date 30/09/2023
 * @file This module is for user authentication.
 */

// Authenticator.js
const jwt = require("jsonwebtoken");
const {HandlerHttpVerbs} = require("../errors/handlerHttpVerbs");
const {TokenExpiredError} = require("jsonwebtoken");
require("dotenv").config();


const roles = [
    "USER",
    "RESCUER",
    "ADMINISTRATOR"
];

const routes = {
    USER: [
        '/api/v2/users',
        '/api/v2/auth'
    ],
    RESCUER: [
        '/api/v2/rescuers',
        '/api/v2/auth',
    ],
    ADMINISTRATOR: [
        '/api/v2/admins',
        '/api/v2/auth'
    ]
};

const rolePermissions = (url) => {
    switch (url) {
        case "/api/v2/users":
            return "USER";

        case "/api/v2/rescuers":
            return "RESCUER";

        case "/api/v2/admins":
            return "ADMINISTRATOR";
    }
}

const routesPermissions = (userData, url) => {
    return new Promise((resolve, reject) => {
        const key = userData["role"];

        if (routes[key[0]].includes(url)) {
            resolve(userData);

        } else {
            reject([401, "You don´t have access to this route 🚫"]);
        }
    });
}

const verifyRole = (tokenDecrypted) => {
    return new Promise((resolve, reject) => {
        const role = tokenDecrypted?.role;

        if (role?.length) {

            role.forEach(rol => {
                if (!roles.includes(rol)) {
                    reject([400, "Some of your roles do not exist in the system 😒"]);
                }
            });
            resolve(tokenDecrypted);

        } else {
            reject([400, "You are not sending me your roles 😒"]);
        }
    });
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token) {
            try {
                resolve(jwt.verify(token.substring(7), process.env.SECRET_KEY));

            } catch (err) {

                if (err instanceof TokenExpiredError) {
                    reject([401, "Expired token 💨"]);

                } else {
                    reject(err);
                }

            }

        } else {
            reject([400, "You didn't send the token 🙄"]);
        }
    });
}


/**
 * Middleware to check the authentication using JSON Web Tokens (JWT).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const Authenticate = (req, res, next) => {
    verifyToken(req.headers.authorization)
        .then(tokenDecrypted => verifyRole(tokenDecrypted))
        .then(role => routesPermissions(role, req.baseUrl))
        .then(data => {

            req.id = data["user"];
            req.role = data["role"];
            next();

        })
        .catch(err => {

            if (err instanceof Array) {

                res.status(err[0]).json(
                    HandlerHttpVerbs.automaticClientErrorSelection(
                        err[1],
                        {
                            url: req.baseUrl,
                            verb: req.method,
                            role: rolePermissions(req.baseUrl)
                        },
                        err[0]
                    )
                );

            } else {
                res.status(500).json(
                    HandlerHttpVerbs.internalServerError(
                        err.message, {url: req.baseUrl, verb: req.method}
                    )
                );
            }
        })
}

module.exports = {Authenticate};