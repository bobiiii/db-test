const express = require('express');
const visualizerRoute = require('./visualizerRoutes');

const visualizerRoutes = express.Router();

visualizerRoutes.use(visualizerRoute);
visualizerRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = visualizerRoutes;
