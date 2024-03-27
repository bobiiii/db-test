const express = require('express');
const multer = require('multer');
const { collectionControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const upload = multer();

const collectionRoute = express.Router();

collectionRoute.get('/', collectionControllers.getCollections);
collectionRoute.post('/add-collection', upload.any(), collectionControllers.addCollection);
collectionRoute.get('/:collectionId', collectionControllers.getCollection);
collectionRoute.put('/update-collection/:collectionId', upload.any(), collectionControllers.updateCollection);
collectionRoute.delete('/delete-collection/:collectionId', adminRoutes, collectionControllers.deleteCollection);
// varieties api
collectionRoute.post('/variety/:collectionId/add-variety', upload.any(), collectionControllers.addCollectionVariety);
collectionRoute.put('/variety/:collectionId/update-variety/:varietyId', upload.any(), collectionControllers.updateCollectionVariety);

module.exports = collectionRoute;
