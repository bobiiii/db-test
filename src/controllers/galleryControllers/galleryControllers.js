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


const getSingleGalleryById = asyncHandler(async (req, res, next) => {
  const { galleryId } = req.params;
  const gallery = await GalleryModel.findById(galleryId);
  if (!gallery) {
    return next(new ErrorHandler('No galleries found!', 400));
  }

  return res.status(200).json(
    {
      status: 'Success',
      message: 'Request successfull',
      data: gallery,
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

  return res.status(200).json({ status: 'Success', message: 'Gallery deleted successfully' });
});

const updateGallery = asyncHandler(async (req, res, next) => {
  const { galleryId } = req.params; // Gallery ID
  const { name, category } = req.body; // Details to update
  // const { files } = req;
  // const openGraphImage = files.find((item) => item.fieldname === 'ogImage');

  // Find the gallery by ID
  const gallery = await GalleryModel.findById(galleryId);
  if (!gallery) {
    return next(new ErrorHandler('Gallery not found', 404));
  }

  // Check if a gallery with the same name already exists (excluding current gallery)
  if (name && name !== gallery.name) {
    const existingGallery = await GalleryModel.findOne({ name, _id: { $ne: galleryId } });
    if (existingGallery) {
      return next(new ErrorHandler('Gallery with this name already exists', 400));
    }
  }

  const mainImageFile = req.files.find((file) => file.fieldname === 'mainImage');

  let newimageId;
  if (mainImageFile) {
    newimageId = await updateImageOnDrive(gallery.mainImage, mainImageFile);
    if (!newimageId) {
      return next(new ErrorHandler('Unable to update gallery main Image', 400));
    }
  }

  // Update the gallery details
  gallery.name = name || gallery.name;
  gallery.category = category || gallery.category;
  gallery.mainImage = newimageId || gallery.mainImage;

  const updatedGallery = await gallery.save();

  if (!updatedGallery) {
    return next(new ErrorHandler('Unable to update gallery details!', 500));
  }

  return res.status(200).json({
    status: 'Success',
    message: 'Gallery details updated successfully',
    data: updatedGallery,
  });
});

const updateGalleryImage = asyncHandler(async (req, res, next) => {
  const { modalId } = req.params; // Extract gallery and image IDs
  const { applications, location, description } = req.body; // Metadata updates

  // Find the gallery by ID
  const gallery = await GalleryModel.findOne({
    'modalImages._id': modalId,
  });
  if (!gallery) {
    return next(new ErrorHandler('Gallery not found', 404));
  }

  // Find the specific image in the modalImages array
  const imageIndex = gallery.modalImages.findIndex(
    // eslint-disable-next-line no-underscore-dangle
    (image) => image._id.toString() === modalId,
  );

  if (imageIndex === -1) {
    return next(new ErrorHandler('Image not found in gallery', 404));
  }

  const imageFile = req.file;
  const oldImageId = gallery.modalImages[imageIndex].imageId; // Retain the current image ID
  let newImageId;
  if (imageFile) {
    // Upload new image
    newImageId = await updateImageOnDrive(oldImageId, imageFile);
  }

  // Update image metadata
  gallery.modalImages[imageIndex] = {
    // ...gallery.modalImages[imageIndex],
    // eslint-disable-next-line no-underscore-dangle
    _id: gallery.modalImages[imageIndex]._id,
    imageId: newImageId || gallery.modalImages[imageIndex].imageId,
    applications: applications || gallery.modalImages[imageIndex].applications,
    location: location || gallery.modalImages[imageIndex].location,
    description: description || gallery.modalImages[imageIndex].description,
  };

  // Save updated gallery
  const updatedGallery = await gallery.save();

  if (!updatedGallery) {
    return next(new ErrorHandler('Unable to update image in gallery!', 500));
  }

  return res.status(200).json({
    status: 'Success',
    message: 'Image updated successfully',
    data: updatedGallery.modalImages[imageIndex], // Return the updated image
  });
});

module.exports = {
  getAllGalleries,
  getGalleryByCategory,
  createGallery,
  updateGallery,
  updateGalleryImage,
  getSingleGalleryById,
  deleteGallery,
};
