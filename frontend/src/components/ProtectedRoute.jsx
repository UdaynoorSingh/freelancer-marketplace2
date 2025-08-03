////////////////////////
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

const ProtectedRoute = ({ children }) => {
    const { user, token, logout } = useAuth();

    if (!user || !token || isTokenExpired(token)) {
        if (token && isTokenExpired(token)) logout();
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute; 