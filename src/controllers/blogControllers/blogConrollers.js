// eslint-disable-next-line import/no-extraneous-dependencies
const { asyncHandler } = require('../../utils/asyncHandler');
const { blogModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');

const addBlogController = asyncHandler(async (req, res, next) => {
  let {
    // eslint-disable-next-line prefer-const
    title, date, image, views, content,
  } = req.body;

  if (title && date && image && views && content === '') {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  title = title.toLowerCase();

  const blogExist = await blogModel.findOne({ title });
  if (blogExist) {
    next(new ErrorHandler('Blog already exists', 409));
  }

  const addBlogDB = await blogModel.create({
    title,
    date,
    imageRef: image,
    views,
    content,
  });
  if (!addBlogDB) {
    next(new ErrorHandler('Unable to add blog', 500));
  }
  return res.status(200).send({ message: 'Blog added successfully', data: addBlogDB });
});

const blog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;

  const findBlog = await blogModel.findById(blogId);
  if (!findBlog) {
    return next(new ErrorHandler('Blog doesn\'t exist', 404));
  }

  return res.status(200).json({ data: findBlog });
});

const getBlogs = asyncHandler(async (req, res, next) => {
  try {
    console.log('blog cntrlr');
    const blogs = await blogModel.find({});
    if (!blogs) {
      next(new ErrorHandler('No blogs found ', 400));
    }
    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.log('error occured', error);
    return res.status(200).send('error occured');
  }
});

const updateBlogController = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  let {
    // eslint-disable-next-line prefer-const
    title, date, image, views, content,
  } = req.body;

  const blogExist = await blogModel.findById(blogId);

  if (!blogExist) {
    return next(new ErrorHandler('blog dosent exists', 404));
  }

  title = title.toLowerCase();

  const updateBlogDB = await blogModel.findByIdAndUpdate(blogId, {
    title,
    date,
    image,
    views,
    content,
  });

  if (!updateBlogDB) {
    return next(new ErrorHandler('Unable to update blog', 500));
  }

  return res.status(200).json({ message: 'blog updated successfully', UpdtData: updateBlogDB });
});

const deleteBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const delBlog = await blogModel.deleteOne({ _id: blogId });
  if (!delBlog) {
    next(new ErrorHandler('No blog found ', 400));
  }
  return res.status(200).json({ message: 'blog deleted successfully ' });
});

module.exports = {
  addBlogController,
  blog,
  getBlogs,
  updateBlogController,
  deleteBlog,
};
