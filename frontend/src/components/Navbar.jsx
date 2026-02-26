import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="w-full relative z-20 py-4 px-8 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-md sticky top-0">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] p-2 rounded-xl">
                        <Github size={24} className="text-[var(--background)]" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--text-light)]">Pulsiveblog</span>
                </Link>

                <div className="flex gap-4 items-center">
                    {!loading && user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-[var(--text-main)] hover:text-white transition-colors text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        !loading && (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            >
                                Log In
                            </button>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}
