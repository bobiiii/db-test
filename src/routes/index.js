const express = require('express');
const userRoutes = require('./userRoutes');
const blogsRoutes = require('./blogsRoutes');

const apiRoutes = express.Router();
apiRoutes.use('/user', userRoutes);
apiRoutes.use('/blog', blogsRoutes);
apiRoutes.use('/aa', (req, res) => { res.status(200).json({ message: 'Working fine' }); });

module.exports = apiRoutes;
