const User = require('../models/User');

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.header('X-API-KEY') || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({ message: 'No API key provided' });
    }

    try {
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(403).json({ message: 'Invalid API key' });
        }

        // Attach user to request for use in controllers if needed
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = apiKeyAuth;
