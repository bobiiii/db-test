const express = require('express');
const multer = require('multer');
const { visualizerControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const upload = multer();

const visualizerRoutes = express.Router();

// kitchen Routes
visualizerRoutes.post('/add-kitchen', upload.any(), visualizerControllers.addKitchen);
visualizerRoutes.get('/kitchens', visualizerControllers.kitchens);
visualizerRoutes.get('/kitchen/:kitchenId', visualizerControllers.kitchen);
visualizerRoutes.get('/single-kitchen', visualizerControllers.getSinglekitchen);
visualizerRoutes.put('/update-kitchen/:kitchenId', upload.any(), visualizerControllers.updateKitchen);
visualizerRoutes.delete('/delete-kitchen/:kitchenId', adminRoutes, visualizerControllers.deleteKitchen);
visualizerRoutes.post('/kitchen/add-colors/:kitchenId', upload.any(), visualizerControllers.addKitchenColors);
visualizerRoutes.get('/kitchen/kitchen-colors/:kitchencolorId', visualizerControllers.kitchenColor);
visualizerRoutes.put('/kitchen/update-color/:kitchencolorId', upload.any(), visualizerControllers.updateKitchenColor);
visualizerRoutes.delete('/kitchen/delete-color/:kitchencolorId', adminRoutes, visualizerControllers.deleteKitchenColor);

// Bathroom Routes
visualizerRoutes.post('/add-bathroom', upload.any(), visualizerControllers.addBathroom);
visualizerRoutes.get('/bathrooms', visualizerControllers.Bathrooms);
visualizerRoutes.get('/bathroom/:bathroomId', visualizerControllers.Bathroom);
visualizerRoutes.put('/update-bathroom/:bathroomId', upload.any(), visualizerControllers.updateBathroom);
visualizerRoutes.delete('/delete-bathroom/:bathroomId', adminRoutes, visualizerControllers.deleteBathroom);
visualizerRoutes.post('/bathroom/add-colors/:bathroomId', upload.any(), visualizerControllers.addBathroomColors);
visualizerRoutes.get('/bathroom/bathroom-colors/:bathroomcolorId', visualizerControllers.bathroomColor);
visualizerRoutes.put('/bathroom/update-color/:bathroomcolorId', upload.any(), visualizerControllers.updatebathroomColor);
visualizerRoutes.delete('/bathroom/delete-color/:bathroomcolorId', adminRoutes, visualizerControllers.deletebathroomColor);

module.exports = visualizerRoutes;
