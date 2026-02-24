if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
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
const dbCheck = require('./middleware/dbCheck');

const app = express();
const PORT = process.env.PORT || 8080;

// Trust Vercel Proxy
app.set('trust proxy', 1);

// 1. Static Files (Move to the very top for speed/resilience)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Health check (Verify app is up without DB/Auth)
app.get('/api/health', (req, res) => res.json({ status: 'ok', branding: 'pulsiveblog' }));

// 3. Connect to Database (Async, don't block startup)
connectDB();

// 4. Global Middleware
app.use(cors());
app.use(bodyParser.json());

// 5. Session and Passport Middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'pulsive_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes (Versioning v1)
app.use('/api/v1/posts', dbCheck, postRoutes);
app.use('/api/v1/upload', dbCheck, uploadRoutes);
app.use('/api/v1/auth', dbCheck, authRoutes);

// Legacy/Root redirects (optional but helpful for transition)
app.get('/api/posts*', (req, res) => res.redirect(req.url.replace('/api/posts', '/api/v1/posts')));
app.get('/api/auth*', (req, res) => res.redirect(req.url.replace('/api/auth', '/api/v1/auth')));

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
