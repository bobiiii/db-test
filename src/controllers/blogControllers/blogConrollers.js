/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const { asyncHandler } = require('../../utils/asyncHandler');
const { BlogModel } = require('../../models');
const { ErrorHandler } = require('../../utils/errorHandler');
const {
  uploadImageToDrive,
  deleteImage,
  isImage,
  uploadImageToDriveBlog,
} = require('../uploadImageController');
const { createSlug } = require('../../utils/createSlug');

const convertContentImagesSrc = require('../../utils/convertContentImagesSrc');
const extractImageIdsFromContent = require('../../utils/imageIdExtractor');
const { updateImageToDriveBlog } = require('../uploadImageController/uploadImgController');

const addBlogController = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const cardImage = files?.find((file) => file?.fieldname === 'cardImage');
  const bannerImage = files?.find(
    (file) => file?.fieldname === 'blogBannerImage',
  );

  const {
    title, content, category, shortDesc,
  } = req.body;

  // Validate required fields
  if (!title || !content || !category || !shortDesc) {
    return next(new ErrorHandler('Please fill all required fields.', 400));
  }

  if (!cardImage || !bannerImage) {
    return next(new ErrorHandler('Card and Banner images are required.', 400));
  }

  const existingBlog = await BlogModel.findOne({ title });
  if (existingBlog) {
    return next(new ErrorHandler('Blog with this title already exists.', 400));
  }

  const cardImageData = {
    buffer: cardImage.buffer,
    mimetype: cardImage.mimetype,
    name: cardImage.originalname,
  };

  const bannerImageData = {
    buffer: bannerImage.buffer,
    mimetype: bannerImage.mimetype,
    name: bannerImage.originalname,
  };

  const cardImageId = await uploadImageToDriveBlog(
    cardImageData,
    process.env.GOOGLE_DRIVE_BLOGS_FOLDER_ID,
  );
  const bannerImageId = await uploadImageToDriveBlog(
    bannerImageData,
    process.env.GOOGLE_DRIVE_BLOGS_FOLDER_ID,
  );

  if (!cardImageId || typeof cardImageId !== 'string') {
    return next(new ErrorHandler('Failed to upload Card Image.', 500));
  }

  if (!bannerImageId || typeof bannerImageId !== 'string') {
    return next(new ErrorHandler('Failed to upload Banner Image.', 500));
  }

  const slug = createSlug(title);
  const updatedContent = convertContentImagesSrc(content);
  const contentImageIds = extractImageIdsFromContent(updatedContent);

  const newBlog = await BlogModel.create({
    title,
    slug,
    cardImage: cardImageId,
    blogBannerImage: bannerImageId,
    category,
    shortDesc,
    contentImageIds,
    content: updatedContent,
  });

  if (!newBlog) {
    return next(new ErrorHandler('Error creating blog in database.', 500));
  }

  return res.status(201).json({
    status: 'Success',
    message: 'Blog created successfully!',
    blog: newBlog,
  });
});

const updateBlogController = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  if (!blogId) {
    return next(new ErrorHandler('No blogId Received', 400));
  }

  const { files, body } = req;
  const file = files.find((filee) => filee.fieldname === 'cardImage');
  const file2 = files.find((filee) => filee.fieldname === 'blogBannerImage');

  const {
    title, content, category, shortDesc,
  } = body;

  if (!file && !file2 && !title && !content && !category && !shortDesc) {
    return next(new ErrorHandler('At least one field is required to update', 400));
  }

  const blog = await BlogModel.findById(blogId);
  if (!blog) {
    return next(new ErrorHandler('No blog found with this ID', 404));
  }

  // Update cardImage
  if (file) {
    if (!isImage(file)) {
      return next(new ErrorHandler('Invalid card image file', 400));
    }

    const cardImage = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      name: file.originalname,
    };

    await updateImageToDriveBlog(blog.cardImage, cardImage);
  }

  // Update blogBannerImage
  if (file2) {
    if (!isImage(file2)) {
      return next(new ErrorHandler('Invalid banner image file', 400));
    }

    const blogBannerImage = {
      buffer: file2.buffer,
      mimetype: file2.mimetype,
      name: file2.originalname,
    };

    await updateImageToDriveBlog(blog.blogBannerImage, blogBannerImage);
  }

  // Update fields
  if (title) {
    const slugAuto = createSlug(title);
    blog.slug = slugAuto;
    blog.title = title;
  }

  if (content) {
    const contentImageIds = extractImageIdsFromContent(content);
    blog.contentImageIds = [...(blog.contentImageIds || []), ...contentImageIds];
    blog.content = content;
  }

  if (category) blog.category = category;
  if (shortDesc) blog.shortDesc = shortDesc;

  await blog.save();

  return res.status(200).json({
    status: 'Success',
    message: 'Blog Updated Successfully',
    blog,
  });
});

const uploadBlogImage = asyncHandler(async (req, res, next) => {
  const { files } = req;
  const internalImage = files?.find((file) => file?.fieldname === 'blogInternalImage');

  if (!internalImage || !internalImage.originalname) {
    return res.status(400).json({ error: 'Image not provided' });
  }

  const cardImage = {
    buffer: internalImage.buffer,
    mimetype: internalImage.mimetype,
    name: internalImage.originalname,
  };

  try {
    const response = await uploadImageToDriveBlog(
      cardImage,
      process.env.GOOGLE_DRIVE_BLOGS_INTERNAL_FOLDER_ID,
    );

    if (response) {
      return res.status(201).json({
        status: 'Success',
        message: 'File uploaded successfully to Google Drive!',
        fileId: response,
        fileLink: `https://drive.google.com/thumbnail?id=${response}&sz=w600`,
      });
    }
    return res.status(500).json({ error: 'Error while uploading to drive D131' });
  } catch (error) {
    console.error('Image Upload Error:', error);
    return res.status(500).json({ error: 'Image Upload Error' });
  }
});

const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await BlogModel.find({});
  if (!blogs) {
    next(new ErrorHandler('No blogs found ', 400));
  }
  return res.status(200).json({ data: blogs });
});

const blog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const singleBlog = await BlogModel.findById(blogId);

  if (!singleBlog) {
    return next(new ErrorHandler('Blog not found', 404));
  }
  return res.status(200).json({ data: singleBlog });
});

const deleteBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.params;
  const delBlog = await BlogModel.findById(blogId);
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
  await BlogModel.findByIdAndDelete(blogId);

  return res.status(200).json({ message: 'blog deleted successfully ' });
});

module.exports = {
  addBlogController,
  updateBlogController,
  uploadBlogImage,
  blog,
  getBlogs,
  deleteBlog,
};
