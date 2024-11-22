const {
  getAllGalleries, getGalleryByCategory, createGallery,
  updateGallery, updateGalleryImage, deleteGallery, deleteGalleryModal, getSingleGalleryById,
} = require('./galleryControllers');

module.exports = {
  getAllGalleries,
  getGalleryByCategory,
  createGallery,
  updateGallery,
  updateGalleryImage,
  getSingleGalleryById,
  deleteGallery,
  deleteGalleryModal,
};
