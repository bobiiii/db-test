const express = require('express');
const { queriesControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const queryRoute = express.Router();

queryRoute.post('/add-query', queriesControllers.createQuery);
queryRoute.get('/:queryId', queriesControllers.getQuery);
queryRoute.get('/', queriesControllers.getAllQuery);
queryRoute.delete('/delete-query/:queryId', queriesControllers.deleteQuery);

module.exports = queryRoute;
