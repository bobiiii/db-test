/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const { asyncHandler } = require('../../utils/asyncHandler');
const { blogModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { uploadImageToDrive } = require('../uploadImageController');

const addBlogController = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const image = files[0];

  if (!image) {
    throw new ErrorHandler('Please upload an image file', 400);
  }

  let {
    // eslint-disable-next-line prefer-const
    title, date, views, content,
  } = req.body;

  if (title || date || views || content === '') {
    return next(new ErrorHandler('Please fill all required fields', 400));
  }

  const imageId = await uploadImageToDrive(image);

  title = title.toLowerCase();
  const blogExist = await blogModel.findOne({ title });
  if (blogExist) {
    next(new ErrorHandler('Blog already exists', 409));
  }

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
  return res.status(200).send({ message: 'Blog added successfully', data: addBlogDB });
});

// const blog = asyncHandler(async (req, res, next) => {
//   const { blogId } = req.params;

//   const findBlog = await blogModel.findById(blogId);
//   if (!findBlog) {
//     return next(new ErrorHandler('Blog doesn\'t exist', 404));
//   }

//   const {
//     title, date, imageRef, views, content,
//   } = findBlog;

//   const { data } = await drive.files.get({
//     fileId: imageRef,
//     alt: 'media',
//   }, { responseType: 'stream' });
//   console.log(data);
//   if (!data) {
//     return next(new ErrorHandler('image not found', 404));
//   }

//   // data.on('end', () => {
//   // const response = {
//   //   title,
//   //   date,
//   //   imageRef: data,
//   //   views,
//   //   content,
//   // };
//   //   return res.status(200).json(response);
//   // });
//   // data.on('error', (err) => res.status(500).json({ error: err.message }));
//   // return data.pipe(res);
//   return res.send('worked');
// });

// eslint-disable-next-line consistent-return
// const blog = asyncHandler(async (req, res, next) => {
//   const { blogId } = req.params;

//   const findBlog = await blogModel.findById(blogId);
//   if (!findBlog) {
//     return next(new ErrorHandler('Blog doesn\'t exist', 404));
//   }

//   const {
//     title, date, imageRef, views, content,
//   } = findBlog;

//   const image = await drive.files.get({
//     fileId: imageRef,
//     alt: 'media',
//   }, { responseType: 'stream' });
//   console.log(image);
//   if (!image) {
//     return next(new ErrorHandler('image not found', 404));
//   }

// const base64Image = Buffer.from(image).toString('base64');
// const mimeType = 'jpeg';
// const imageURL = `data:image/${mimeType};base64,${base64Image}`;
// console.log(imageURL);
// // Create the response object with image data
// const responseObject = {
//   title,
//   date,
//   imageRef: imageURL,
//   views,
//   content,
// };

// Send the response
// return res.status(200).send('send');

// data.on('error', (err) => next(new ErrorHandler('Error reading image data', 500)));
// });

const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await blogModel.find({});
  if (!blogs) {
    next(new ErrorHandler('No blogs found ', 400));
  }
  return res.status(200).json({ data: blogs });
});

const updateBlogController = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const image = files[0];
  const { blogId } = req.params;
  let {
    // eslint-disable-next-line prefer-const
    title, date, imageRef, views, content,
  } = req.body;

  const blogExist = await blogModel.findById(blogId);

  if (!blogExist) {
    return next(new ErrorHandler('blog dosent exists', 404));
  }
  if (image) {
    const fileId = imageRef;
    const updatedImage = image;
    // const updateImageId = updateImageOnDrive(fileId, updatedImage);
    // return updateImageId;
  }

  title = title.toLowerCase();

  const updateBlogDB = await blogModel.findByIdAndUpdate(blogId, {
    title,
    date,
    imageRef,
    views,
    content,
  });

  if (!updateBlogDB) {
    return next(new ErrorHandler('Unable to update blog', 500));
  }

  return res.status(200).json({ message: 'blog updated successfully', UpdtData: updateBlogDB });
});

// const deleteBlog = asyncHandler(async (req, res, next) => {
//   const { blogId } = req.params;
//   const delBlog = await blogModel.findByIdAndDelete(blogId);
//   if (!delBlog) {
//     next(new ErrorHandler('No blog found ', 400));
//   }

//   const { imageRef } = delBlog;

//   const imgDelete = await drive.files.delete({
//     fileId: imageRef,
//   });

//   if (!imgDelete) {
//     return next(new ErrorHandler('Unable to delete blog img', 500));
//   }

//   return res.status(200).json({ message: 'blog deleted successfully ' });
// });

module.exports = {
  addBlogController,
  // blog,
  getBlogs,
  updateBlogController,
  // deleteBlog,
};
