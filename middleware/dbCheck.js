const mongoose = require('mongoose');
const connectDB = require('../config/db');

const dbCheck = async (req, res, next) => {
    // If disconnected (0) or connecting (2), try to connect/wait
    if (mongoose.connection.readyState !== 1) {
        console.log('DB not ready (state ' + mongoose.connection.readyState + '). Attempting connection...');
        await connectDB();
    }

    // Re-check after attempt
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection is not established.',
            error: 'The server is unable to reach the database. Please check your Vercel MONGODB_URI environment variable and MongoDB Atlas IP whitelist.',
            status: mongoose.connection.readyState
        });
    }
    next();
};

module.exports = dbCheck;
