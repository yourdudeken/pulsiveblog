const rateLimit = require('express-rate-limit');

/**
 * Professional Rate Limiter for API Key routes
 * Protects database and server resources from abuse
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes',
        branding: 'pulsiveblog'
    },
    // We can also key by API Key for more granular control if needed
    keyGenerator: (req) => req.header('X-API-KEY') || req.ip,
    validate: { keyGeneratorIpFallback: false }, // Suppress IPv6 validation warning for custom key generator
});

module.exports = apiLimiter;
