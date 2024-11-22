const {
  getAllGalleries, getGalleryByCategory, createGallery,
  updateGallery, updateGalleryImage, deleteGallery, getSingleGalleryById,
} = require('./galleryControllers');

module.exports = {
  getAllGalleries,
  getGalleryByCategory,
  createGallery,
  updateGallery,
  updateGalleryImage,
  getSingleGalleryById,
  deleteGallery,
};
