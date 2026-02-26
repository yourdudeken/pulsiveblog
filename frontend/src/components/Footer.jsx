import { Infinity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full relative z-10 border-t border-white/10 mt-auto bg-black/40">
            <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Infinity size={14} className="text-black" />
                    </div>
                    <span className="font-bold text-[var(--text-light)]">Pulsiveblog Ecosystem</span>
                </Link>

                <div className="flex gap-6 text-sm text-[var(--text-main)] font-medium">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <a href="https://github.com/yourdudeken/pulsiveblog" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Source Code</a>
                    <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                </div>

                <p className="text-[var(--text-main)] text-sm">
                    © {new Date().getFullYear()} Pulsiveblog. True data ownership.
                </p>
            </div>
        </footer>
    );
}
