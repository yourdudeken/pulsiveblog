const User = require('../models/User');
const { encrypt } = require('../utils/crypto');
const GithubService = require('../services/githubService');
const jwt = require('jsonwebtoken');

const issueToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.githubLogin = (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=public_repo read:user`;
    res.redirect(githubAuthUrl);
};

exports.githubCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            return res.status(400).json({ error: 'Failed to retrieve access token' });
        }

        const githubSvc = new GithubService(accessToken);
        const { data: profile } = await githubSvc.octokit.rest.users.getAuthenticated();

        const githubId = profile.id.toString();
        const username = profile.login;
        const repoName = `${username}-blog`;

        let user = await User.findOne({ $or: [{ github_id: githubId }, { username }] });

        if (!user) {
            try {
                await githubSvc.initializeRepository(repoName);
            } catch (err) {
                console.warn("Repository creation warning:", err.message);
            }

            user = await User.create({
                github_id: githubId,
                username,
                repo_name: repoName,
                encrypted_access_token: encrypt(accessToken)
            });
        } else {
            user.github_id = githubId;
            user.encrypted_access_token = encrypt(accessToken);
            await user.save();
        }

        const token = issueToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard`);
    } catch (error) {
        console.error('OAuth Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        github_id: req.user.github_id,
        repo_name: req.user.repo_name
    });
};
