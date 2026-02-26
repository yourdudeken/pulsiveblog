const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

// Security and utility Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit to allow base64 media uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/public', publicRoutes);

// General Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error: ', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
