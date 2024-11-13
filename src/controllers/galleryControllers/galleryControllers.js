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
  const galleries = await GalleryModel.find({});
  if (!galleries.length) {
    return next(new ErrorHandler('No galleries found!', 400));
  }

  res.status(200).json(
    {
      message: 'working',
      data: galleries,
    },
  );
});

const getGallery = asyncHandler(async (req, res) => {
  res.send('working');
});

const createGallery = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { category, name, modalImages } = req.body;

  // Validate required fields
  if (!category || !name) {
    return next(new ErrorHandler('Please provide category and name fields', 400));
  }

  // Parse and validate modalImages data
  let modalImagesData;
  try {
    modalImagesData = JSON.parse(modalImages); // Expecting modalImages as a JSON string
  } catch (error) {
    return next(new ErrorHandler('Invalid format for modal images', 400));
  }

  if (!Array.isArray(modalImagesData) || modalImagesData.length === 0) {
    return next(new ErrorHandler('Modal images are required', 400));
  }

  // Validate each modal image object
  for (const [index, imageData] of modalImagesData.entries()) {
    if (!imageData.applications || !imageData.location || !imageData.description) {
      return next(new ErrorHandler(`Please provide all required fields for modal image ${index + 1}`, 400));
    }
  }

  // Find the main image file
  const mainGalleryImage = files.find((file) => file.fieldname === 'mainImage');
  if (!mainGalleryImage || !isImage(mainGalleryImage)) {
    return next(new ErrorHandler('Please provide a valid main image', 400));
  }

  // Upload main image
  const mainImage = await uploadImageToDrive(mainGalleryImage);

  // Upload each modal image and pair with its metadata
  const uploadedModalImages = await Promise.all(
    modalImagesData.map(async (imageData, index) => {
      const modalImageFile = files.find((file) => file.fieldname === `modalImage${index + 1}`);
      if (!modalImageFile || !isImage(modalImageFile)) {
        return next(new ErrorHandler(`Invalid image file for modal image ${index + 1}`, 400));
      }

      const uploadedImageUrl = await uploadImageToDrive(modalImageFile);
      return {
        ...imageData,
        image: uploadedImageUrl,
      };
    }),
  );

  // Check if gallery with the same name exists
  const verifyGallery = await GalleryModel.findOne({ name });
  if (verifyGallery) {
    return next(new ErrorHandler('Gallery already exists!', 400));
  }

  // Create the gallery
  const gallery = await GalleryModel.create({
    name,
    category,
    mainImage,
    modalImages: uploadedModalImages,
  });

  if (!gallery) {
    return next(new ErrorHandler('Unable to add gallery!', 500));
  }

  res.status(201).send({ message: 'Gallery created successfully' });
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

  res.status(200).send({ message: 'Gallery deleted successfully' });
});

const updateGallery = asyncHandler(async (req, res, next) => {
});

module.exports = {
  getAllGalleries, getGallery, createGallery, updateGallery, deleteGallery,
};
