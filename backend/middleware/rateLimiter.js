const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

exports.authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: { error: 'Too many login attempts from this IP, please try again after an hour' }
});
