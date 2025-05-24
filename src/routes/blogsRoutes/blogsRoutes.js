const express = require('express');
const Multer = require('multer');
const { blogsControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 10 MB max file size
    fieldSize: 10 * 1024 * 1024, // 5 MB max for text fields like content
  },
});

const blogRoute = express.Router();

// blogRoute.get('/', blogsControllers.getBlogs);
blogRoute.post('/add-blog', upload.any(), blogsControllers.addBlogController);
blogRoute.put('/update-blog/:blogId', upload.any(), blogsControllers.updateBlogController);
blogRoute.post('/upload-blog-image', upload.any(), blogsControllers.uploadBlogImage);
// blogRoute.get('/:blogId', blogsControllers.blog);
// blogRoute.delete('/delete-blog/:blogId', adminRoutes, blogsControllers.deleteBlog);

module.exports = blogRoute;
