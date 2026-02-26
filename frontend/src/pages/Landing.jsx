import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Shield, Zap, Code, Github, Calendar, ExternalLink } from 'lucide-react';
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
        <div className="w-full relative overflow-hidden text-white font-sans selection:bg-[var(--primary)] selection:text-white pb-32">

            {/* Background Decorators */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-32 flex flex-col items-center mt-20 relative z-10 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-8 backdrop-blur-md"
                >
                    <Zap size={16} /> <span>Now running entirely on Git</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]"
                >
                    The Content Platform <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]">
                        Powered by GitHub.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-2xl text-[var(--text-main)] mb-12 max-w-2xl leading-relaxed font-light"
                >
                    Stop storing your blog posts in corporate databases. Pulsiveblog uses GitHub as a headless CMS, committing your data natively into your own repository.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
                >
                    <button
                        onClick={handleCTA}
                        className="w-full sm:w-auto bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--background)] px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(162,119,255,0.4)]"
                    >
                        Get Started Free <ArrowRight size={20} />
                    </button>
                    <a
                        href="#explore"
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 glass-panel hover:bg-white/10 transition-colors border border-white/10"
                    >
                        Read Blogs
                    </a>
                </motion.div>
            </div>

            {/* Public Community Feed */}
            <div id="explore" className="max-w-7xl mx-auto px-8 relative z-10 pt-20 border-t border-white/10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-[var(--text-light)]">Community Feed</h2>
                        <p className="text-[var(--text-main)]">Explore recent markdown posts authored by the network.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl h-64 animate-pulse bg-[rgba(36,40,59,0.3)]" />
                        ))
                    ) : posts.length === 0 ? (
                        <div className="col-span-full py-20 text-center glass-panel rounded-[2rem] border-dashed border-2 border-white/10">
                            <p className="text-gray-400 text-lg">No posts on the network yet.</p>
                        </div>
                    ) : (
                        posts.map((post, idx) => (
                            <motion.div
                                key={`${post.author}-${post.path}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group glass-panel rounded-2xl p-6 hover:border-[rgba(255,255,255,0.2)] hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-between h-64 relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--primary)] opacity-5 blur-3xl rounded-full" />

                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <img src={post.avatar_url} alt={post.author} className="w-8 h-8 rounded-full border border-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[var(--text-light)]">{post.author}</span>
                                            <span className="text-xs text-gray-500 font-mono">{post.repo}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 text-white">
                                        {post.name.replace('.md', '')}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {format(new Date(), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                                    <a
                                        href={post.html_url}
                                        target="_blank" rel="noreferrer"
                                        className="text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-[var(--secondary)]"
                                    >
                                        Read on GitHub <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Feature Grid */}
            <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-8 relative z-10">
                <div className="glass-panel p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center mb-6">
                        <Database className="text-[var(--primary)]" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Zero Vendor Lock-In</h3>
                    <p className="text-[var(--text-main)] leading-relaxed text-sm">
                        Your markdown output and encoded image files bypass localized databases. Everything lives directly in a dynamically generated repository that you permanently own.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--secondary)]/20 flex items-center justify-center mb-6">
                        <Shield className="text-[var(--secondary)]" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">AES-256 Secured</h3>
                    <p className="text-[var(--text-main)] leading-relaxed text-sm">
                        Extremely strict platform permissions. GitHub Tokens are injected statically via AES-256-GCM encryption buffers native to Node's Crypto lib before even hitting MongoDB.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mb-6">
                        <Code className="text-[var(--accent)]" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Rich Markdown</h3>
                    <p className="text-[var(--text-main)] leading-relaxed text-sm">
                        Clean writing experience. Drag-and-drop imagery parsing that automatically base64-encodes media and commits it into a dedicated `media/` folder in your repo.
                    </p>
                </div>
            </div>
        </div>
    );
}
