/* eslint-disable max-len */
const express = require('express');
const multer = require('multer');
const { visualizerControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const upload = multer();

const visualizerRoutes = express.Router();

// kitchen Routes
visualizerRoutes.post('/add-ambient', upload.any(), visualizerControllers.addAmbient);
visualizerRoutes.get('/ambients', visualizerControllers.getAmbients);
visualizerRoutes.get('/ambient/:ambientId', visualizerControllers.getAmbient);
visualizerRoutes.get('/single-ambient', visualizerControllers.getSingleAmbient);
visualizerRoutes.put('/update-ambient/:ambientId', upload.any(), visualizerControllers.updateAmbient);
visualizerRoutes.delete('/delete-ambient/:ambientId', adminRoutes, visualizerControllers.deleteAmbient);
visualizerRoutes.post('/ambient/add-colors/:ambientId', upload.any(), visualizerControllers.addAmbientColors);
visualizerRoutes.get('/ambient/ambient-colors/:ambientcolorId', visualizerControllers.getAmbientColor);
visualizerRoutes.put('/ambient/update-color/:ambientcolorId', upload.any(), visualizerControllers.updateAmbientColor);
visualizerRoutes.delete('/ambient/delete-color/:ambientcolorId', adminRoutes, visualizerControllers.deleteAmbientColor);

// Bathroom Routes
// visualizerRoutes.post('/add-bathroom', upload.any(), visualizerControllers.addBathroom);
// visualizerRoutes.get('/bathrooms', visualizerControllers.Bathrooms);
// visualizerRoutes.get('/bathroom/:bathroomId', visualizerControllers.Bathroom);
// visualizerRoutes.put('/update-bathroom/:bathroomId', upload.any(), visualizerControllers.updateBathroom);
// visualizerRoutes.delete('/delete-bathroom/:bathroomId', adminRoutes, visualizerControllers.deleteBathroom);
// visualizerRoutes.post('/bathroom/add-colors/:bathroomId', upload.any(), visualizerControllers.addBathroomColors);
// visualizerRoutes.get('/bathroom/bathroom-colors/:bathroomcolorId', visualizerControllers.bathroomColor);
// visualizerRoutes.put('/bathroom/update-color/:bathroomcolorId', upload.any(), visualizerControllers.updatebathroomColor);
// visualizerRoutes.delete('/bathroom/delete-color/:bathroomcolorId', adminRoutes, visualizerControllers.deletebathroomColor);

module.exports = visualizerRoutes;
