require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8080;

// Initialize Database connection, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Pulsiveblog Platform running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed on startup:', err.message);
    process.exit(1);
});
