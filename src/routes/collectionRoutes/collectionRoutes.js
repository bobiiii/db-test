const express = require('express');
const { collectionControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const collectionRoute = express.Router();

collectionRoute.get('/', collectionControllers.getCollections);
collectionRoute.post('/add-collection', collectionControllers.addCollection);
collectionRoute.get('/:collectionId', collectionControllers.getCollection);
collectionRoute.put('/update-collection/:collectionId', collectionControllers.updateCollection);
collectionRoute.delete('/delete-collection/:collectionId', adminRoutes, collectionControllers.deleteCollection);

module.exports = collectionRoute;
