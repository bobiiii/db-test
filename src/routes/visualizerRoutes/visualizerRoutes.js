const express = require('express');
const { visualizerControllers } = require('../../controllers');

const visualizerRoutes = express.Router();

visualizerRoutes.get('/kitchens', visualizerControllers.getKitchen);
visualizerRoutes.post('/add-kitchen', visualizerControllers.addKitchen);
visualizerRoutes.put('/update-kitchen/:kitchenId', visualizerControllers.updateKitchen);
visualizerRoutes.delete('/delete-kitchen/:kitchenId', visualizerControllers.deleteKitchen);

visualizerRoutes.get('/bathrooms', visualizerControllers.getBathrooms);
visualizerRoutes.post('/add-bathroom', visualizerControllers.addBathroom);
visualizerRoutes.put('/update-bathroom/:bathroomId', visualizerControllers.updateBathroom);
visualizerRoutes.delete('/delete-bathroom/:bathroomId', visualizerControllers.deleteBathroom);

module.exports = visualizerRoutes;
