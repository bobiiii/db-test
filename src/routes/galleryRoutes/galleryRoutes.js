const express = require('express');
const multer = require('multer');
const { galleryControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const upload = multer();

const galleryRoute = express.Router();

galleryRoute.get('/', galleryControllers.getAllGalleries);
galleryRoute.get('/gallery', galleryControllers.getGallery);
galleryRoute.post('/create-gallery', upload.any(), galleryControllers.createGallery);
galleryRoute.put('/update-gallery/:galleryId', upload.any(), galleryControllers.updateGallery);
galleryRoute.delete('/delete-gallery/:galleryId', galleryControllers.deleteGallery);

module.exports = galleryRoute;
