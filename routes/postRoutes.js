const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const apiLimiter = require('../middleware/rateLimiter');

// Public routes (now requiring API key for security as requested)
router.get('/', apiLimiter, apiKeyAuth, postController.getAllPosts);
router.get('/:identifier', apiLimiter, apiKeyAuth, postController.getPostByIdentifier);

// Management routes (Support both JWT and API Key)
const multiAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) return auth(req, res, next);
    return apiKeyAuth(req, res, next);
};

router.post('/', multiAuth, postController.createPost);
router.put('/:id', multiAuth, postController.updatePost);
router.delete('/:id', multiAuth, postController.deletePost);

module.exports = router;
