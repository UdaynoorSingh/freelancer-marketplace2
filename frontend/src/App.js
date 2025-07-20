import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const homeContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1dbf73 0%, #f7f7f7 100%)',
};
const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1dbf73',
    marginBottom: '2rem',
    textAlign: 'center',
};
const buttonRow = {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
};
const buttonStyle = {
    padding: '0.75rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
};
const registerBtn = {
    ...buttonStyle,
    background: '#1dbf73',
    color: '#fff',
};
const loginBtn = {
    ...buttonStyle,
    background: '#fff',
    color: '#1dbf73',
    border: '2px solid #1dbf73',
};
const logoutBtn = {
    ...buttonStyle,
    background: '#e53e3e',
    color: '#fff',
    marginTop: '1rem',
};

const Home = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div style={homeContainer}>
            <h1 style={titleStyle}>Welcome to Fiverr Clone</h1>
            <div style={buttonRow}>
                <Link to="/register" style={registerBtn} onMouseOver={e => e.target.style.background = '#169c5f'} onMouseOut={e => e.target.style.background = '#1dbf73'}>Register</Link>
                <Link to="/login" style={loginBtn} onMouseOver={e => { e.target.style.background = '#1dbf73'; e.target.style.color = '#fff'; }} onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = '#1dbf73'; }}>Login</Link>
            </div>
            {user && (
                <button style={logoutBtn} onClick={handleLogout} onMouseOver={e => e.target.style.background = '#c53030'} onMouseOut={e => e.target.style.background = '#e53e3e'}>
                    Logout
                </button>
            )}
        </div>
    );
};

// PublicRoute: Only accessible if NOT logged in
const PublicRoute = ({ children }) => {
    const { user, token } = useAuth();
    if (user && token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } />
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App; 