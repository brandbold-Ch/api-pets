const { checkUserExists } = require('../middlewares/entityManager');
const authControllers = require('../controllers/authControllers')
const isAuthenticate = require('../middlewares/authenticate');
const express = require('express');
const authRoute = express.Router();

authRoute.get('/credentials/:id', checkUserExists, isAuthenticate, authControllers.getCredentials);
authRoute.post('/login', express.urlencoded({ extended: true }), authControllers.login);
authRoute.put('/credentials/:id', checkUserExists, isAuthenticate, express.urlencoded({ extended: true }), authControllers.updateCredentials);

module.exports = authRoute;
