import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-[var(--border-light)] mt-auto bg-[var(--background)] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 group w-max">
                            <span className="text-xl font-bold tracking-tight text-white flex items-baseline border-b-2 border-transparent group-hover:border-white transition-all">
                                Pulsiveblog
                            </span>
                        </Link>
                        <p className="text-[#a1a1aa] text-sm mb-6 max-w-sm leading-relaxed">
                            A production-ready headless CMS architecture running entirely on Git. Stop relying on corporate localized databases to host your thoughts. Own your markdown natively.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/yourdudeken" target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-white transition-colors">
                                <Github size={18} />
                            </a>
                            <a href="#" className="text-[#a1a1aa] hover:text-white transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="text-[#a1a1aa] hover:text-white transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-medium mb-6 text-sm tracking-wide uppercase">Resources</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="#explore" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Community Feed</a></li>
                            <li><a href="https://github.com/yourdudeken/pulsiveblog" target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Source Code</a></li>
                            <li><a href="#" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-white font-medium mb-6 text-sm tracking-wide uppercase">Platform</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/login" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Client Login</Link></li>
                            <li><a href="#" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Privacy</a></li>
                            <li><a href="#" className="text-[#a1a1aa] hover:text-white text-sm transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-[var(--border-light)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#a1a1aa] text-xs flex items-center gap-2">
                        Copyright {new Date().getFullYear()} Pulsiveblog Ecosystem. Built by yourdudeken.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-[#a1a1aa] font-medium tracking-wide">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
