const express = require('express');
const { newsletterControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const newsLetterRoute = express.Router();

newsLetterRoute.post('/add-newsletter', newsletterControllers.createNewsletter);
newsLetterRoute.get('/', newsletterControllers.getAllNewsletter);
newsLetterRoute.delete('/delete-newsletter/:newsletterId', newsletterControllers.deleteNewsletter);

module.exports = newsLetterRoute;
