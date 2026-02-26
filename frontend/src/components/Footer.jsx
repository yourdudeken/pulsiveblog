import { Link } from 'react-router-dom';
import { TerminalSquare, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full relative z-10 border-t border-white/10 mt-auto bg-[#0a0c10] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 group w-max">
                            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <TerminalSquare size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
                                Pulsive<span className="text-[var(--primary)]">blog</span>
                            </span>
                        </Link>
                        <p className="text-[var(--text-main)] text-sm mb-6 max-w-sm leading-relaxed">
                            A production-ready headless CMS architecture running entirely on Git. Stop relying on corporate localized databases to host your thoughts. Own your markdown natively.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/yourdudeken" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2]/20 transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0077b5]/20 transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#explore" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Community Feed</a></li>
                            <li><a href="https://github.com/yourdudeken/pulsiveblog" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Source Code</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Documentation (WIP)</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">API Reference</a></li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/login" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Dashboard Login</Link></li>
                            <li><a href="#" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Terms of Service</a></li>
                            <li><a href="https://github.com/settings/apps/authorizations" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors">Manage Auth</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--text-main)] text-sm flex items-center gap-2">
                        Copyright {new Date().getFullYear()} Pulsive Ecosystem. Built with <Heart size={14} className="text-red-500 fill-red-500" /> by yourdudeken.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-gray-400 font-mono">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
