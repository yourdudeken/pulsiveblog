const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_pulse_blog_key';

// GitHub Auth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/?error=github_failed' }),
    (req, res) => {
        // Successful authentication
        const token = jwt.sign(
            { id: req.user._id, username: req.user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Pass token and metadata to frontend via script in redirect
        res.send(`
            <script>
                localStorage.setItem('pulse_token', '${token}');
                localStorage.setItem('pulse_user', JSON.stringify({
                    username: '${req.user.username}',
                    avatar: '${req.user.avatar}'
                }));
                window.location.href = '/';
            </script>
        `);
    }
);

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
