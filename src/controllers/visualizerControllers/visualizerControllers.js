/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const { AmbientModel, bathroomModel } = require('../../models');
const { asyncHandler } = require('../../utils/asyncHandler');
const { createSlug } = require('../../utils/createSlug');
const { ErrorHandler } = require('../../utils/errorHandler');
const {
  uploadImageToDrive, deleteImage, updateImageOnDrive, isImage,
} = require('../uploadImageController');

const addAmbient = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const { name, category } = req.body;
  console.log('api working');

  const cardImage = files.find((item) => item.fieldname === 'cardImage');

  if (!name || !category || !cardImage) {
    return next(new ErrorHandler('Please fill all rewquired fields', 400));
  }
  if (!isImage(cardImage)) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }

  const slugauto = createSlug(name);
  const verifyAmbient = await AmbientModel.findOne({ slug: slugauto });

  if (verifyAmbient) {
    return next(new ErrorHandler('Ambient Already Exist by URL', 400));
  }

  const cardImageId = await uploadImageToDrive(cardImage);
  const ambient = await AmbientModel.create({
    name,
    slug: slugauto,
    category,
    cardImage: cardImageId,
  });

  if (!ambient) {
    return next(new ErrorHandler('Unable to create ambient', 400));
  }
  return res.status(200).json({ message: 'Created successfully', status: 'Success' });
});

const getAllAmbients = asyncHandler(async (req, res, next) => {

  const findAmbients = await AmbientModel.find({});

  if (!findAmbients) {
    return next(new ErrorHandler('AMbients not found', 404));
  }
  return res.status(200).json({ data: findAmbients, status: 'Success' });
});


const getAmbients = asyncHandler(async (req, res, next) => {
  const { category } = req.query;

  if (!category) {
    return next(new ErrorHandler('Category as query is required', 404));
  }

  const findAmbients = await AmbientModel.find({ category });

  if (!findAmbients) {
    return next(new ErrorHandler('AMbients not found', 404));
  }
  return res.status(200).json({ data: findAmbients, status: 'Success' });
});
const getAmbient = asyncHandler(async (req, res, next) => {
  const { ambientId } = req.params;
  const ambientData = await AmbientModel.findById(ambientId);

  if (!ambientData) {
    return next(new ErrorHandler('Kitchen not found', 404));
  }
  return res.status(200).json({ data: ambientData, status: 'Success' });
});

const getSingleAmbient = asyncHandler(async (req, res, next) => {
  const { ambient } = req.query;
  const ambientnData = await AmbientModel.find({ slug: ambient });

  if (!ambientnData) {
    return next(new ErrorHandler('Kitchen not found', 404));
  }
  return res.status(200).json({ data: ambientnData, status: 'Success' });
});

const updateAmbient = asyncHandler(async (req, res, next) => {
  const { ambientId } = req.params;
  const { files } = req;
  const { name, category } = req.body;

  const cardImageFile = files.find((item) => item.fieldname === 'cardImage');

  const verifyAmbient = await AmbientModel.findById(ambientId);
  if (!verifyAmbient) {
    return next(new ErrorHandler('Ambient Not FOund', 400));
  }

  const updateFields = {};
  if (name !== undefined) {
    updateFields.name = name;
    updateFields.slug = createSlug(name);
  }
  if (category !== undefined) {
    updateFields.category = category;
  }

  if (cardImageFile !== undefined) {
    if (!isImage(cardImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = verifyAmbient.cardImage;
    const updatedImg = await updateImageOnDrive(fileId, cardImageFile);
    updateFields.cardImage = updatedImg;
  }

  const ambientUpdated = await AmbientModel.findByIdAndUpdate(
    ambientId,
    updateFields,
    { new: true },
  );

  if (!ambientUpdated) {
    return next(new ErrorHandler('Unable To Update Kitchen', 500));
  }
  return res.status(200).json({ message: 'Ambient Updated Sucessfully', status: 'Success', data: ambientUpdated });
});
const deleteAmbient = asyncHandler(async (req, res, next) => {
  const { ambientId } = req.params;
  const findAmbient = await AmbientModel.findById(ambientId);

  if (!findAmbient) {
    return next(new ErrorHandler('kitchen not found', 404));
  }

  const { cardImage } = findAmbient;
  await deleteImage(cardImage);

  const deleteAmbientDb = await AmbientModel.findByIdAndDelete(ambientId);

  if (!deleteAmbientDb) {
    return next(new ErrorHandler('Unable to delete ambient', 500));
  }
  return res.status(200).json({ message: ' Deleted Successfully', status: 'Success' });
});
const addAmbientColors = asyncHandler(async (req, res, next) => {
  const { ambientId } = req.params;
  const { files } = req;
  const {
    colorName, collectionName,
  } = req.body;

  const colorCardImage = files.find((item) => item.fieldname === 'colorCardImage');
  const mainImage = files.find((item) => item.fieldname === 'mainImage');

  if (!colorName || !collectionName || !colorCardImage || !mainImage) {
    return next(new ErrorHandler('Please fill all rewquired fields', 400));
  }

  if (!isImage(colorCardImage) || !isImage(mainImage)) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }

  const verifyAmbient = await AmbientModel.findById(ambientId);
  if (!verifyAmbient) {
    return res.status(404).json({ message: 'Ambient not found' });
  }

  const colorCardImageRef = await uploadImageToDrive(colorCardImage);
  const mainImageRef = await uploadImageToDrive(mainImage);

  const slugAuto = createSlug(colorName);

  const ambientColors = {
    colorName,
    slug: slugAuto,
    collectionName,
    colorCardImage: colorCardImageRef,
    mainImage: mainImageRef,
  };

  verifyAmbient.colors.push(ambientColors);
  const ambient = await verifyAmbient.save();
  return res.status(200).json(({ message: 'Ambient Colors Created Successfully ', status: 'Success', data: ambient }));
});
const getAmbientColor = asyncHandler(async (req, res, next) => {
  const { ambientcolorId } = req.params;

  const ambientColorData = await AmbientModel.findOne({ 'colors._id': ambientcolorId });

  if (!ambientColorData) {
    return next(new ErrorHandler('Kitchen Not Found', 400));
  }

  // eslint-disable-next-line no-underscore-dangle, max-len
  const ambientFind = ambientColorData.colors.find((color) => color._id.toString() === ambientcolorId);

  if (!ambientFind) {
    return next(new ErrorHandler('Kitchen Color Not Found', 400));
  }

  return res.status(200).json({ data: ambientFind, status: 'Success' });
});
const updateAmbientColor = asyncHandler(async (req, res, next) => {
  const { ambientcolorId } = req.params;
  const { files } = req;

  const findAmbientColor = await AmbientModel.findOne({ 'colors._id': ambientcolorId });

  if (!findAmbientColor) {
    return next(new ErrorHandler('AMbient not found', 404));
  }

  const ambientColorIndex = findAmbientColor.colors.findIndex((item) => item._id.toString() === ambientcolorId);

  if (ambientColorIndex === -1) {
    return next(new ErrorHandler('Ambient Color not found', 404));
  }

  const colorCardImageFile = files.find((item) => item.fieldname === 'colorCardImage');
  const mainImageFile = files.find((item) => item.fieldname === 'mainImage');

  let colorCardImage;
  let mainImage;

  const colors = findAmbientColor.colors[ambientColorIndex];

  if (colorCardImageFile !== undefined) {
    if (!isImage(colorCardImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = colors.colorCardImage;
    const newColorCardImage = await updateImageOnDrive(fileId, colorCardImageFile);
    colorCardImage = newColorCardImage;
  } else {
    colorCardImage = colors.colorCardImage;
  }

  if (mainImageFile !== undefined) {
    if (!isImage(mainImageFile)) {
      return next(new ErrorHandler('Only images are allowed', 400));
    }
    const fileId = colors.mainImage;
    const newMainImage = await updateImageOnDrive(fileId, mainImageFile);
    mainImage = newMainImage;
  } else {
    mainImage = colors.mainImage;
  }

  let slugAuto;
  if (req.body.colorName) {
    slugAuto = createSlug(req.body.colorName);
  }
  const updatedColorDetails = {
    colorName: req.body.colorName,
    slug: slugAuto,
  };

  const updatedColor = {
    ...colors.toObject(),
    ...updatedColorDetails,
    colorCardImage,
    mainImage,
  };

  findAmbientColor.colors[ambientColorIndex] = updatedColor;

  const updatedAmbient = await findAmbientColor.save();

  return res.status(200).json({ message: 'AMbient Colors Updated', status: 'Success', data: updatedAmbient });
});

const deleteAmbientColor = asyncHandler(async (req, res, next) => {
  const { ambientcolorId } = req.params;
  const findAmbient = await AmbientModel.findOne({ 'colors._id': ambientcolorId });

  if (!findAmbient) {
    return next(new ErrorHandler('kitchen Color Not Found', 400));
  }

  const findAmbientColor = findAmbient.colors.find((item) => item.id === ambientcolorId);
  const {
    colorCardImage,
    mainImage,
    _id,
  } = findAmbientColor;

  await deleteImage(colorCardImage);
  await deleteImage(mainImage);

  const ambientColorDelete = findAmbient.colors.pull(_id);

  if (!ambientColorDelete) {
    return next(new ErrorHandler('kitchen Color Not Found', 400));
  }

  const deletedAmbient = await findAmbient.save();
  return res.status(200).json(({ message: 'Ambient Color Deleted Successfully', status: 'Success', data: deletedAmbient }));
});
// bathroom Apis
// const addBathroom = asyncHandler(async (req, res, next) => {
//   const { files } = req;
//   const { name } = req.body;

//   const cardImage = files.find((item) => item.fieldname === 'cardImage');

//   if (!name || !cardImage) {
//     return next(new ErrorHandler('please fill All rewquired fields', 400));
//   }

//   if (!isImage(cardImage)) {
//     return next(new ErrorHandler('Only images are allowed', 400));
//   }
//   const verifyBathroom = await bathroomModel.findOne({ name });

//   if (verifyBathroom) {
//     return next(new ErrorHandler('Bathroom Already Exist', 400));
//   }

//   const cardImageId = await uploadImageToDrive(cardImage);
//   const slugAuto = createSlug(name);
//   const Bathroom = await bathroomModel.create({
//     name,
//     slug: slugAuto,
//     cardImage: cardImageId,
//   });

//   if (!Bathroom) {
//     return next(new ErrorHandler('unable to create Bathroom', 400));
//   }
//   return res.status(200).json({ msg: 'Created successfully' });
// });
// const Bathrooms = asyncHandler(async (req, res, next) => {
//   const findBathrooms = await bathroomModel.find({});

//   if (!findBathrooms) {
//     return next(new ErrorHandler('kitchens not found', 404));
//   }
//   return res.status(200).json({ data: findBathrooms });
// });
// const Bathroom = asyncHandler(async (req, res, next) => {
//   const { bathroomId } = req.params;
//   const bathroomData = await bathroomModel.findById(bathroomId);

//   if (!bathroomData) {
//     return next(new ErrorHandler('Bathroom not found', 404));
//   }
//   return res.status(200).json({ data: bathroomData });
// });
// const updateBathroom = asyncHandler(async (req, res, next) => {
//   const { bathroomId } = req.params;
//   const { files } = req;
//   const { name } = req.body;

//   const cardImageFile = files.find((item) => item.fieldname === 'cardImage');

//   const verifyBathroomId = await bathroomModel.findById(bathroomId);
//   if (!verifyBathroomId) {
//     return next(new ErrorHandler('Bathroom Not FOund', 400));
//   }

//   const updateFields = {};
//   if (name !== undefined) {
//     updateFields.name = name;
//     updateFields.slug = createSlug(name);
//   }
//   if (cardImageFile !== undefined) {
//     if (!isImage(cardImageFile)) {
//       return next(new ErrorHandler('Only images are allowed', 400));
//     }
//     const fileId = verifyBathroomId.cardImage;
//     const updatedImg = await updateImageOnDrive(fileId, cardImageFile);
//     updateFields.cardImage = updatedImg;
//   }

//   const bathroomUpdated = await bathroomModel.findByIdAndUpdate(
//     bathroomId,
//     updateFields,
//     { new: true },
//   );

//   if (!bathroomUpdated) {
//     return next(new ErrorHandler('Unable To Update bathroom', 500));
//   }
//   return res.status(200).json({ message: 'bathroom Update Sucessfully' });
// });
// const deleteBathroom = asyncHandler(async (req, res, next) => {
//   const { bathroomId } = req.params;
//   const findbathroom = await bathroomModel.findById(bathroomId);

//   if (!findbathroom) {
//     return next(new ErrorHandler('Bathroom not found', 404));
//   }

//   const { cardImage } = findbathroom;
//   await deleteImage(cardImage);

//   await bathroomModel.findByIdAndDelete(bathroomId);
//   return res.status(200).json({ message: ' Deleted Successfully' });
// });
// const addBathroomColors = asyncHandler(async (req, res, next) => {
//   const { bathroomId } = req.params;
//   const { files } = req;
//   const {
//     colorName,
//   } = req.body;

//   const colorCardImage = files.find((item) => item.fieldname === 'colorCardImage');
//   const mainImage = files.find((item) => item.fieldname === 'mainImage');

//   if (!colorName || !colorCardImage || !mainImage) {
//     return next(new ErrorHandler('please fill All rewquired fields', 400));
//   }

//   if (!isImage(colorCardImage) || !isImage(mainImage)) {
//     return next(new ErrorHandler('Only images are allowed', 400));
//   }
//   const verifyBathroom = await bathroomModel.findById(bathroomId);
//   if (!verifyBathroom) {
//     return res.status(404).json({ message: 'Bathroom not found' });
//   }

//   const colorCardImageRef = await uploadImageToDrive(colorCardImage);
//   const mainImageRef = await uploadImageToDrive(mainImage);

//   const slugAuto = createSlug(colorName);
//   const bathroomColors = {
//     colorName,
//     slug: slugAuto,
//     colorCardImage: colorCardImageRef,
//     mainImage: mainImageRef,
//   };

//   verifyBathroom.colors.push(bathroomColors);
//   await verifyBathroom.save();
//   return res.status(200).json(({ message: 'Bathroom Colors Created Successfully ' }));
// });
// const bathroomColor = asyncHandler(async (req, res, next) => {
//   const { bathroomcolorId } = req.params;

//   const bathroomColorData = await bathroomModel.findOne({ 'colors._id': bathroomcolorId });

//   if (!bathroomColorData) {
//     return next(new ErrorHandler('Bathroom Not Found', 400));
//   }

//   // eslint-disable-next-line no-underscore-dangle, max-len
//   const bathroomFind = bathroomColorData.colors.find((color) => color._id.toString() === bathroomcolorId);

//   if (!bathroomFind) {
//     return next(new ErrorHandler('Bathroom Color Not Found', 400));
//   }

//   return res.status(200).json({ data: bathroomFind });
// });
// const updatebathroomColor = asyncHandler(async (req, res, next) => {
//   const { bathroomcolorId } = req.params;
//   const { files } = req;

//   const findbathroomColor = await bathroomModel.findOne({ 'colors._id': bathroomcolorId });

//   if (!findbathroomColor) {
//     return next(new ErrorHandler('bathroom not found', 404));
//   }

//   const bathroomColorIndex = findbathroomColor.colors.findIndex((item) => item._id.toString() === bathroomcolorId);

//   if (bathroomColorIndex === -1) {
//     return next(new ErrorHandler('bathroom Color not found', 404));
//   }

//   const colorCardImageFile = files.find((item) => item.fieldname === 'colorCardImage');
//   const mainImageFile = files.find((item) => item.fieldname === 'mainImage');

//   let colorCardImage;
//   let mainImage;

//   const colors = findbathroomColor.colors[bathroomColorIndex];

//   if (colorCardImageFile !== undefined) {
//     if (!isImage(colorCardImageFile)) {
//       return next(new ErrorHandler('Only images are allowed', 400));
//     }
//     const fileId = colors.colorCardImage;
//     const newColorCardImage = await updateImageOnDrive(fileId, colorCardImageFile);
//     colorCardImage = newColorCardImage;
//   } else {
//     colorCardImage = colors.colorCardImage;
//   }

//   if (mainImageFile !== undefined) {
//     if (!isImage(mainImageFile)) {
//       return next(new ErrorHandler('Only images are allowed', 400));
//     }
//     const fileId = colors.mainImage;
//     const newMainImage = await updateImageOnDrive(fileId, mainImageFile);
//     mainImage = newMainImage;
//   } else {
//     mainImage = colors.mainImage;
//   }
//   let slugAuto;
//   if (req.body.colorName) {
//     slugAuto = createSlug(req.body.colorName);
//   }
//   const updatedColorDetails = {
//     colorName: req.body.colorName,
//     slug: slugAuto,
//   };

//   const updatedColor = {
//     ...colors.toObject(),
//     ...updatedColorDetails,
//     colorCardImage,
//     mainImage,
//   };

//   findbathroomColor.colors[bathroomColorIndex] = updatedColor;

//   await findbathroomColor.save();

//   return res.status(200).json({ message: 'bathroom Colors Updated' });
// });
// const deletebathroomColor = asyncHandler(async (req, res, next) => {
//   const { bathroomcolorId } = req.params;
//   const findBathroom = await bathroomModel.findOne({ 'colors._id': bathroomcolorId });

//   if (!findBathroom) {
//     return next(new ErrorHandler('Bathroom Color Not Found', 400));
//   }

//   const findBathroomColor = findBathroom.colors.find((item) => item.id === bathroomcolorId);
//   const {
//     colorCardImage,
//     mainImage,
//     _id,
//   } = findBathroomColor;

//   await deleteImage(colorCardImage);
//   await deleteImage(mainImage);

//   const bathroomColorDelete = findBathroom.colors.pull(_id);

//   if (!bathroomColorDelete) {
//     return next(new ErrorHandler('Bathroom Color Not Found', 400));
//   }

//   await findBathroom.save();
//   return res.status(200).json(({ message: 'Bathroom Color Deleted Successfully' }));
// });

module.exports = {
  // addKitchen,
  // kitchens,
  // kitchen,
  // getSinglekitchen,
  // updateKitchen,
  // deleteKitchen,
  // addKitchenColors,
  // kitchenColor,
  // updateKitchenColor,
  // deleteKitchenColor,
  addAmbient,
  getAmbients,
  getAmbient,
  getSingleAmbient,
  updateAmbient,
  getAllAmbients,
  deleteAmbient,
  addAmbientColors,
  getAmbientColor,
  updateAmbientColor,
  deleteAmbientColor,
  // addBathroom,
  // Bathrooms,
  // Bathroom,
  // updateBathroom,
  // deleteBathroom,
  // addBathroomColors,
  // bathroomColor,
  // updatebathroomColor,
  // deletebathroomColor,
};
