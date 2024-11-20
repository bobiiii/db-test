const express = require('express');
const metadataRoute = require('./metadataRoutes');

const metadataRoutes = express.Router();

metadataRoutes.use(metadataRoute);
metadataRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = metadataRoutes;
