const express = require('express');
const collectionRoute = require('./collectionRoutes');

const collectionRoutes = express.Router();

collectionRoutes.use(collectionRoute);
collectionRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = collectionRoutes;
