import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Github, Database, Shield, Zap } from 'lucide-react';

export default function Login() {
    const { loginWithGithub } = useAuth();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--background)] p-4 flex-1 my-auto">
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

            {/* Main Login Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full structural-panel p-10 relative z-10 shadow-2xl bg-[var(--surface)]"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-[var(--border-light)] transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
                        <Github size={32} className="text-black" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">
                        Access Pulsiveblog
                    </h1>
                    <p className="text-[var(--text-main)] text-sm leading-relaxed max-w-sm mx-auto">
                        Authenticate securely via GitHub to access or initialize your Git-powered blogging environment.
                    </p>
                </div>

                <button
                    onClick={loginWithGithub}
                    className="w-full py-3 px-4 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                    <Github size={20} />
                    Continue with GitHub
                </button>

                {/* Feature Tags */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-4 pt-6 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Database size={14} className="text-gray-300" />
                        <span>No Vendor Lock-In</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Shield size={14} className="text-gray-300" />
                        <span>AES-256 Secured</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Zap size={14} className="text-gray-300" />
                        <span>Octokit Fast</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-300">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span>Own Your Data</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
