const express = require('express');
const newsLetterRoute = require('./newsLetterRoutes');

const newsLetterRoutes = express.Router();

newsLetterRoutes.use(newsLetterRoute);
newsLetterRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = newsLetterRoutes;
