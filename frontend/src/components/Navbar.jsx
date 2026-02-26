import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Github, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Community Feed', path: '/#explore' },
        { name: 'Documentation', path: 'https://github.com/yourdudeken/pulsiveblog' },
    ];

    return (
        <header
            className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[rgba(0,0,0,0.85)] backdrop-blur-md border-[var(--border-light)]' : 'bg-transparent border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white p-1 rounded-sm group-hover:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 17 10 11 4 5"></polyline>
                            <line x1="12" y1="19" x2="20" y2="19"></line>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white flex items-baseline">
                        Pulsiveblog
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                                {link.name} {link.path.startsWith('http') && <ArrowUpRight size={14} className="opacity-50" />}
                            </a>
                        ))}
                    </div>

                    <div className="h-5 w-px bg-[var(--border-light)]"></div>

                    <div className="flex items-center gap-4">
                        {!loading && user ? (
                            <Link
                                to="/dashboard"
                                className="bg-[var(--surface)] hover:bg-[#222222] border border-[var(--border-light)] px-4 py-1.5 rounded-md text-sm font-semibold transition-all text-white flex items-center gap-2"
                            >
                                <img src={`https://github.com/${user.username}.png`} alt="avatar" className="w-4 h-4 rounded-full" />
                                Dashboard
                            </Link>
                        ) : (
                            !loading && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-white hover:bg-gray-200 text-black px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2"
                                >
                                    Login
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
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[var(--background)] border-b border-[var(--border-light)] py-4 px-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className="text-lg font-medium text-gray-300 hover:text-white transition-colors border-b border-[var(--border-light)] pb-2 flex items-center gap-2"
                        >
                            {link.name} {link.path.startsWith('http') && <ArrowUpRight size={16} className="opacity-50" />}
                        </a>
                    ))}
                    {!loading && user ? (
                        <Link
                            to="/dashboard"
                            className="text-lg font-medium text-white transition-colors pt-2 flex items-center gap-2"
                        >
                            <img src={`https://github.com/${user.username}.png`} alt="avatar" className="w-6 h-6 rounded-full" />
                            Go to Dashboard
                        </Link>
                    ) : (
                        !loading && (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-white text-black mt-2 py-3 rounded-md text-md font-bold flex justify-center items-center gap-2 w-full"
                            >
                                <Github size={20} /> Sign in
                            </button>
                        )
                    )}
                </div>
            )}
        </header>
    );
}
