/* eslint-disable no-unused-vars */
const { kitchenModel, bathroomModel } = require('../../models');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage, updateImageOnDrive } = require('../uploadImageController');

// bathroom Apis
const addKitchen = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { name } = req.body;

  const cardImage = files.find((item) => item.fieldname === 'cardImage');

  if (!name || !cardImage) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  const verifyKitchen = await kitchenModel.findOne({ name });

  if (verifyKitchen) {
    return next(new ErrorHandler('Kitchen Already Exist', 400));
  }

  const cardImageId = await uploadImageToDrive(cardImage);

  const kitchen = await kitchenModel.create({
    name,
    cardImage: cardImageId,
  });

  if (!kitchen) {
    return next(new ErrorHandler('unable to create kitchen', 400));
  }
  return res.status(200).json({ message: 'Created successfully' });
});
const kitchens = asyncHandler(async (req, res, next) => {
  const findKitchens = await kitchenModel.find({});

  if (!findKitchens) {
    return next(new ErrorHandler('kitchens not found', 404));
  }
  return res.status(200).json({ data: findKitchens });
});
const kitchen = asyncHandler(async (req, res, next) => {
  const { kitchenId } = req.params;
  const kitchenData = await kitchenModel.findById(kitchenId);

  if (!kitchenData) {
    return next(new ErrorHandler('Kitchen not found', 404));
  }
  return res.status(200).json({ data: kitchenData });
});
const updateKitchen = asyncHandler(async (req, res, next) => {
  const { kitchenId } = req.params;
  const { files } = req;
  const { name } = req.body;

  const cardImageFile = files.find((item) => item.fieldname === 'cardImage');

  const verifyKitchenId = await kitchenModel.findById(kitchenId);
  if (!verifyKitchenId) {
    return next(new ErrorHandler('Kitchen Not FOund', 400));
  }

  const updateFields = {};
  if (name !== undefined) {
    updateFields.name = name;
  }
  if (cardImageFile !== undefined) {
    const fileId = verifyKitchenId.cardImage;
    const updatedImg = await updateImageOnDrive(fileId, cardImageFile);
    console.log(updatedImg);
    updateFields.cardImage = updatedImg;
  }

  const kitchenUpdated = await kitchenModel.findByIdAndUpdate(
    kitchenId,
    updateFields,
    { new: true },
  );

  if (!kitchenUpdated) {
    return next(new ErrorHandler('Unable To Update Kitchen', 500));
  }
  return res.status(200).json({ message: 'kitchen Update Sucessfully' });
});
const deleteKitchen = asyncHandler(async (req, res, next) => {
  const { kitchenId } = req.params;
  const findKitchen = await kitchenModel.findById(kitchenId);

  if (!findKitchen) {
    return next(new ErrorHandler('kitchen not found', 404));
  }

  const { cardImage } = findKitchen;
  await deleteImage(cardImage);

  await kitchenModel.findByIdAndDelete(kitchenId);
  return res.status(200).json({ message: ' Deleted Successfully' });
});
const addKitchenColors = asyncHandler(async (req, res, next) => {
  const { kitchenId } = req.params;
  const { files } = req;
  const {
    colorName,
  } = req.body;

  const colorCardImage = files.find((item) => item.fieldname === 'colorCardImage');
  const mainImage = files.find((item) => item.fieldname === 'mainImage');

  if (!colorName || !colorCardImage || !mainImage) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  const verifyKitchen = await kitchenModel.findById(kitchenId);
  if (!verifyKitchen) {
    return res.status(404).json({ message: 'kitchen not found' });
  }

  const colorCardImageRef = await uploadImageToDrive(colorCardImage);
  const mainImageRef = await uploadImageToDrive(mainImage);

  const bathroomColors = {
    colorName,
    colorCardImage: colorCardImageRef,
    mainImage: mainImageRef,
  };

  verifyKitchen.colors.push(bathroomColors);
  await verifyKitchen.save();
  return res.status(200).json(({ message: 'kitchen Colors Created Successfully ' }));
});
const kitchenColor = asyncHandler(async (req, res, next) => {
  const { kitchencolorId } = req.params;

  const kitchenColorData = await kitchenModel.findOne({ 'colors._id': kitchencolorId });

  if (!kitchenColorData) {
    return next(new ErrorHandler('Kitchen Not Found', 400));
  }

  // eslint-disable-next-line no-underscore-dangle, max-len
  const kitchenFind = kitchenColorData.colors.find((color) => color._id.toString() === kitchencolorId);

  if (!kitchenFind) {
    return next(new ErrorHandler('Kitchen Color Not Found', 400));
  }

  return res.status(200).json({ data: kitchenFind });
});
const updateKitchenColor = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const deleteKitchenColor = asyncHandler(async (req, res, next) => {
  const { kitchencolorId } = req.params;
  const findKitchen = await kitchenModel.findOne({ 'colors._id': kitchencolorId });

  if (!findKitchen) {
    return next(new ErrorHandler('kitchen Color Not Found', 400));
  }

  const findKitchenColor = findKitchen.colors.find((item) => item.id === kitchencolorId);
  const {
    colorCardImage,
    mainImage,
    _id,
  } = findKitchenColor;

  await deleteImage(colorCardImage);
  await deleteImage(mainImage);

  const kitchenColorDelete = findKitchen.colors.pull(_id);

  if (!kitchenColorDelete) {
    return next(new ErrorHandler('kitchen Color Not Found', 400));
  }

  await findKitchen.save();
  return res.status(200).json(({ message: 'kitchen Color Deleted Successfully' }));
});
// bathroom Apis
const addBathroom = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { name } = req.body;

  const cardImage = files.find((item) => item.fieldname === 'cardImage');

  if (!name || !cardImage) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  const verifyBathroom = await bathroomModel.findOne({ name });

  if (verifyBathroom) {
    return next(new ErrorHandler('Bathroom Already Exist', 400));
  }

  const cardImageId = await uploadImageToDrive(cardImage);

  const Bathroom = await bathroomModel.create({
    name,
    cardImage: cardImageId,
  });

  if (!Bathroom) {
    return next(new ErrorHandler('unable to create Bathroom', 400));
  }
  return res.status(200).json({ msg: 'Created successfully' });
});
const Bathrooms = asyncHandler(async (req, res, next) => {
  const findBathrooms = await bathroomModel.find({});

  if (!findBathrooms) {
    return next(new ErrorHandler('kitchens not found', 404));
  }
  return res.status(200).json({ data: findBathrooms });
});
const Bathroom = asyncHandler(async (req, res, next) => {
  const { bathroomId } = req.params;
  const bathroomData = await bathroomModel.findById(bathroomId);

  if (!bathroomData) {
    return next(new ErrorHandler('Bathroom not found', 404));
  }
  return res.status(200).json({ data: bathroomData });
});
const updateBathroom = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const deleteBathroom = asyncHandler(async (req, res, next) => {
  const { bathroomId } = req.params;
  const findbathroom = await bathroomModel.findById(bathroomId);

  if (!findbathroom) {
    return next(new ErrorHandler('Bathroom not found', 404));
  }

  const { cardImage } = findbathroom;
  await deleteImage(cardImage);

  await bathroomModel.findByIdAndDelete(bathroomId);
  return res.status(200).json({ message: ' Deleted Successfully' });
});
const addBathroomColors = asyncHandler(async (req, res, next) => {
  const { bathroomId } = req.params;
  const { files } = req;
  const {
    colorName,
  } = req.body;

  const colorCardImage = files.find((item) => item.fieldname === 'colorCardImage');
  const mainImage = files.find((item) => item.fieldname === 'mainImage');

  if (!colorName || !colorCardImage || !mainImage) {
    return next(new ErrorHandler('please fill All rewquired fields', 400));
  }

  const verifyBathroom = await bathroomModel.findById(bathroomId);
  if (!verifyBathroom) {
    return res.status(404).json({ message: 'Bathroom not found' });
  }

  const colorCardImageRef = await uploadImageToDrive(colorCardImage);
  const mainImageRef = await uploadImageToDrive(mainImage);

  const bathroomColors = {
    colorName,
    colorCardImage: colorCardImageRef,
    mainImage: mainImageRef,
  };

  verifyBathroom.colors.push(bathroomColors);
  await verifyBathroom.save();
  return res.status(200).json(({ message: 'Bathroom Colors Created Successfully ' }));
});
const bathroomColor = asyncHandler(async (req, res, next) => {
  const { bathroomcolorId } = req.params;

  const bathroomColorData = await bathroomModel.findOne({ 'colors._id': bathroomcolorId });

  if (!bathroomColorData) {
    return next(new ErrorHandler('Bathroom Not Found', 400));
  }

  // eslint-disable-next-line no-underscore-dangle, max-len
  const bathroomFind = bathroomColorData.colors.find((color) => color._id.toString() === bathroomcolorId);

  if (!bathroomFind) {
    return next(new ErrorHandler('Bathroom Color Not Found', 400));
  }

  return res.status(200).json({ data: bathroomFind });
});
const updatebathroomColor = asyncHandler(async (req, res, next) => res.status(200).send('working'));
const deletebathroomColor = asyncHandler(async (req, res, next) => {
  const { bathroomcolorId } = req.params;
  const findBathroom = await bathroomModel.findOne({ 'colors._id': bathroomcolorId });

  if (!findBathroom) {
    return next(new ErrorHandler('Bathroom Color Not Found', 400));
  }

  const findBathroomColor = findBathroom.colors.find((item) => item.id === bathroomcolorId);
  const {
    colorCardImage,
    mainImage,
    _id,
  } = findBathroomColor;

  await deleteImage(colorCardImage);
  await deleteImage(mainImage);

  const bathroomColorDelete = findBathroom.colors.pull(_id);

  if (!bathroomColorDelete) {
    return next(new ErrorHandler('Bathroom Color Not Found', 400));
  }

  await findBathroom.save();
  return res.status(200).json(({ message: 'Bathroom Color Deleted Successfully' }));
});

module.exports = {
  addKitchen,
  kitchens,
  kitchen,
  updateKitchen,
  deleteKitchen,
  addKitchenColors,
  kitchenColor,
  updateKitchenColor,
  deleteKitchenColor,
  addBathroom,
  Bathrooms,
  Bathroom,
  updateBathroom,
  deleteBathroom,
  addBathroomColors,
  bathroomColor,
  updatebathroomColor,
  deletebathroomColor,
};
