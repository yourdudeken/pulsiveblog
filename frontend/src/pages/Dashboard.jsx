import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { listPosts, deletePost } from '../utils/api';
import Editor from '../components/Editor';
import { PlusCircle, Search, Edit3, Trash2, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [search, setSearch] = useState('');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await listPosts();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (path) => {
        if (!confirm('Are you sure you want to delete this post from GitHub?')) return;
        try {
            await deletePost(path);
            fetchPosts();
        } catch (err) {
            alert('Failed to delete post');
        }
    };

    const handleEdit = (post) => {
        // A full implementation would fetch the post content here.
        // For now, we simulate opening the editor with the bare minimum info.
        setEditingPost({ ...post, title: post.name.replace('.md', ''), content: 'Loading content from GitHub...', tags: [] });
    };

    const handleSaveSuccess = () => {
        setIsCreating(false);
        setEditingPost(null);
        fetchPosts();
    };

    const filteredPosts = posts.filter(pos => pos.name.toLowerCase().includes(search.toLowerCase()));

    if (isCreating || editingPost) {
        return (
            <div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-6">
                <div className="flex justify-between items-center glass-panel px-6 py-4 rounded-2xl">
                    <h1 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                        <Edit3 size={20} />
                        {isCreating ? 'Create New Post' : `Editing: ${editingPost.name}`}
                    </h1>
                    <button
                        onClick={() => { setIsCreating(false); setEditingPost(null); }}
                        className="text-gray-400 hover:text-white transition-colors text-sm font-semibold tracking-wider uppercase"
                    >
                        Cancel
                    </button>
                </div>
                <Editor initialPost={editingPost} onSaveSuccess={handleSaveSuccess} />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-10">
            {/* Header Profile Card */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-2 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] h-full" />
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl">
                        <Github size={40} className="text-[var(--text-light)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--text-light)]">
                            {user.username}'s Platform
                        </h1>
                        <p className="text-[var(--secondary)] flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
                            Connected to <strong>{user.repo_name}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 z-10">
                    <a
                        href={`https://github.com/${user.username}/${user.repo_name}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-white/10 px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
                    >
                        <ExternalLink size={16} /> View Repo
                    </a>
                    <button
                        onClick={logout}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
                    >
                        Logout
                    </button>
                </div>
            </motion.div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    Your Posts <span className="bg-white/10 text-sm py-1 px-3 rounded-full">{posts.length}</span>
                </h2>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[rgba(36,40,59,0.4)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[var(--primary)] transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--background)] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        <PlusCircle size={18} /> New Post
                    </button>
                </div>
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl h-40 animate-pulse bg-[rgba(36,40,59,0.3)]" />
                    ))
                ) : filteredPosts.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-panel rounded-[2rem] border-dashed border-2 border-white/10">
                        <p className="text-gray-400 text-lg">No markdown posts found in repository.</p>
                    </div>
                ) : (
                    filteredPosts.map((post, idx) => (
                        <motion.div
                            key={post.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group glass-panel rounded-2xl p-6 hover:border-[rgba(255,255,255,0.2)] hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-between h-56 relative overflow-hidden"
                        >
                            <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--primary)] opacity-5 blur-3xl rounded-full" />

                            <div>
                                <h3 className="text-xl font-bold mb-3 line-clamp-2 text-[var(--text-light)]">
                                    {post.name.replace('.md', '')}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-1 bg-white/5 py-1 px-2 rounded border border-white/5">
                                        <Calendar size={12} /> {format(new Date(post.last_modified || Date.now()), 'MMM dd, yyyy')}
                                    </span>
                                    <span className="flex items-center gap-1 bg-white/5 py-1 px-2 rounded border border-white/5">
                                        <Tag size={12} /> MD
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                                <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-1 rounded truncate max-w-[120px]">
                                    {post.path}
                                </span>

                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(post)} className="p-2 bg-[var(--surface)] text-[var(--secondary)] hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors border border-white/5">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(post.path)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/10">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
