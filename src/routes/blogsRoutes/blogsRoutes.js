const express = require('express');
const Multer = require('multer');
const { blogsControllers } = require('../../controllers');
// const { adminRoutes } = require('../../middlewares');

const upload = Multer();

const blogRoute = express.Router();

blogRoute.get('/', blogsControllers.getBlogs);
blogRoute.post('/add-blog', upload.any(), blogsControllers.addBlogController);
// blogRoute.get('/:blogId', blogsControllers.blog);
blogRoute.put('/update-blog/:blogId', blogsControllers.updateBlogController);
// blogRoute.delete('/delete-blog/:blogId', adminRoutes, blogsControllers.deleteBlog);

module.exports = blogRoute;
