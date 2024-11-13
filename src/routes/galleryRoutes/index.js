const express = require('express');
const galleryRoute = require('./galleryRoutes');

const galleryRoutes = express.Router();

galleryRoutes.use(galleryRoute);
galleryRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = galleryRoutes;
