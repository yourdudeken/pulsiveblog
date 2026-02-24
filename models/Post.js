const mongoose = require('mongoose');

const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featuredImage: { type: String },
    content: { type: String, required: true },
    excerpt: { type: String },
    author: { type: String, default: 'Admin' },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    // SEO Content
    metaTitle: { type: String },
    metaDescription: { type: String },
    openGraphImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

postSchema.pre('save', async function () {
    this.updatedAt = Date.now();
    if (!this.slug && this.title) {
        this.slug = slugify(this.title);
    }
    // Auto-generate excerpt if not provided
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
    }
});

module.exports = mongoose.model('Post', postSchema);
