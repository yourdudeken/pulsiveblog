document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const postModal = document.getElementById('post-modal');
    const postForm = document.getElementById('post-form');
    const modalTitle = document.getElementById('modal-title');
    const openCreateModalBtn = document.getElementById('open-create-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings-modal');

    let isEditing = false;
    const API_URL = '/api/v1/posts';

    // Initialize Quill Editor
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // Fetch and display posts
    async function fetchPosts() {
        try {
            const response = await fetch(API_URL, {
                headers: Auth.getHeaders()
            });
            const data = await response.json();
            // Data now contains { posts: [], totalPages, currentPage, totalPosts }
            displayPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = `<p class="error">Failed to load posts. Is the server running?</p>`;
        }
    }

    function displayPosts(posts) {
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p>No posts found. Start by creating one!</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = posts.map(post => `
            <div class="post-card" data-id="${post._id}">
                ${post.featuredImage ? `<div class="post-image" style="background-image: url('${post.featuredImage}')"></div>` : ''}
                <div class="post-content-wrapper" style="padding: 2rem;">
                    <div class="post-meta">
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <div class="post-tags">
                        ${(post.tags || []).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                    <div class="post-content">${post.excerpt || (post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...')}</div>
                    <div class="post-actions">
                        <button class="btn btn-secondary edit-btn" onclick="editPost('${post._id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger delete-btn" onclick="deletePost('${post._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button class="btn btn-secondary api-btn" onclick="copyApiUrl('${post.slug}')">
                            <i class="fas fa-link"></i> API
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Modal Handle
    openCreateModalBtn.addEventListener('click', () => {
        isEditing = false;
        modalTitle.textContent = 'Create New Post';
        postForm.reset();
        quill.setContents([]);
        document.getElementById('post-id').value = '';
        document.getElementById('featured-image').value = '';
        document.getElementById('image-status').textContent = 'No image selected';
        document.getElementById('meta-title').value = '';
        document.getElementById('meta-description').value = '';
        document.getElementById('og-image').value = '';
        postModal.style.display = 'flex';
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            postModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === postModal) {
            postModal.style.display = 'none';
        }
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Settings Handle
    openSettingsBtn.addEventListener('click', async () => {
        const menu = document.getElementById('profile-menu');
        if (menu) menu.classList.remove('active');

        const user = Auth.getUser();
        if (user) {
            document.getElementById('setting-api-key').value = user.apiKey || '';
            document.getElementById('webhook-url').value = user.webhookUrl || '';
            settingsModal.style.display = 'flex';
        }
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    });

    window.saveSettings = async () => {
        const webhookUrl = document.getElementById('webhook-url').value;
        const saveBtn = document.getElementById('save-settings-btn');

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
            const response = await fetch('/api/v1/auth/settings', {
                method: 'PUT',
                headers: Auth.getHeaders(),
                body: JSON.stringify({ webhookUrl })
            });

            if (response.ok) {
                const data = await response.json();
                // Update local storage with fresh data
                const user = Auth.getUser();
                localStorage.setItem('pulsive_user', JSON.stringify({
                    ...user,
                    webhookUrl: data.user.webhookUrl
                }));
                alert('Settings saved successfully!');
                settingsModal.style.display = 'none';
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Settings';
        }
    };

    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);

    window.copyApiKey = () => {
        const apiKey = document.getElementById('setting-api-key').value;
        navigator.clipboard.writeText(apiKey).then(() => {
            const btn = document.getElementById('copy-api-key-btn');
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btn.innerHTML = originalIcon, 2000);
        });
    };

    document.getElementById('copy-api-key-btn').addEventListener('click', copyApiKey);

    window.regenerateApiKey = async () => {
        if (!confirm('Are you sure? This will immediately invalidate your existing key and any integrations using it.')) {
            return;
        }

        const regenBtn = document.getElementById('regenerate-api-key-btn');
        regenBtn.disabled = true;
        regenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerating...';

        try {
            const response = await fetch('/api/v1/auth/regenerate-api-key', {
                method: 'POST',
                headers: Auth.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('setting-api-key').value = data.apiKey;

                // Update local storage
                const user = Auth.getUser();
                localStorage.setItem('pulsive_user', JSON.stringify({
                    ...user,
                    apiKey: data.apiKey
                }));

                alert('API Key regenerated successfully!');
            } else {
                alert('Failed to regenerate API Key');
            }
        } catch (error) {
            console.error('Error regenerating API key:', error);
        } finally {
            regenBtn.disabled = false;
            regenBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Regenerate';
        }
    };

    document.getElementById('regenerate-api-key-btn').addEventListener('click', regenerateApiKey);

    // Create/Update Post
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('post-id').value;
        const tagsInput = document.getElementById('tags').value;
        const postData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            featuredImage: document.getElementById('featured-image').value,
            tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [],
            excerpt: document.getElementById('excerpt').value,
            content: quill.root.innerHTML,
            status: document.getElementById('status').value,
            metaTitle: document.getElementById('meta-title').value,
            metaDescription: document.getElementById('meta-description').value,
            openGraphImage: document.getElementById('og-image').value
        };

        try {
            let response;
            if (isEditing) {
                response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: Auth.getHeaders(),
                    body: JSON.stringify(postData)
                });
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: Auth.getHeaders(),
                    body: JSON.stringify(postData)
                });
            }

            if (response.ok) {
                postModal.style.display = 'none';
                fetchPosts();
            } else {
                const errData = await response.json();
                alert('Error saving post: ' + (errData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    });

    // Delete Post
    window.deletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: Auth.getHeaders()
            });

            if (response.ok) {
                fetchPosts();
            } else {
                alert('Error deleting post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Edit Post (Fetch single post data)
    window.editPost = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: Auth.getHeaders()
            });
            const post = await response.json();

            isEditing = true;
            modalTitle.textContent = 'Edit Post';
            document.getElementById('post-id').value = post._id;
            document.getElementById('title').value = post.title;
            document.getElementById('author').value = post.author;
            document.getElementById('tags').value = (post.tags || []).join(', ');
            document.getElementById('excerpt').value = post.excerpt || '';
            document.getElementById('featured-image').value = post.featuredImage || '';
            document.getElementById('image-status').textContent = post.featuredImage ? 'Image uploaded' : 'No image selected';
            quill.root.innerHTML = post.content || '';
            document.getElementById('status').value = post.status || 'published';
            document.getElementById('meta-title').value = post.metaTitle || '';
            document.getElementById('meta-description').value = post.metaDescription || '';
            document.getElementById('og-image').value = post.openGraphImage || '';

            postModal.style.display = 'flex';
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    // Copy API URL
    window.copyApiUrl = (slug) => {
        const user = Auth.getUser();
        const apiKeyParam = user && user.apiKey ? `?api_key=${user.apiKey}` : '';
        const fullUrl = `${window.location.origin}/api/v1/posts/${slug}${apiKeyParam}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            alert('Secured API Endpoint copied to clipboard!');
        });
    };

    // Image Upload Handler
    const imageUpload = document.getElementById('image-upload');
    const imageStatus = document.getElementById('image-status');
    const featuredImageInput = document.getElementById('featured-image');

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        imageStatus.textContent = 'Uploading...';
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/v1/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` },
                body: formData
            });
            const data = await response.json();
            if (data.imageUrl) {
                featuredImageInput.value = data.imageUrl;
                imageStatus.textContent = 'Uploaded successfully!';
            } else {
                imageStatus.textContent = 'Upload failed';
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            imageStatus.textContent = 'Upload error';
        }
    });

    // Initial load
    fetchPosts();
});
