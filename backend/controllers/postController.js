const GithubService = require('../services/githubService');
const { decrypt } = require('../utils/crypto');
const sanitizeHtml = require('sanitize-html');

const getGithubService = (user) => {
    const accessToken = decrypt(user.encrypted_access_token);
    return new GithubService(accessToken);
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const date = new Date().toISOString().split('T')[0];
        const githubSvc = getGithubService(req.user);
        const slug = githubSvc.generateSlug(title);

        const path = `posts/${date}-${slug}.md`;

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'pre', 'code'])
        });

        const frontmatter = `---
title: ${title}
date: ${date}
tags: ${Array.isArray(tags) ? tags.join(', ') : ''}
---
`;
        const fullContent = frontmatter + '\n' + sanitizedContent;

        await githubSvc.createFile(
            req.user.repo_name,
            path,
            fullContent,
            `feat: Add post ${title}`
        );

        res.status(201).json({ message: 'Post created successfully', path });
    } catch (error) {
        console.error('Create Post Error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { path, title, content, tags } = req.body;

        if (!path || !title || !content) {
            return res.status(400).json({ error: 'Path, title, and content are required' });
        }

        // e.g. posts/2026-12-01-my-title.md -> 2026-12-01
        const dateMatch = path.match(/(\\d{4}-\\d{2}-\\d{2})/);
        const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

        const githubSvc = getGithubService(req.user);

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'pre', 'code'])
        });

        const frontmatter = `---
title: ${title}
date: ${date}
tags: ${Array.isArray(tags) ? tags.join(', ') : ''}
---
`;
        const fullContent = frontmatter + '\n' + sanitizedContent;

        await githubSvc.updateFile(
            req.user.repo_name,
            path,
            fullContent,
            `chore: Update post ${title}`
        );

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Update Post Error:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { path } = req.body;

        if (!path) {
            return res.status(400).json({ error: 'File path to delete is required' });
        }

        const githubSvc = getGithubService(req.user);

        await githubSvc.deleteFile(
            req.user.repo_name,
            path,
            `chore: Delete post at ${path}`
        );

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete Post Error:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

exports.uploadMedia = async (req, res) => {
    try {
        const { filename, base64Data } = req.body;

        if (!filename || !base64Data) {
            return res.status(400).json({ error: 'Filename and base64Data are required' });
        }

        const githubSvc = getGithubService(req.user);
        const path = `media/${Date.now()}-${filename}`;

        const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const bufferContent = Buffer.from(base64Content, 'base64');

        await githubSvc.createFile(
            req.user.repo_name,
            path,
            bufferContent,
            `feat: Upload media ${filename}`,
            true // isBuffer = true
        );

        const rawUrl = `https://raw.githubusercontent.com/${req.user.username}/${req.user.repo_name}/main/${path}`;

        res.status(201).json({ message: 'Media uploaded successfully', url: rawUrl, path });
    } catch (error) {
        console.error('Upload Media Error:', error);
        res.status(500).json({ error: 'Failed to upload media' });
    }
};

exports.listPosts = async (req, res) => {
    try {
        const githubSvc = getGithubService(req.user);
        const files = await githubSvc.listFiles(req.user.repo_name, 'posts');

        res.status(200).json({ posts: files });
    } catch (error) {
        console.error('List Posts Error:', error);
        res.status(500).json({ error: 'Failed to list posts' });
    }
};
