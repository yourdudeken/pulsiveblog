const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    githubId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    apiKey: { type: String, unique: true, sparse: true },
    webhookUrl: { type: String },
    webhookLogs: [{
        event: String,
        status: Number,
        payload: Object,
        response: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
