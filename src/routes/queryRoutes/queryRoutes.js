const express = require('express');
const multer = require('multer');
const { queriesControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const upload = multer();

const queryRoute = express.Router();

queryRoute.post('/add-query', upload.any(), queriesControllers.createQuery);
queryRoute.get('/:queryId', adminRoutes, queriesControllers.getQuery);
queryRoute.get('/', adminRoutes, queriesControllers.getAllQuery);
queryRoute.delete('/delete-query/:queryId', adminRoutes, queriesControllers.deleteQuery);

module.exports = queryRoute;
