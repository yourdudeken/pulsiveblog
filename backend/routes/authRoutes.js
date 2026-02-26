const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   GET /api/auth/github
// @desc    Initiate GitHub OAuth
router.get('/github', authLimiter, authController.githubLogin);

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth Callback
router.get('/github/callback', authController.githubCallback);

// @route   POST /api/auth/logout
// @desc    Logout user and clear cookie
router.post('/logout', authController.logout);

// @route   GET /api/auth/me
// @desc    Get current logged in user details
router.get('/me', protect, authController.getMe);

module.exports = router;
