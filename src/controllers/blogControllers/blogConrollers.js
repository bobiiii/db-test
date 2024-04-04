/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const { asyncHandler } = require('../../utils/asyncHandler');
const { blogModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive, deleteImage } = require('../uploadImageController');

const addBlogController = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const blogImage = files.find((item) => item.fieldname === 'blogImage');
  const bannerImage = files.find((item) => item.fieldname === 'bannerImage');
  const contentImage = files.find((item) => item.fieldname === 'contentImage');

  let {
    // eslint-disable-next-line prefer-const
    title, date, views, contentOne, heading, contentTwo,
  } = req.body;

  // eslint-disable-next-line max-len
  if (!title || !date || !views || !contentOne || !heading || !contentTwo || !blogImage || !bannerImage || !contentImage) {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  title = title.toLowerCase();
  const blogExist = await blogModel.findOne({ title });
  if (blogExist) {
    next(new ErrorHandler('Blog already exists', 409));
  }

  const blogImageId = await uploadImageToDrive(blogImage);
  const bannerImageId = await uploadImageToDrive(bannerImage);
  const contentImageId = await uploadImageToDrive(contentImage);

  const addBlogDB = await blogModel.create({
    title,
    date,
    views,
    blogImage: blogImageId,
    bannerImage: bannerImageId,
    contentOne,
    heading,
    contentImage: contentImageId,
    contentTwo,
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

  const { blogImage, bannerImage, contentImage } = delBlog;
  await deleteImage(blogImage);
  await deleteImage(bannerImage);
  await deleteImage(contentImage);
  await blogModel.findByIdAndDelete(blogId);

  return res.status(200).json({ message: 'blog deleted successfully ' });
});

module.exports = {
  addBlogController,
  blog,
  getBlogs,
  deleteBlog,
};
