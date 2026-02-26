import { useState, useEffect, createContext, useContext } from 'react';
import { getAuthMe, logout as apiLogout } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const data = await getAuthMe();
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGithub = () => {
        window.location.href = 'http://localhost:8080/api/auth/github';
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGithub, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
