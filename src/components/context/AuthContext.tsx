import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '../../types';

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

import setAuthToken from '../../utils/setAuthToken';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setAuthToken(token);
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setAuthToken('');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('user', '');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
