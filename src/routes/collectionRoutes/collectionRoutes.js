const express = require('express');
const { collectionControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const collectionRoute = express.Router();

collectionRoute.get('/', collectionControllers.getCollections);
collectionRoute.post('/add-collection', collectionControllers.addCollection);
collectionRoute.get('/:collectionId', collectionControllers.getCollection);
collectionRoute.put('/update-collection/:collectionId', collectionControllers.updateCollection);
collectionRoute.delete('/delete-collection/:collectionId', adminRoutes, collectionControllers.deleteCollection);
// varieties api
collectionRoute.post('/variety/:collectionId/add-variety', collectionControllers.addCollectionVariety);
collectionRoute.put('/variety/:collectionId/update-variety/:varietyId', collectionControllers.updateCollectionVariety);

module.exports = collectionRoute;
