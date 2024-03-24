const express = require('express');
const { blogsControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const blogRoute = express.Router();

blogRoute.get('/', blogsControllers.getBlogs);
blogRoute.post('/add-blog', blogsControllers.addBlogController);
blogRoute.get('/:blogId', blogsControllers.blog);
blogRoute.put('/update-blog/:blogId', blogsControllers.updateBlogController);
blogRoute.delete('/delete-blog/:blogId', adminRoutes, blogsControllers.deleteBlog);

module.exports = blogRoute;
