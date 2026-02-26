import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { listPosts, deletePost } from '../utils/api';
import Editor from '../components/Editor';
import { Plus, Search, SquarePen, Trash2, Github, ExternalLink, Calendar, FileText } from 'lucide-react';
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
        if (!confirm('Permanently delete this Markdown file from GitHub?')) return;
        try {
            await deletePost(path);
            fetchPosts();
        } catch (err) {
            alert('Failed to delete resource');
        }
    };

    const handleEdit = (post) => {
        setEditingPost({ ...post, title: post.name.replace('.md', ''), content: 'Loading physical bytes from GitHub...', tags: [] });
    };

    const handleSaveSuccess = () => {
        setIsCreating(false);
        setEditingPost(null);
        fetchPosts();
    };

    const filteredPosts = posts.filter(pos => pos.name.toLowerCase().includes(search.toLowerCase()));

    if (isCreating || editingPost) {
        return (
            <div className="w-full max-w-7xl mx-auto flex flex-col pt-8 px-6 lg:px-8 pb-16">
                <div className="flex justify-between items-center mb-8 border-b border-[var(--border-light)] pb-4">
                    <h1 className="text-xl font-bold text-white flex items-center gap-3">
                        <SquarePen size={20} className="text-[var(--accent)]" />
                        {isCreating ? 'Initialize New Payload' : `Modifying Resource: ${editingPost.name}`}
                    </h1>
                    <button
                        onClick={() => { setIsCreating(false); setEditingPost(null); }}
                        className="text-[var(--text-main)] hover:text-white transition-colors text-sm font-semibold px-4 py-2 border border-[var(--border-light)] rounded-md hover:border-gray-500"
                    >
                        Abort
                    </button>
                </div>
                <Editor initialPost={editingPost} onSaveSuccess={handleSaveSuccess} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col pt-8 px-6 lg:px-8 pb-32">
            {/* Header Profile Infrastructure */}
            <div className="structural-panel p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <img src={`https://github.com/${user.username}.png`} alt="avatar" className="w-16 h-16 rounded-full border-2 border-[var(--border-light)] shadow-sm" />
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            {user.username}
                        </h1>
                        <p className="text-[var(--text-main)] flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Connected to <strong className="font-mono bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">{user.repo_name}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <a
                        href={`https://github.com/${user.username}/${user.repo_name}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 bg-[var(--surface)] hover:bg-[#222222] border border-[var(--border-light)] hover:border-gray-500 px-4 py-2 rounded-md font-medium transition-all text-sm text-white"
                    >
                        <ExternalLink size={16} /> Repository
                    </a>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-950/30 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-4 py-2 rounded-md font-medium transition-all text-sm"
                    >
                        Disconnect
                    </button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3 tracking-tight">
                    Repository Contents <span className="bg-[var(--surface)] border border-[var(--border-light)] text-[var(--text-main)] text-xs py-0.5 px-2.5 rounded-full font-mono">{posts.length}</span>
                </h2>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search filesystem..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[var(--surface)] border border-[var(--border-light)] rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gray-400 transition-colors text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                    >
                        <Plus size={16} strokeWidth={3} /> Inject File
                    </button>
                </div>
            </div>

            {/* Content Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="structural-panel p-6 h-48 animate-pulse bg-[var(--surface)]" />
                    ))
                ) : filteredPosts.length === 0 ? (
                    <div className="col-span-full py-20 text-center structural-panel border-dashed border-gray-700 bg-[var(--background)]">
                        <FileText size={32} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-400 text-sm font-medium">No Markdown files found in the target repository directory.</p>
                    </div>
                ) : (
                    filteredPosts.map((post, idx) => (
                        <motion.div
                            key={post.path}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group structural-panel bg-[var(--surface)] hover:bg-[#151515] hover:border-gray-500 transition-colors flex flex-col justify-between h-48"
                        >
                            <div className="p-5 flex-1">
                                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white leading-tight">
                                    {post.name.replace('.md', '')}
                                </h3>

                                <div className="flex items-center gap-3 text-xs text-[#a1a1aa] font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={12} /> {format(new Date(post.last_modified || Date.now()), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>

                            <div className="px-5 py-3 border-t border-[var(--border-light)] bg-black/20 flex justify-between items-center rounded-b-xl">
                                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                                    <Github size={10} /> {post.path}
                                </span>

                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(post)} className="p-1.5 text-gray-400 hover:text-white hover:bg-[var(--border-light)] rounded transition-colors" title="Modify File">
                                        <SquarePen size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(post.path)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors" title="Purge File">
                                        <Trash2 size={14} />
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
