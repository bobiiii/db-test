/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { collectionModel } = require('../../models');
const { uploadImageToDrive } = require('../uploadImageController');

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
  const { collectionName, collectionImage, dropDownImage } = req.body;

  if (collectionName === '' || collectionImage === '' || dropDownImage === '') {
    return next(new ErrorHandler('Fields cannot be empty', 400));
  }
  const updateFields = {};
  if (collectionName) updateFields.collectionName = collectionName;
  if (collectionImage) updateFields.collectionImage = collectionImage;
  if (dropDownImage) updateFields.dropDownImage = dropDownImage;

  const collection = await collectionModel.findByIdAndUpdate(collectionId, updateFields, { new: true });

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }
  return res.status(200).json({ data: collection });
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
  return res.status(200).json(({message:"Variety Created Successfully "}));
});


const updateCollectionVariety = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const { varietyId } = req.params;

  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return res.status(404).json({ message: 'Collection not found' });
  }

  const varietyIndex = collection.variety.findIndex((variety) => variety.id === varietyId);
  if (varietyIndex === -1) {
    return res.status(404).json({ message: 'Variety not found' });
  }

  const updatedVarietyDetails = req.body;
  // eslint-disable-next-line no-underscore-dangle
  collection.variety[varietyIndex] = { ...collection.variety[varietyIndex], _id: collection.variety[varietyIndex]._id, ...updatedVarietyDetails };
  await collection.save();
  return res.status(200).json({message:"Variety Updated Successfully"});
  // return res.status(200).json({ data: updatedVariety });
});

module.exports = {
  addCollection,
  getCollection,
  updateCollection,
  deleteCollection,
  getCollections,
  addCollectionVariety,
  updateCollectionVariety,
};
