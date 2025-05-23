/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { collectionModel } = require('../../models');
const {
  uploadImageToDrive,
  updateImageOnDrive,
  deleteImage,
  isImage,
} = require('../uploadImageController');
const { createSlug } = require('../../utils/createSlug');

const addCollection = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { collectionName, collectionHeading, collectionDescription } = req.body;

  const collectionImage = files.find(
    (item) => item.fieldname === 'collectionImage',
  );
  const dropDownImage = files.find(
    (item) => item.fieldname === 'dropDownImage',
  );

  if (!collectionName || !collectionImage || !collectionHeading || !collectionDescription) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  if (!isImage(collectionImage)) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }

  const verifyCollection = await collectionModel.findOne({ collectionName });

  if (verifyCollection) {
    return next(new ErrorHandler('Collection Already Exist', 400));
  }

  const collectionImageId = await uploadImageToDrive(collectionImage);
  const dropDownImageId = await uploadImageToDrive(dropDownImage);

  const slugAuto = createSlug(collectionName);

  const collection = await collectionModel.create({
    collectionName,
    collectionHeading,
    collectionDescription,
    slug: slugAuto,
    collectionImage: collectionImageId,
    dropDownImage: dropDownImageId,
  });

  if (!collection) {
    return next(new ErrorHandler('unable to create collection', 400));
  }
  return res.status(200).json({ message: 'Created successfully', status: 'Success' });
});

const getCollection = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const collection = await collectionModel.findOne({ slug });

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }
  return res.status(200).json({ data: collection });
});

const newArrivals = asyncHandler(async (req, res, next) => {
  const collections = await collectionModel.aggregate([
    { $unwind: '$variety' }, // Flatten variety arrays
    { $sort: { 'variety.createdAt': -1 } }, // Sort by variety creation date
    { $limit: 15 },
    {
      $project: {
        _id: 0,
        variety: 1,
        slug: 1,
      },
    },
  ]);

  if (!collections || collections.length === 0) {
    return next(new ErrorHandler('Collections not found', 404));
  }

  return res.status(200).json({ status: 'Success', data: collections });
});

const updateCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const { files } = req;
  const { collectionName, collectionHeading, collectionDescription } = req.body;

  const collectionImageFile = files.find(
    (item) => item.fieldname === 'collectionImage',
  );
  const dropDownImageFile = files.find(
    (item) => item.fieldname === 'dropDownImage',
  );

  const verifyCollectionId = await collectionModel.findById(collectionId);
  if (!verifyCollectionId) {
    return next(new ErrorHandler('Collection Not FOund', 400));
  }

  const updateFields = {};
  if (collectionName !== undefined) {
    updateFields.collectionName = collectionName;
    updateFields.slug = createSlug(collectionName);
  }

  if (collectionHeading !== undefined) {
    updateFields.collectionHeading = collectionHeading;
  }

  if (collectionDescription !== undefined) {
    updateFields.collectionDescription = collectionDescription;
  }

  if (collectionImageFile !== undefined) {
    if (!isImage(collectionImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = verifyCollectionId.collectionImage;
    const updatedImg = await updateImageOnDrive(fileId, collectionImageFile);
    updateFields.collectionImage = updatedImg;
  }
  if (dropDownImageFile !== undefined) {
    if (!isImage(dropDownImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = verifyCollectionId.dropDownImage;
    const updatedImg = await updateImageOnDrive(fileId, dropDownImageFile);
    updateFields.dropDownImage = updatedImg;
  }

  const collection = await collectionModel.findByIdAndUpdate(
    collectionId,
    updateFields,
    { new: true },
  );

  if (!collection) {
    return next(new ErrorHandler('Unable To Update Collection', 500));
  }
  return res.status(200).json({ message: 'collection Update Successfully', status: 'Success', data: collection });
});

const deleteCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const collection = await collectionModel.findById(collectionId);

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }

  const { collectionImage, dropDownImage } = collection;
  await deleteImage(collectionImage);

  if (dropDownImage) {
    await deleteImage(dropDownImage);
  }

  const deleteCollection = await collectionModel.findByIdAndDelete(collectionId);

  if (!deleteCollection) {
    return next(new ErrorHandler('Unable to delete collection', 500));
  }
  return res.status(200).json({ message: 'Collection deleted successfully', status: 'Success' });
});

const getCollections = asyncHandler(async (req, res, next) => {
  const collections = await collectionModel.find({});

  if (!collections) {
    return next(new ErrorHandler('Collections not found', 404));
  }
  return res.status(200).json({ status: 'Success', data: collections });
});

// eslint-disable-next-line consistent-return

const addCollectionVariety = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const { files } = req;
  const {
    varietyName, description, grip, mate, thickness,
  } = req.body;

  // Check for required fields
  if (
    !varietyName
    || !description
    || !grip
    || !mate
    || !thickness
    || !files.find((item) => item.fieldname === 'varietyCardImage')
    || !files.find((item) => item.fieldname === 'fullSlabImage')
    || !files.find((item) => item.fieldname === 'closeLookUp')
    || !files.find((item) => item.fieldname === 'instalLook')
  ) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  // Validate if the variety name already exists
  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return res.status(404).json({ message: 'Collection not found' });
  }

  const varietyExists = collection.variety.some(
    (variety) => variety.varietyName.toLowerCase() === varietyName.toLowerCase(),
  );
  if (varietyExists) {
    return next(new ErrorHandler('Variety already exists', 400));
  }

  // Validate file types
  const varietyCardImage = files.find((item) => item.fieldname === 'varietyCardImage');
  const fullSlabImage = files.find((item) => item.fieldname === 'fullSlabImage');
  const closeLookUp = files.find((item) => item.fieldname === 'closeLookUp');
  const instalLook = files.find((item) => item.fieldname === 'instalLook');

  if (
    !isImage(varietyCardImage)
    || !isImage(fullSlabImage)
    || !isImage(closeLookUp)
    || !isImage(instalLook)
  ) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }

  // Upload images to the drive
  const varietyCardImageRef = await uploadImageToDrive(varietyCardImage);
  const fullSlabImageRef = await uploadImageToDrive(fullSlabImage);
  const closeLookUpRef = await uploadImageToDrive(closeLookUp);
  const instalLookRef = await uploadImageToDrive(instalLook);

  // Create slug for variety name
  const slugAuto = createSlug(varietyName);

  // Define variety details
  const varietyDetails = {
    varietyName,
    slug: slugAuto,
    varietyCardImage: varietyCardImageRef,
    fullSlabImage: fullSlabImageRef,
    closeLookUp: closeLookUpRef,
    instalLook: instalLookRef,
    description,
    grip,
    mate,
    thickness,
  };

  // Update collection with the new variety
  const updatedCollection = await collectionModel.findByIdAndUpdate(
    collectionId,
    { $push: { variety: varietyDetails } }, // Push new variety to the array
    { new: true, runValidators: true }, // Return updated document and run validators
  );

  if (!updatedCollection) {
    return next(new ErrorHandler('Failed to add variety', 500));
  }

  return res
    .status(200)
    .json({ data: updatedCollection, message: 'Variety Created Successfully', status: 'Success' });
});

const updateCollectionVariety = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { varietyId } = req.params;

  // Check if the variety exists
  const collection = await collectionModel.findOne({ 'variety._id': varietyId });

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }

  const varietyIndex = collection.variety.findIndex(
    (variety) => variety._id.toString() === varietyId,
  );
  if (varietyIndex === -1) {
    return next(new ErrorHandler('Variety not found', 404));
  }

  // Handle image uploads and updates
  const fullSlabImageFile = files.find((item) => item.fieldname === 'fullSlabImage');
  const varietyCardImageFile = files.find((item) => item.fieldname === 'varietyCardImage');
  const closeLookUpFile = files.find((item) => item.fieldname === 'closeLookUp');
  const instalLookFile = files.find((item) => item.fieldname === 'instalLook');

  const varietyImages = collection.variety[varietyIndex];

  const updatedVarietyImgs = {};

  if (fullSlabImageFile) {
    if (!isImage(fullSlabImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.fullSlabImage;
    updatedVarietyImgs.fullSlabImage = await updateImageOnDrive(fileId, fullSlabImageFile);
  }

  if (varietyCardImageFile) {
    if (!isImage(varietyCardImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.varietyCardImage;
    updatedVarietyImgs.varietyCardImage = await updateImageOnDrive(fileId, varietyCardImageFile);
  }

  if (closeLookUpFile) {
    if (!isImage(closeLookUpFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.closeLookUp;
    updatedVarietyImgs.closeLookUp = await updateImageOnDrive(fileId, closeLookUpFile);
  }

  if (instalLookFile) {
    if (!isImage(instalLookFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.instalLook;
    updatedVarietyImgs.instalLook = await updateImageOnDrive(fileId, instalLookFile);
  }

  // Handle text updates
  const {
    varietyName, description, grip, mate, thickness,
  } = req.body;
  // console.log('req body   .', varietyName, description, grip, mate, thickness);

  const updatedVarietyDetails = {};

  if (varietyName && varietyName.trim()) {
    updatedVarietyDetails.varietyName = varietyName;
    updatedVarietyDetails.slug = createSlug(varietyName);
    // const alugauto = createSlug(varietyName);
    // console.log(' alugauto', alugauto);
  }
  if (description && description.trim()) {
    updatedVarietyDetails.description = description;
  }
  if (grip && grip.trim()) {
    updatedVarietyDetails.grip = grip;
  }
  if (mate && mate.trim()) {
    updatedVarietyDetails.mate = mate;
  }
  if (thickness && thickness.trim()) {
    updatedVarietyDetails.thickness = thickness;
  }

  // Merge image updates with text updates
  const updates = {
    ...updatedVarietyDetails,
    ...updatedVarietyImgs,
  };

  const updateFields = Object.keys(updates).reduce((acc, key) => {
    acc[`variety.$.${key}`] = updates[key]; // Creating dynamic field paths
    return acc;
  }, {});

  // Perform the update using findOneAndUpdate to avoid validation issues
  const updatedCollection = await collectionModel.findOneAndUpdate(
    { 'variety._id': varietyId },
    { $set: updateFields }, // Apply only the changed fields

    // { $set: { 'variety.$': { ...collection.variety[varietyIndex].toObject(), ...updates } } },
    { new: true, runValidators: true }, // Return the updated document
  );

  if (!updatedCollection) {
    return next(new ErrorHandler('Failed to update variety', 500));
  }

  const updatedVariety = updatedCollection.variety.find(
    (variety) => variety._id.toString() === varietyId,
  );

  return res.status(200).json({ message: 'Variety Updated', status: 'Success', data: updatedVariety });
});

const deleteCollectionVariety = asyncHandler(async (req, res, next) => {
  const { varietyId } = req.params;

  // Find the collection containing the variety
  const collection = await collectionModel.findOne({
    'variety._id': varietyId,
  });

  if (!collection) {
    return next(new ErrorHandler('Collection variety not found', 404));
  }

  // Find the variety to be deleted
  const findVariety = collection.variety.find((item) => item.id === varietyId);
  if (!findVariety) {
    return next(new ErrorHandler('Variety not found', 404));
  }

  const {
    varietyCardImage, fullSlabImage, closeLookUp, instalLook,
  } = findVariety;

  // Delete associated images from storage
  if (varietyCardImage) await deleteImage(varietyCardImage);
  if (fullSlabImage) await deleteImage(fullSlabImage);
  if (closeLookUp) await deleteImage(closeLookUp);
  if (instalLook) await deleteImage(instalLook);

  // Remove the variety from the collection using $pull
  const updatedCollection = await collectionModel.findOneAndUpdate(
    { 'variety._id': varietyId },
    { $pull: { variety: { _id: varietyId } } }, // Pull the variety from the array
    { new: true }, // Return the updated collection
  );

  if (!updatedCollection) {
    return next(new ErrorHandler('Failed to delete variety', 500));
  }

  return res.status(200).json({ message: 'Variety Deleted Successfully', status: 'Success' });
});

const getCollectionVariety = asyncHandler(async (req, res, next) => {
  const { varietySlug } = req.params;
  console.log('params', req.params);

  const collection = await collectionModel.findOne({
    'variety.slug': varietySlug,
  });

  if (!collection) {
    return next(new ErrorHandler('Collection Not Found', 400));
  }

  // eslint-disable-next-line no-underscore-dangle
  const variety = collection.variety.find(
    (variety) => variety.slug === varietySlug,
  );

  if (!variety) {
    return next(new ErrorHandler('variety Not Found', 400));
  }

  return res.status(200).json({ data: variety });
});

module.exports = {
  addCollection,
  getCollection,
  newArrivals,
  updateCollection,
  deleteCollection,
  getCollections,
  addCollectionVariety,
  updateCollectionVariety,
  deleteCollectionVariety,
  getCollectionVariety,
};
