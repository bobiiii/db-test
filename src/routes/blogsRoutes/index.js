const express = require('express');
const blogRoute = require('./blogsRoutes');

const blogRoutes = express.Router();

blogRoutes.use(blogRoute);
blogRoutes.use('*', (req, res) => { res.status(404).send('Route Not Found'); });

module.exports = blogRoutes;
