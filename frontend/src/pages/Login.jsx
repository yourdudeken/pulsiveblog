import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Github, Database, Shield, Zap } from 'lucide-react';

export default function Login() {
    const { loginWithGithub } = useAuth();

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-[var(--background)] p-4 flex-1 my-auto">
            {/* Dynamic Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-blob animation-delay-4000" />

            {/* Main Login Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass-panel max-w-lg w-full rounded-[2.5rem] p-10 md:p-14 relative z-10 shadow-2xl border border-white/10"
            >
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur opacity-30" />
                        <div className="relative bg-[var(--background)] p-4 rounded-xl border border-white/10">
                            <Github size={48} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-light)] via-[var(--primary)] to-[var(--secondary)]">
                        Pulsiveblog
                    </h1>
                    <p className="text-[var(--text-main)] text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
                        The Git-Powered Platform. Your content lives natively in your own GitHub repository.
                    </p>
                </div>

                <button
                    onClick={loginWithGithub}
                    className="w-full relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <div className="relative w-full flex items-center justify-center gap-3 bg-[var(--background)] border border-white/20 py-4 px-8 rounded-2xl leading-none flex items-center divide-x divide-gray-600">
                        <span className="flex items-center space-x-3 text-white font-bold text-lg">
                            <Github size={24} />
                            <span>Continue with GitHub</span>
                        </span>
                        <span className="pl-4 text-[var(--secondary)] group-hover:text-white transition duration-200 text-sm font-semibold tracking-wider uppercase">
                            Secure
                        </span>
                    </div>
                </button>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col items-center text-center gap-2 p-3">
                        <Database size={20} className="text-[var(--primary)]" />
                        <span className="text-xs text-[var(--text-main)] font-semibold">Zero Vendor Lock-In</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-3">
                        <Shield size={20} className="text-[var(--secondary)]" />
                        <span className="text-xs text-[var(--text-main)] font-semibold">AES-256 Secured</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-3">
                        <Zap size={20} className="text-[var(--accent)]" />
                        <span className="text-xs text-[var(--text-main)] font-semibold">Octokit Fast</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-pink-400">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span className="text-xs text-[var(--text-main)] font-semibold">Own Your Data</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
