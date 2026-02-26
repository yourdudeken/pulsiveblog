const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    github_id: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    repo_name: {
        type: String,
        required: true
    },
    encrypted_access_token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
