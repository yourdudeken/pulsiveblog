const Post = require('../models/Post');
const mongoose = require('mongoose');

// Helper to generate slug from title (shared logic if needed)
const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

exports.getAllPosts = async (req, res) => {
    try {
        const { tag, page = 1, limit = 10, status = 'published' } = req.query;
        const query = { status };

        if (tag) {
            query.tags = tag;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalPosts: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostByIdentifier = async (req, res) => {
    try {
        const identifier = req.params.identifier;
        let post;

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            post = await Post.findById(identifier);
        } else {
            post = await Post.findOne({ slug: identifier });
        }

        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const post = new Post({
        title: req.body.title,
        slug: req.body.slug || slugify(req.body.title),
        featuredImage: req.body.featuredImage,
        content: req.body.content,
        excerpt: req.body.excerpt,
        author: req.body.author,
        tags: req.body.tags || [],
        status: req.body.status || 'published'
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (req.body.title) {
            post.title = req.body.title;
            if (!req.body.slug) post.slug = slugify(req.body.title);
        }
        if (req.body.slug) post.slug = req.body.slug;
        if (req.body.featuredImage) post.featuredImage = req.body.featuredImage;
        if (req.body.content) post.content = req.body.content;
        if (req.body.excerpt) post.excerpt = req.body.excerpt;
        if (req.body.author) post.author = req.body.author;
        if (req.body.tags) post.tags = req.body.tags;
        if (req.body.status) post.status = req.body.status;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
