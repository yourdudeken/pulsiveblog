const mongoose = require('mongoose');

const dbCheck = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection is not established.',
            error: 'The server is unable to reach the database. Please ensure your MongoDB Atlas IP whitelist includes 0.0.0.0/0 for Vercel.',
            status: mongoose.connection.readyState
        });
    }
    next();
};

module.exports = dbCheck;
