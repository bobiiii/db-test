/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { collectionModel } = require('../../models');
const { uploadImageToDrive, updateImageOnDrive } = require('../uploadImageController');

const addCollection = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { collectionName } = req.body;

  const collectionImage = files.find((item) => item.fieldname === 'collectionImage');
  const dropDownImage = files.find((item) => item.fieldname === 'dropDownImage');

  const collectionImageId = await uploadImageToDrive(collectionImage);
  const dropDownImageId = await uploadImageToDrive(dropDownImage);

  const collection = await collectionModel.create({
    collectionName,
    collectionImage: collectionImageId,
    dropDownImage: dropDownImageId,
  });

  if (!collection) {
    return next(new ErrorHandler('unable to create collection', 400));
  }
  return res.status(200).json({ message: 'Created successfully' });
});

const getCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const collection = await collectionModel.findById(collectionId);

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }
  return res.status(200).json({ data: collection });
});

const updateCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const { files } = req;
  const { collectionName } = req.body;

  const collectionImageFile = files.find((item) => item.fieldname === 'collectionImage');
  const dropDownImageFile = files.find((item) => item.fieldname === 'dropDownImage');

  const verifyCollectionId = await collectionModel.findById(collectionId);
  if (!verifyCollectionId) {
    return next(new ErrorHandler('Collection Not FOund', 400));
  }

  const updateFields = {};
  if (collectionName !== undefined) {
    updateFields.collectionName = collectionName;
  }
  if (collectionImageFile !== undefined) {
    const fileId = verifyCollectionId.collectionImage;
    const updatedImg = await updateImageOnDrive(fileId, collectionImageFile);
    updateFields.collectionImage = updatedImg;
  }
  if (dropDownImageFile !== undefined) {
    const fileId = verifyCollectionId.dropDownImage;
    const updatedImg = await updateImageOnDrive(fileId, dropDownImageFile);
    updateFields.dropDownImage = updatedImg;
  }
  console.log(updateFields);

  const collection = await collectionModel.findByIdAndUpdate(collectionId, updateFields, { new: true });

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }
  return res.status(200).json({ msg: 'collection Update Sucessfully' });
});

const deleteCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const collection = await collectionModel.findByIdAndDelete(collectionId);

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }
  return res.status(200).json({ message: ' Deleted Successfully' });
});

const getCollections = asyncHandler(async (req, res, next) => {
  const collections = await collectionModel.find({});

  if (!collections) {
    return next(new ErrorHandler('Collections not found', 404));
  }
  return res.status(200).json({ data: collections });
});

// eslint-disable-next-line consistent-return

const addCollectionVariety = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const { files } = req;
  console.log(files);
  console.log(req.body);
  const {
    varietyName, description, grip, mate, thickness,
  } = req.body;

  if (!varietyName || !description || !grip || !mate || !thickness) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }
  if (files.length === 0) {
    return next(new ErrorHandler('where is images bro', 400));
  }

  const varietyCardImage = files.find((item) => item.fieldname === 'varietyCardImage');
  const fullSlabImage = files.find((item) => item.fieldname === 'fullSlabImage');
  const closeLookUp = files.find((item) => item.fieldname === 'closeLookUp');
  const instalLook = files.find((item) => item.fieldname === 'instalLook');

  if (!varietyCardImage || !fullSlabImage || !closeLookUp || !instalLook) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return res.status(404).json({ message: 'Collection not found' });
  }

  const varietyCardImageRef = await uploadImageToDrive(varietyCardImage);
  const fullSlabImageRef = await uploadImageToDrive(fullSlabImage);
  const closeLookUpRef = await uploadImageToDrive(closeLookUp);
  const instalLookRef = await uploadImageToDrive(instalLook);

  const varietyDetails = {
    varietyName,
    varietyCardImage: varietyCardImageRef,
    fullSlabImage: fullSlabImageRef,
    closeLookUp: closeLookUpRef,
    instalLook: instalLookRef,
    description,
    grip,
    mate,
    thickness,
  };

  collection.variety.push(varietyDetails);
  const variety = await collection.save();
  return res.status(200).json(({ message: 'Variety Created Successfully ' }));
});

const updateCollectionVariety = asyncHandler(async (req, res, next) => {
  const { files } = req;

  const { varietyId } = req.params;
  const collection = await collectionModel.findOne({ 'variety._id': varietyId });
  if (!collection) {
    return next(new ErrorHandler('Collections not found', 404));
  }

  // eslint-disable-next-line no-underscore-dangle
  const varietyIndex = collection.variety.findIndex((variety) => variety._id.toString() === varietyId);
  if (varietyIndex === -1) {
    return next(new ErrorHandler('Variety not found', 404));
  }
  const fullSlabImageFile = files.find((item) => item.fieldname === 'fullSlabImage');
  const varietyCardImageFile = files.find((item) => item.fieldname === 'varietyCardImage');
  const closeLookUpFile = files.find((item) => item.fieldname === 'closeLookUp');
  const instalLookFile = files.find((item) => item.fieldname === 'instalLook');

  let fullSlabImage;
  let varietyCardImage;
  let closeLookUp;
  let instalLook;

  const varietyImages = collection.variety.find((variety) => variety);

  if (fullSlabImageFile !== undefined) {
    const fileId = varietyImages.fullSlabImage;
    const newFullSlab = await updateImageOnDrive(fileId, fullSlabImageFile);
    fullSlabImage = newFullSlab;
  }

  if (varietyCardImageFile !== undefined) {
    const fileId = varietyImages.varietyCardImage;
    const newVarietyCard = await updateImageOnDrive(fileId, varietyCardImageFile);
    varietyCardImage = newVarietyCard;
  }

  if (closeLookUpFile !== undefined) {
    const fileId = varietyImages.closeLookUp;
    const newCloseLookUp = await updateImageOnDrive(fileId, closeLookUpFile);
    closeLookUp = newCloseLookUp;
  }

  if (instalLookFile !== undefined) {
    const fileId = varietyImages.instalLook;
    const newInstalLook = await updateImageOnDrive(fileId, instalLookFile);
    instalLook = newInstalLook;
  }

  const updatedVarietyImgs = {
    varietyCardImage,
    fullSlabImage,
    closeLookUp,
    instalLook,
  };

  const {
    varietyName, description, grip, mate, thickness,
  } = req.body;
  const updatedVarietyDetails = {};

  if (updatedVarietyImgs.varietyCardImage !== undefined) {
    updatedVarietyDetails.varietyCardImage = varietyCardImage;
  }
  if (updatedVarietyImgs.fullSlabImage !== undefined) {
    updatedVarietyDetails.fullSlabImage = fullSlabImage;
  }
  if (updatedVarietyImgs.closeLookUp !== undefined) {
    updatedVarietyDetails.closeLookUp = closeLookUp;
  }
  if (updatedVarietyImgs.instalLook !== undefined) {
    updatedVarietyDetails.instalLook = instalLook;
  }
  if (varietyName !== undefined) {
    updatedVarietyDetails.varietyName = varietyName;
  }
  if (description !== undefined) {
    updatedVarietyDetails.description = description;
  }
  if (grip !== undefined) {
    updatedVarietyDetails.grip = grip;
  }
  if (mate !== undefined) {
    updatedVarietyDetails.mate = mate;
  }
  if (thickness !== undefined) {
    updatedVarietyDetails.thickness = thickness;
  }
  console.log(updatedVarietyDetails);

  // eslint-disable-next-line no-underscore-dangle
  collection.variety[varietyIndex] = { ...collection.variety[varietyIndex], _id: collection.variety[varietyIndex]._id, ...updatedVarietyDetails };
  await collection.save();
  return res.status(200).json(collection);
  // return res.status(200).json({ data: updatedVariety });
});

const deleteCollectionVariety = asyncHandler(async (req, res, next) => {
  const { varietyId } = req.params;
  const collection = await collectionModel.findOne({ 'variety._id': varietyId });
  console.log(collection);
  if (!collection) {
    return next(new ErrorHandler('Collection Not Found', 400));
  }

  const variety = collection.variety.pull(varietyId);
  await collection.save();

  if (!variety) {
    return next(new ErrorHandler('variety Not Found', 400));
  }

  return res.status(200).json(({ message: 'Variety Deleted Successfully' }));
});

const getCollectionVariety = asyncHandler(async (req, res, next) => {
  const { varietyId } = req.params;

  const collection = await collectionModel.findOne({ 'variety._id': varietyId });

  if (!collection) {
    return next(new ErrorHandler('Collection Not Found', 400));
  }

  // eslint-disable-next-line no-underscore-dangle
  const variety = collection.variety.find((variety) => variety._id.toString() === varietyId);

  if (!variety) {
    return next(new ErrorHandler('variety Not Found', 400));
  }

  return res.status(200).json({ data: variety });
});

module.exports = {
  addCollection,
  getCollection,
  updateCollection,
  deleteCollection,
  getCollections,
  addCollectionVariety,
  updateCollectionVariety,
  deleteCollectionVariety,
  getCollectionVariety,
};
