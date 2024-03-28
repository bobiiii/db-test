/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const { asyncHandler } = require('../../utils/asyncHandler');
const { blogModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage, updateImageOnDrive } = require('../uploadImageController');

const addBlogController = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const imageRef = files.find((item) => item.fieldname === 'imageRef');

  if (imageRef === undefined) {
    throw new ErrorHandler('Please upload an image file', 400);
  }

  let {
    // eslint-disable-next-line prefer-const
    title, date, views, content,
  } = req.body;

  if (!title || !date || !views || !content) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  title = title.toLowerCase();
  const blogExist = await blogModel.findOne({ title });
  if (blogExist) {
    next(new ErrorHandler('Blog already exists', 409));
  }

  const imageId = await uploadImageToDrive(imageRef);

  const addBlogDB = await blogModel.create({
    title,
    date,
    imageRef: imageId,
    views,
    content,
  });

  if (!addBlogDB) {
    next(new ErrorHandler('Unable to add blog', 500));
  }
  return res.status(200).send({ msg: 'Blog added successfully' });
});

const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await blogModel.find({});
  if (!blogs) {
    next(new ErrorHandler('No blogs found ', 400));
  }
  return res.status(200).json({ data: blogs });
});

const updateBlogController = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const { files } = req;
  const {
    title, date, views, content,
  } = req.body;

  const imageRef = files.find((item) => item.fieldname === 'imageRef');

  const verifyBlogId = await blogModel.findById(blogId);
  if (!verifyBlogId) {
    return next(new ErrorHandler('Blog Not FOund', 400));
  }

  const updateFields = {};
  if (title !== undefined) {
    updateFields.title = title;
  }
  if (date !== undefined) {
    updateFields.date = date;
  }
  if (views !== undefined) {
    updateFields.views = views;
  }
  if (content !== undefined) {
    updateFields.content = content;
  }
  if (imageRef !== undefined) {
    const fileId = verifyBlogId.imageRef;
    const updatedImg = await updateImageOnDrive(fileId, imageRef);
    updateFields.imageRef = updatedImg;
  }

  const blog = await blogModel.findByIdAndUpdate(blogId, updateFields, { new: true });

  return res.status(200).json({ msg: 'blog Update Sucessfully' });
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

  const { imageRef } = delBlog;
  await deleteImage(imageRef);

  return res.status(200).json({ message: 'blog deleted successfully ' });
});

module.exports = {
  addBlogController,
  blog,
  getBlogs,
  updateBlogController,
  deleteBlog,
};
