require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');

const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session and Passport Middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'pulsive_session_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes (Versioning v1)
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/auth', authRoutes);

// Legacy/Root redirects (optional but helpful for transition)
app.get('/api/posts', (req, res) => res.redirect('/api/v1/posts'));
app.get('/api/auth', (req, res) => res.redirect('/api/v1/auth'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
        stack: err.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
