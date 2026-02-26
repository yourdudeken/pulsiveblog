const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const { triggerWebhook } = require('../middleware/webhookUtils');

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
        const { tag, page = 1, limit = 10, status = 'published', search } = req.query;

        // Base query restricted to the authenticated user
        const query = { user: req.user._id };

        // Support 'all' to bypass status filtering
        if (status !== 'all') {
            query.status = status;
        }

        if (tag) {
            query.tags = tag;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        let totalPosts = await Post.countDocuments(query);
        let queryBuilder = Post.find(query).sort({ createdAt: -1 });

        // Support 'all' to bypass pagination limits
        if (limit !== 'all') {
            const limitNum = parseInt(limit);
            const pageNum = parseInt(page);
            queryBuilder = queryBuilder.limit(limitNum).skip((pageNum - 1) * limitNum);
        }

        const posts = await queryBuilder.exec();

        res.json({
            posts,
            totalPages: limit === 'all' ? 1 : Math.ceil(totalPosts / parseInt(limit)),
            currentPage: limit === 'all' ? 1 : Number(page),
            totalPosts: totalPosts
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
            post = await Post.findOne({ _id: identifier, user: req.user._id });
        } else {
            post = await Post.findOne({ slug: identifier, user: req.user._id });
        }

        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const post = new Post({
        user: req.user._id, // Set ownership
        title: req.body.title,
        slug: req.body.slug || slugify(req.body.title),
        featuredImage: req.body.featuredImage,
        content: req.body.content,
        excerpt: req.body.excerpt,
        author: req.body.author,
        tags: req.body.tags || [],
        status: req.body.status || 'published',
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        openGraphImage: req.body.openGraphImage
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);

        // Trigger Webhook
        const fullUser = await User.findById(req.user._id);
        triggerWebhook(fullUser, { action: 'post_created', post: newPost });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
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
        if (req.body.metaTitle !== undefined) post.metaTitle = req.body.metaTitle;
        if (req.body.metaDescription !== undefined) post.metaDescription = req.body.metaDescription;
        if (req.body.openGraphImage !== undefined) post.openGraphImage = req.body.openGraphImage;

        const updatedPost = await post.save();
        res.json(updatedPost);

        // Trigger Webhook
        const fullUser = await User.findById(req.user._id);
        triggerWebhook(fullUser, { action: 'post_updated', post: updatedPost });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });

        // Trigger Webhook
        const fullUser = await User.findById(req.user._id);
        triggerWebhook(fullUser, { action: 'post_deleted', post_id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
