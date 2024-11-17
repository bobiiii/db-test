/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const GalleryModel = require('../../models/gallery.model');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const {
  uploadImageToDrive,
  updateImageOnDrive,
  deleteImage,
  isImage,
} = require('../uploadImageController');

const getAllGalleries = asyncHandler(async (req, res, next) => {
  const galleries = await GalleryModel.find();
  if (!galleries.length) {
    return next(new ErrorHandler('No galleries found!', 400));
  }

  return res.status(200).json(
    {
      status: 'Success',
      message: 'Request successfull',
      data: galleries,
    },
  );
});

const getGalleryByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.query;
  const galleries = await GalleryModel.find({ category });
  if (!galleries.length) {
    return next(new ErrorHandler('No galleries found!', 400));
  }

  return res.status(200).json(
    {
      status: 'Success',
      message: 'Request successfull',
      data: galleries,
    },
  );
});

const createGallery = asyncHandler(async (req, res, next) => {
  const { name, category, galleryDetail } = req.body;
  const parsedGalleryDetail = Array.isArray(galleryDetail)
    ? galleryDetail
    : JSON.parse(galleryDetail);

  const mainImageFile = req.files.find((file) => file.fieldname === 'mainImage');
  const galleryFiles = req.files.filter((file) => file.fieldname.startsWith('galleryDetail'));

  let mainImageId = null;
  if (mainImageFile) {
    mainImageId = await uploadImageToDrive(mainImageFile);
  }

  const galleryWithImages = await Promise.all(
    parsedGalleryDetail.map(async (detail, index) => {
      const imageFile = galleryFiles.find(
        (file) => file.fieldname === `galleryDetail[${index}][image]`,
      );

      const imageId = imageFile ? await uploadImageToDrive(imageFile) : null;

      return {
        ...detail,
        imageId,
      };
    }),
  );

  // Save to MongoDB
  const newGallery = {
    name,
    category,
    mainImage: mainImageId,
    modalImages: galleryWithImages,
  };

  const verifyGallery = await GalleryModel.findOne({ name });
  if (verifyGallery) {
    return next(new ErrorHandler('Gallery with this name already exists', 500));
  }

  const gallery = await GalleryModel.create(newGallery);

  if (!gallery) {
    return next(new ErrorHandler('Unable to add gallery!', 500));
  }

  return res.status(201).json({ status: 'Success', message: 'Gallery created successfully', data: gallery });
});

const deleteGallery = asyncHandler(async (req, res, next) => {
  const { galleryId } = req.params;

  // Validate gallery ID
  if (!galleryId) {
    return next(new ErrorHandler('Gallery ID is required', 400));
  }

  // Find and delete gallery
  const gallery = await GalleryModel.findByIdAndDelete(galleryId);

  if (!gallery) {
    return next(new ErrorHandler('Gallery not found', 404));
  }

  // Delete associated images
  await deleteImage(gallery.mainImage);
  await Promise.all(gallery.modalImages.map(async (image) => deleteImage(image.imageId)));

  res.status(200).json({ status: 'Success', message: 'Gallery deleted successfully' });
});

const updateGallery = asyncHandler(async (req, res, next) => {
});

module.exports = {
  getAllGalleries, getGalleryByCategory, createGallery, updateGallery, deleteGallery,
};
