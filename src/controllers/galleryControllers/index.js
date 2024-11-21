const {
  getAllGalleries, getGalleryByCategory, createGallery,
  updateGallery, updateGalleryImage, deleteGallery,
} = require('./galleryControllers');

module.exports = {
  getAllGalleries,
  getGalleryByCategory,
  createGallery,
  updateGallery,
  updateGalleryImage,
  deleteGallery,
};
