/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const { asyncHandler } = require('../../utils/asyncHandler');
const { blogModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage, isImage } = require('../uploadImageController');
const { createSlug } = require('../../utils/createSlug');

const addBlogController = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const cardImage = files.find((item) => item.fieldname === 'cardImage');
  const bannerImage = files.find((item) => item.fieldname === 'bannerImage');
  const imageOne = files.find((item) => item.fieldname === 'imageOne');
  const imageTwo = files.find((item) => item.fieldname === 'imageTwo');
  // console.log(files);

  let {
    // eslint-disable-next-line prefer-const, max-len
    title, date, views, headingOne, paragraphOne, headingTwo, paragraphTwo, headingThree, paragraphThree,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!title || !date || !views || !headingOne || !paragraphOne || !headingTwo || !paragraphTwo || !headingThree || !paragraphThree || !cardImage || !imageOne || !bannerImage || !imageTwo) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  if (!isImage(cardImage) || !isImage(imageOne) || !isImage(bannerImage) || !isImage(imageTwo)) {
    return next(new ErrorHandler('Only images are allowed', 400));
  }

  title = title.toLowerCase();
  const blogExist = await blogModel.findOne({ title });
  if (blogExist) {
    next(new ErrorHandler('Blog already exists', 409));
  }

  const cardImageId = await uploadImageToDrive(cardImage);
  const bannerImageId = await uploadImageToDrive(bannerImage);
  const imageOneId = await uploadImageToDrive(imageOne);
  const imageTwoId = await uploadImageToDrive(imageTwo);

  const slugAuto = createSlug(title);

  const addBlogDB = await blogModel.create({
    title,
    slug: slugAuto,
    date,
    views,
    cardImage: cardImageId,
    bannerImage: bannerImageId,
    headingOne,
    paragraphOne,
    imageOne: imageOneId,
    headingTwo,
    paragraphTwo,
    imageTwo: imageTwoId,
    headingThree,
    paragraphThree,
  });

  if (!addBlogDB) {
    next(new ErrorHandler('Unable to add blog', 500));
  }
  return res.status(200).send({ message: 'Blog added successfully' });
});

const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await blogModel.find({});
  if (!blogs) {
    next(new ErrorHandler('No blogs found ', 400));
  }
  return res.status(200).json({ data: blogs });
});

const blog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const singleBlog = await blogModel.findById(blogId);

  if (!singleBlog) {
    return next(new ErrorHandler('Blog not found', 404));
  }
  return res.status(200).json({ data: singleBlog });
});

const deleteBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const delBlog = await blogModel.findById(blogId);
  if (!delBlog) {
    next(new ErrorHandler('No blog found ', 400));
  }

  const {
    cardImage, bannerImage, imageOne, imageTwo,
  } = delBlog;
  await deleteImage(cardImage);
  await deleteImage(bannerImage);
  await deleteImage(imageOne);
  await deleteImage(imageTwo);
  await blogModel.findByIdAndDelete(blogId);

  return res.status(200).json({ message: 'blog deleted successfully ' });
});

module.exports = {
  addBlogController,
  blog,
  getBlogs,
  deleteBlog,
};
