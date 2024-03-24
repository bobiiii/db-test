const express = require('express');
const { blogsControllers } = require('../../controllers');
const { adminRoutes } = require('../../middlewares');

const blogRoute = express.Router();

blogRoute.post('/add-blog', blogsControllers.addBlogController);
blogRoute.get('/:blogId', blogsControllers.blog);
blogRoute.get('/get-blogs', blogsControllers.getBlogs);
blogRoute.put('/update-blog/:blogId', blogsControllers.updateBlogController);
blogRoute.delete('/delete-blog/:blogId', adminRoutes, blogsControllers.deleteBlog);

module.exports = blogRoute;
