import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, Code, Calendar, ExternalLink, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPublicPosts } from '../utils/api';
import { format } from 'date-fns';

export default function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPublic() {
            try {
                const data = await getPublicPosts();
                setPosts(data.posts || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchPublic();
    }, []);

    const handleCTA = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="w-full relative overflow-hidden text-[#e4e4e7] font-sans pb-32">

            {/* Minimal Background Gradients */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay filter blur-[150px] opacity-[0.02] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[200px] opacity-[0.03] pointer-events-none" />

            {/* Hero Section */}
            <div className="text-center max-w-5xl mx-auto mb-32 flex flex-col items-center mt-24 relative z-10 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center mb-8"
                >
                    <span className="px-4 py-1.5 rounded-full border border-[var(--border-light)] bg-[var(--surface)] text-xs font-semibold tracking-wide text-gray-300 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Now completely decoupled.
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-[var(--text-light)] leading-[1.05]"
                >
                    Write your content once. <br className="hidden md:block" />
                    Host it inside your repository.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-[var(--text-main)] mb-12 max-w-3xl leading-relaxed font-normal"
                >
                    Pulsiveblog maps directly to your GitHub via absolute stateless integration. We act as a headless CMS interface for your raw Markdown. No databases, zero vendor lock-in.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
                >
                    <button
                        onClick={handleCTA}
                        className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        Start Writing <ArrowRight size={18} />
                    </button>
                    <a
                        href="#explore"
                        className="w-full sm:w-auto bg-[var(--surface)] border border-[var(--border-light)] hover:border-[var(--border-hover)] text-white px-8 py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        Read the Network
                    </a>
                </motion.div>
            </div>

            {/* Public Community Feed */}
            <div id="explore" className="max-w-7xl mx-auto px-8 relative z-10 pt-20 border-t border-[var(--border-light)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2 text-[var(--text-light)] tracking-tight">Community Broadcasts</h2>
                        <p className="text-[var(--text-main)] text-sm">Real-time markdown parsed across the GitHub user ecosystem.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="structural-panel p-6 h-[220px] animate-pulse" />
                        ))
                    ) : posts.length === 0 ? (
                        <div className="col-span-full py-24 text-center structural-panel border-dashed text-[var(--text-main)]">
                            No external markdown payloads resolved yet.
                        </div>
                    ) : (
                        posts.map((post, idx) => (
                            <motion.div
                                key={`${post.author}-${post.path}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group structural-panel p-6 hover:border-gray-500 transition-colors flex flex-col justify-between h-[220px] bg-[var(--surface)]"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <img src={post.avatar_url} alt={post.author} className="w-8 h-8 rounded-full border border-[var(--border-light)]" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-[var(--text-light)]">{post.author}</span>
                                            <span className="text-xs text-gray-500 font-mono tracking-tight">{post.repo}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-medium leading-snug line-clamp-2 text-white mb-2">
                                        {post.name.replace('.md', '')}
                                    </h3>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-light)]">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={14} /> {format(new Date(), 'MMM dd, yyyy')}
                                    </div>
                                    <a
                                        href={post.html_url}
                                        target="_blank" rel="noreferrer"
                                        className="text-xs font-semibold px-3 py-1.5 bg-white text-black hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1.5"
                                    >
                                        Inspect Source <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Architecture Grid */}
            <div className="mt-40 max-w-7xl mx-auto px-8 relative z-10 pt-20 border-t border-[var(--border-light)]">
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-2 text-[var(--text-light)] tracking-tight">System Infrastructure</h2>
                    <p className="text-[var(--text-main)] text-sm">How the core data logic handles your workflow safely.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-lg border border-[var(--border-light)] bg-[var(--surface)] flex items-center justify-center">
                            <Database size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Zero Vendor Dependency</h3>
                        <p className="text-[var(--text-main)] leading-relaxed text-sm">
                            We use MongoDB solely to store user metadata. Every single word of payload you type is immediately routed to the GitHub repository generated for you on signup.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-lg border border-[var(--border-light)] bg-[var(--surface)] flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Native AES-256</h3>
                        <p className="text-[var(--text-main)] leading-relaxed text-sm">
                            Your Oauth identity logic is passed dynamically through Node Crypto AES-256-GCM arrays before resting anywhere, blocking raw token extraction.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-lg border border-[var(--border-light)] bg-[var(--surface)] flex items-center justify-center">
                            <Code size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Intelligent Formatting</h3>
                        <p className="text-[var(--text-main)] leading-relaxed text-sm">
                            Drag-and-drop imagery parsing automatically intercepts files, triggers base64-encoding natively, and pushes raw buffer objects exactly into your `media/` repository tree.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
