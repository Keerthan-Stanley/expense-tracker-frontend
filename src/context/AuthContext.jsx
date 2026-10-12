import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    // Helper to parse JWT payload if valid
    const parseJwt = (t) => {
        try {
            const base64Url = t.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window
                    .atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const parsed = parseJwt(storedToken);
            if (parsed) {
                const username = parsed.sub || parsed.username || parsed.email || 'User';
                setUser({ username, ...parsed });
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        // Support various backend token response keys
        const receivedToken =
            typeof data === 'string'
                ? data
                : data?.token || data?.jwt || data?.accessToken || data?.data?.token;

        if (!receivedToken) {
            throw new Error('No token received from backend');
        }

        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);

        // Extract user info
        const parsedPayload = parseJwt(receivedToken);
        const userInfo = {
            username:
                data?.username ||
                data?.user?.username ||
                parsedPayload?.sub ||
                parsedPayload?.username ||
                credentials.username ||
                'User',
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);

        return data;
    };

    const register = async (userData) => {
        const data = await authApi.register(userData);
        // If backend auto-logs in and returns a token upon registration
        const receivedToken =
            typeof data === 'string'
                ? data
                : data?.token || data?.jwt || data?.accessToken;

        if (receivedToken) {
            localStorage.setItem('token', receivedToken);
            setToken(receivedToken);
            const userInfo = {
                username: data?.username || userData.username || 'User',
            };
            localStorage.setItem('user', JSON.stringify(userInfo));
            setUser(userInfo);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
