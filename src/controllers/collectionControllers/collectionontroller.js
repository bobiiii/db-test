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
  const { collectionName } = req.body;

  const collectionImage = files.find(
    (item) => item.fieldname === 'collectionImage',
  );
  // const dropDownImage = files.find(
  //   (item) => item.fieldname === 'dropDownImage',
  // );

  if (!collectionName || !collectionImage) {
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
  // const dropDownImageId = await uploadImageToDrive(dropDownImage);

  const slugAuto = createSlug(collectionName);

  const collection = await collectionModel.create({
    collectionName,
    slug: slugAuto,
    collectionImage: collectionImageId,
    // dropDownImage: dropDownImageId,
  });

  if (!collection) {
    return next(new ErrorHandler('unable to create collection', 400));
  }
  return res.status(200).json({ message: 'Created successfully', status: 'Success' });
});

const getCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const collection = await collectionModel.findById(collectionId);

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }
  return res.status(200).json({ data: collection });
});

const newArrivals = asyncHandler(async (req, res, next) => {
  const collections = await collectionModel.aggregate([
    { $unwind: '$variety' }, // Flatten variety arrays
    { $sort: { 'variety.createdAt': -1 } }, // Sort by variety creation date
    { $limit: 15 }, // Limit to 15 varieties
    {
      $project: {
        _id: 0,
        variety: 1,
      },
    }, // Return only variety documents
  ]);

  if (!collections || collections.length === 0) {
    return next(new ErrorHandler('Collections not found', 404));
  }

  return res.status(200).json({ data: collections });
});

const updateCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const { files } = req;
  const { collectionName } = req.body;

  const collectionImageFile = files.find(
    (item) => item.fieldname === 'collectionImage',
  );
  // const dropDownImageFile = files.find(
  //   (item) => item.fieldname === 'dropDownImage',
  // );

  const verifyCollectionId = await collectionModel.findById(collectionId);
  if (!verifyCollectionId) {
    return next(new ErrorHandler('Collection Not FOund', 400));
  }

  const updateFields = {};
  if (collectionName !== undefined) {
    updateFields.collectionName = collectionName;
    updateFields.slug = createSlug(collectionName);
  }
  if (collectionImageFile !== undefined) {
    if (!isImage(collectionImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = verifyCollectionId.collectionImage;
    const updatedImg = await updateImageOnDrive(fileId, collectionImageFile);
    updateFields.collectionImage = updatedImg;
  }
  // if (dropDownImageFile !== undefined) {
  //   if (!isImage(dropDownImageFile)) {
  //     return next(new ErrorHandler('Only images are allowed', 400));
  //   }
  //   const fileId = verifyCollectionId.dropDownImage;
  //   const updatedImg = await updateImageOnDrive(fileId, dropDownImageFile);
  //   updateFields.dropDownImage = updatedImg;
  // }

  const collection = await collectionModel.findByIdAndUpdate(
    collectionId,
    updateFields,
    { new: true },
  );

  if (!collection) {
    return next(new ErrorHandler('Unable To Update Collection', 500));
  }
  return res.status(200).json({ msg: 'collection Update Sucessfully' });
});

const deleteCollection = asyncHandler(async (req, res, next) => {
  const { collectionId } = req.params;
  const collection = await collectionModel.findById(collectionId);

  if (!collection) {
    return next(new ErrorHandler('Collection not found', 404));
  }

  const { collectionImage } = collection;
  await deleteImage(collectionImage);
  // await deleteImage(dropDownImage);

  await collectionModel.findByIdAndDelete(collectionId);
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
  const {
    varietyName, description, grip, mate, thickness,
  } = req.body;

  const varietyCardImage = files.find(
    (item) => item.fieldname === 'varietyCardImage',
  );
  const fullSlabImage = files.find(
    (item) => item.fieldname === 'fullSlabImage',
  );
  const closeLookUp = files.find((item) => item.fieldname === 'closeLookUp');
  const instalLook = files.find((item) => item.fieldname === 'instalLook');

  if (
    !varietyCardImage
    || !fullSlabImage
    || !closeLookUp
    || !instalLook
    || !varietyName
    || !description
    || !grip
    || !mate
    || !thickness
  ) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  const verifyVariety = await collectionModel.findOne({ varietyName });

  if (verifyVariety) {
    return next(new ErrorHandler('Variety Already Exist', 400));
  }

  if (
    !isImage(varietyCardImage)
    || !isImage(fullSlabImage)
    || !isImage(closeLookUp)
    || !isImage(instalLook)
  ) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }
  const collection = await collectionModel.findById(collectionId);
  if (!collection) {
    return res.status(404).json({ message: 'Collection not found' });
  }

  const varietyCardImageRef = await uploadImageToDrive(varietyCardImage);
  const fullSlabImageRef = await uploadImageToDrive(fullSlabImage);
  const closeLookUpRef = await uploadImageToDrive(closeLookUp);
  const instalLookRef = await uploadImageToDrive(instalLook);

  const slugAuto = createSlug(varietyName);

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

  collection.variety.push(varietyDetails);
  const variety = await collection.save();
  return res.status(200).json({ message: 'Variety Created Successfully ' });
});

const updateCollectionVariety = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { varietyId } = req.params;

  const collection = await collectionModel.findOne({
    'variety._id': varietyId,
  });
  if (!collection) {
    return next(new ErrorHandler('Collections not found', 404));
  }

  const varietyIndex = collection.variety.findIndex(
    (variety) => variety._id.toString() === varietyId,
  );
  if (varietyIndex === -1) {
    return next(new ErrorHandler('Variety not found', 404));
  }

  const fullSlabImageFile = files.find(
    (item) => item.fieldname === 'fullSlabImage',
  );
  const varietyCardImageFile = files.find(
    (item) => item.fieldname === 'varietyCardImage',
  );
  const closeLookUpFile = files.find(
    (item) => item.fieldname === 'closeLookUp',
  );
  const instalLookFile = files.find((item) => item.fieldname === 'instalLook');

  let fullSlabImage;
  let varietyCardImage;
  let closeLookUp;
  let instalLook;

  const varietyImages = collection.variety[varietyIndex];

  if (fullSlabImageFile !== undefined) {
    if (!isImage(fullSlabImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.fullSlabImage;
    const newFullSlab = await updateImageOnDrive(fileId, fullSlabImageFile);
    fullSlabImage = newFullSlab;
  } else {
    fullSlabImage = varietyImages.fullSlabImage;
  }

  if (varietyCardImageFile !== undefined) {
    if (!isImage(varietyCardImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.varietyCardImage;
    const newVarietyCard = await updateImageOnDrive(
      fileId,
      varietyCardImageFile,
    );
    varietyCardImage = newVarietyCard;
  } else {
    varietyCardImage = varietyImages.varietyCardImage;
  }

  if (closeLookUpFile !== undefined) {
    if (!isImage(closeLookUpFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.closeLookUp;
    const newCloseLookUp = await updateImageOnDrive(fileId, closeLookUpFile);
    closeLookUp = newCloseLookUp;
  } else {
    closeLookUp = varietyImages.closeLookUp;
  }

  if (instalLookFile !== undefined) {
    if (!isImage(instalLookFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = varietyImages.instalLook;
    const newInstalLook = await updateImageOnDrive(fileId, instalLookFile);
    instalLook = newInstalLook;
  } else {
    instalLook = varietyImages.instalLook;
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

  if (varietyName.trim() !== '') {
    updatedVarietyDetails.varietyName = varietyName;
    updatedVarietyDetails.slug = createSlug(varietyName);
  }
  if (description.trim() !== '') {
    updatedVarietyDetails.description = description;
  }
  if (grip.trim() !== '') {
    updatedVarietyDetails.grip = grip;
  }
  if (mate.trim() !== '') {
    updatedVarietyDetails.mate = mate;
  }
  if (thickness.trim() !== '') {
    updatedVarietyDetails.thickness = thickness;
  }

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

  delete updatedVarietyDetails._id;

  collection.variety[varietyIndex] = {
    ...collection.variety[varietyIndex].toObject(),
    ...updatedVarietyDetails,
  };

  await collection.save();

  return res.status(200).json({ message: 'Variety Updated' });
});

const deleteCollectionVariety = asyncHandler(async (req, res, next) => {
  const { varietyId } = req.params;
  const collection = await collectionModel.findOne({
    'variety._id': varietyId,
  });

  if (!collection) {
    return next(new ErrorHandler('Collection variety Not Found', 400));
  }

  const findVariety = collection.variety.find((item) => item.id === varietyId);
  const {
    varietyCardImage, fullSlabImage, closeLookUp, instalLook, _id,
  } = findVariety;

  await deleteImage(varietyCardImage);
  await deleteImage(fullSlabImage);
  await deleteImage(closeLookUp);
  await deleteImage(instalLook);

  const varietyDelete = collection.variety.pull(_id);

  if (!varietyDelete) {
    return next(new ErrorHandler('variety Not Found', 400));
  }

  await collection.save();

  return res.status(200).json({ message: 'Variety Deleted Successfully' });
});

const getCollectionVariety = asyncHandler(async (req, res, next) => {
  const { varietyId } = req.params;

  const collection = await collectionModel.findOne({
    'variety._id': varietyId,
  });

  if (!collection) {
    return next(new ErrorHandler('Collection Not Found', 400));
  }

  // eslint-disable-next-line no-underscore-dangle
  const variety = collection.variety.find(
    (variety) => variety._id.toString() === varietyId,
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
