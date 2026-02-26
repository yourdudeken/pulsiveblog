import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Github, Database, Shield, Zap, Cloud, Code, Terminal, Infinity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCTA = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden text-white font-sans selection:bg-[var(--primary)] selection:text-white">

            {/* Background Decorators */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

            {/* Navigation */}
            <nav className="w-full relative z-20 py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] p-2 rounded-xl">
                        <Github size={24} className="text-[var(--background)]" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--text-light)]">Pulsiveblog</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleCTA} className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                        {user ? 'Go to Dashboard' : 'Log In'}
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-32 flex flex-col items-center">
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
                            href="#features"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 glass-panel hover:bg-white/10 transition-colors border border-white/10"
                        >
                            Explore Features
                        </a>
                    </motion.div>
                </div>

                {/* Floating UI Mockups */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="relative w-full aspect-[21/9] max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] z-10" />

                    <div className="absolute inset-0 glass-panel bg-[rgba(36,40,59,0.8)] z-0 rounded-[2rem]">
                        {/* Mock Header */}
                        <div className="w-full h-12 border-b border-white/10 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <div className="mx-auto bg-black/40 px-4 py-1 text-xs text-gray-500 rounded-md font-mono flex items-center gap-2">
                                <Github size={12} /> yourusername/yourusername-blog
                            </div>
                        </div>
                        {/* Mock Body */}
                        <div className="p-8 flex gap-8 h-full">
                            <div className="w-1/4 flex flex-col gap-4">
                                <div className="h-4 w-3/4 bg-white/10 rounded" />
                                <div className="h-4 w-1/2 bg-white/10 rounded mt-4" />
                                <div className="h-8 w-full bg-[var(--primary)]/20 rounded mt-4 border border-[var(--primary)]/30" />
                                <div className="h-4 w-5/6 bg-white/5 rounded mt-4" />
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="w-full h-12 bg-white/5 rounded-xl border border-white/10" />
                                <div className="w-full flex-1 bg-black/30 rounded-xl border border-white/5 p-6 font-mono text-sm text-gray-500">
                                    ---<br />
                                    title: "Why GitHub makes the best CMS"<br />
                                    date: "2026-10-12"<br />
                                    ---<br /><br />
                                    <span className="text-[var(--primary)]"># Welcome to the future</span><br /><br />
                                    Your markdown lives seamlessly.
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div id="features" className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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

            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 mt-20 bg-black/40">
                <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                            <Infinity size={14} className="text-black" />
                        </div>
                        <span className="font-bold text-[var(--text-light)]">Pulsiveblog Ecosystem</span>
                    </div>
                    <p className="text-[var(--text-main)] text-sm">
                        © {new Date().getFullYear()} Pulsiveblog. An open-source experiment in true data ownership.
                    </p>
                </div>
            </footer>
        </div>
    );
}
