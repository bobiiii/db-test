const express = require('express');
const queryRoute = require('./queryRoutes');

const queryRoutes = express.Router();

queryRoutes.use(queryRoute);
queryRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = queryRoutes;
