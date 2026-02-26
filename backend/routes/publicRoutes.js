const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);

// @route   GET /api/public/posts
// @desc    Get all posts across all users in the platform
router.get('/posts', publicController.getAllPosts);

module.exports = router;
