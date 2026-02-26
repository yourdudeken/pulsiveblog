const User = require('../models/User');
const GithubService = require('../services/githubService');
const { decrypt } = require('../utils/crypto');
const { Octokit } = require('@octokit/rest');

exports.getAllPosts = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users.length) return res.status(200).json({ posts: [] });

        // Use any valid token to avoid 60/hr limit. Just grab the first user.
        let octokit;
        const fallbackUser = users.find(u => u.encrypted_access_token);
        if (fallbackUser) {
            const token = decrypt(fallbackUser.encrypted_access_token);
            octokit = new Octokit({ auth: token });
        } else {
            octokit = new Octokit(); // fallback to unauthenticated
        }

        let allPosts = [];

        // Fetch concurrently from all repos
        await Promise.all(users.map(async (user) => {
            try {
                const { data } = await octokit.rest.repos.getContent({
                    owner: user.username,
                    repo: user.repo_name,
                    path: 'posts'
                });

                if (Array.isArray(data)) {
                    data.filter(file => file.name.endsWith('.md')).forEach(file => {
                        allPosts.push({
                            ...file,
                            author: user.username,
                            repo: user.repo_name,
                            avatar_url: `https://github.com/${user.username}.png`
                        });
                    });
                }
            } catch (error) {
                // Silent catch for deleted repos or empty roots
            }
        }));

        res.status(200).json({ posts: allPosts });
    } catch (error) {
        console.error('Public Posts Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch public posts' });
    }
};
