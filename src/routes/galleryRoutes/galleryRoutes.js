const express = require('express');
const multer = require('multer');
const { galleryControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const upload = multer();

const galleryRoute = express.Router();

galleryRoute.get('/', galleryControllers.getAllGalleries);
galleryRoute.get('/gallery', galleryControllers.getGalleryByCategory);
galleryRoute.post('/create-gallery', upload.any(), galleryControllers.createGallery);
galleryRoute.put('/update-gallery/:galleryId', upload.any(), galleryControllers.updateGallery);
galleryRoute.put('/update-gallery-modal/:modalId', upload.any(), galleryControllers.updateGalleryImage);
galleryRoute.delete('/delete-gallery/:galleryId', galleryControllers.deleteGallery);

module.exports = galleryRoute;
