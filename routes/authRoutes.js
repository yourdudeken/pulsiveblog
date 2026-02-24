const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_pulsive_blog_key';

// GitHub Auth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    (req, res, next) => {
        passport.authenticate('github', (err, user, info) => {
            if (err) {
                console.error('Passport Auth Error:', err);
                return res.status(500).json({ message: 'Passport Auth Error', error: err.message });
            }
            if (!user) {
                console.error('Passport Auth Failed - No User:', info);
                return res.redirect('/?error=github_failed');
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    console.error('Login Error:', loginErr);
                    return res.status(500).json({ message: 'Login Error', error: loginErr.message });
                }

                try {
                    // Successful authentication
                    const token = jwt.sign(
                        { id: user._id, username: user.username },
                        JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    // Pass token and metadata to frontend via script in redirect
                    res.send(`
                        <script>
                            localStorage.setItem('pulsive_token', '${token}');
                            localStorage.setItem('pulsive_user', JSON.stringify({
                                username: '${user.username}',
                                avatar: '${user.avatar || ""}',
                                apiKey: '${user.apiKey}'
                            }));
                            window.location.href = '/dashboard.html';
                        </script>
                    `);
                } catch (jwtErr) {
                    console.error('JWT Signing Error:', jwtErr);
                    res.status(500).json({ message: 'Token Generation Error', error: jwtErr.message });
                }
            });
        })(req, res, next);
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
