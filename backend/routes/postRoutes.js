const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protect all post routes. Only authenticated users can manage their content.
router.use(protect);
router.use(apiLimiter);

// @route   GET /api/posts
// @desc    List all posts inside the repository
router.get('/', postController.listPosts);

// @route   POST /api/posts
// @desc    Create a new Markdown post
router.post('/', postController.createPost);

// @route   PUT /api/posts
// @desc    Update an existing Markdown post
router.put('/', postController.updatePost);

// @route   DELETE /api/posts
// @desc    Delete a post by path
router.delete('/', postController.deletePost);

// @route   POST /api/posts/media
// @desc    Upload media directly to GitHub repo
router.post('/media', postController.uploadMedia);

module.exports = router;
