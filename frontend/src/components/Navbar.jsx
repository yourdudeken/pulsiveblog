import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Github, Menu, X, TerminalSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/#explore' },
    ];

    return (
        <header
            className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[rgba(15,18,25,0.85)] backdrop-blur-md border-b border-white/10 shadow-lg py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-2 rounded-xl group-hover:shadow-[0_0_20px_rgba(162,119,255,0.4)] transition-all">
                        <TerminalSquare size={22} className="text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
                        Pulsive<span className="text-[var(--primary)]">blog</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-white/10"></div>

                    <div className="flex items-center gap-4">
                        {!loading && user ? (
                            <Link
                                to="/dashboard"
                                className="bg-white/10 hover:bg-white/20 border border-white/5 px-5 py-2 rounded-xl text-sm font-semibold transition-all text-white flex items-center gap-2"
                            >
                                <img src={`https://github.com/${user.username}.png`} alt="avatar" className="w-5 h-5 rounded-full" />
                                Dashboard
                            </Link>
                        ) : (
                            !loading && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-90 px-6 py-2 rounded-xl text-sm font-bold transition-all text-white flex items-center gap-2 shadow-[0_0_15px_rgba(162,119,255,0.3)]"
                                >
                                    <Github size={16} /> Sign In
                                </button>
                            )
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#0f1219] border-b border-white/10 shadow-2xl py-4 px-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className="text-lg font-medium text-gray-300 hover:text-white transition-colors border-b border-white/5 pb-2"
                        >
                            {link.name}
                        </a>
                    ))}
                    {!loading && user ? (
                        <Link
                            to="/dashboard"
                            className="text-lg font-medium text-[var(--primary)] transition-colors pt-2"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        !loading && (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mt-2 py-3 rounded-xl text-md font-bold text-white flex justify-center items-center gap-2 w-full"
                            >
                                <Github size={20} /> Sign in with GitHub
                            </button>
                        )
                    )}
                </div>
            )}
        </header>
    );
}
