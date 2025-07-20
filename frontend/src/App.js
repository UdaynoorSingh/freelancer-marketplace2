import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import SearchResults from './pages/SearchResults';
import CreateGig from './pages/CreateGig';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { MdStar, MdFavoriteBorder } from 'react-icons/md';

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

const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    padding: 0,
    margin: '1rem 0',
    maxWidth: 320,
    minWidth: 260,
    flex: '1 1 260px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
};
const imageStyle = {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    background: '#f5f5f5',
};
const sellerRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    margin: '1rem 0 0.5rem 0',
};
const avatar = {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#f7931e',
    color: '#fff',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
};
const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '2rem',
};
const priceStyle = {
    color: '#222',
    fontWeight: 700,
    fontSize: '1.1rem',
};
const fromStyle = {
    color: '#555',
    fontSize: '0.95rem',
    marginRight: 4,
};
const favBtn = {
    position: 'absolute',
    top: 12,
    right: 12,
    background: '#fff',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
};

const Home = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/search`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setGigs(data);
                } else {
                    setError(data.message || 'No gigs found.');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch gigs.');
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && gigs.length === 0 && <p>No gigs found.</p>}
            <div style={gridStyle}>
                {gigs.map(service => {
                    const reviewCount = service.reviews ? service.reviews.length : 0;
                    const avgRating = reviewCount > 0
                        ? (service.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
                        : (service.rating || 4.9);
                    return (
                        <div key={service._id} style={cardStyle}>
                            <button style={favBtn}><MdFavoriteBorder size={20} color="#404145" /></button>
                            <img
                                src={service.image ? `${process.env.REACT_APP_SERVER_URL}/uploads/${service.image}` : 'https://via.placeholder.com/320x180?text=No+Image'}
                                alt={service.title}
                                style={imageStyle}
                            />
                            <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={sellerRow}>
                                    <div style={avatar}>{service.seller?.username ? service.seller.username[0].toUpperCase() : 'U'}</div>
                                    <span style={{ color: '#222', fontWeight: 600 }}>{service.seller?.username || 'Unknown'}</span>
                                    <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 'auto' }}>Level 1 ◆◆</span>
                                </div>
                                <div style={{ color: '#222', fontWeight: 500, fontSize: '1.08rem', marginBottom: 6 }}>{service.title}</div>
                                <div style={{ color: '#555', fontSize: '0.98rem', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{service.description}</div>
                                <div style={{ margin: '0.5rem 0', color: '#1dbf73', fontWeight: 500 }}>
                                    {service.tags && service.tags.map(tag => (
                                        <span key={tag} style={{ marginRight: 8, fontSize: '0.95rem', background: '#f5f5f5', borderRadius: 6, padding: '2px 8px' }}>#{tag}</span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                                    <MdStar color="#f7931e" size={18} />
                                    <span style={{ color: '#222', fontWeight: 600, marginLeft: 4 }}>{avgRating}</span>
                                    <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 4 }}>({reviewCount})</span>
                                    <span style={{ marginLeft: 'auto', ...fromStyle }}>From</span>
                                    <span style={priceStyle}>₹{service.price}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
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

function ProtectedLayout({ children }) {
    return (
        <>
            <Navbar />
            <CategoryBar />
            {children}
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <Home />
                            </ProtectedLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <SearchResults />
                            </ProtectedLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/create-gig" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <CreateGig />
                            </ProtectedLayout>
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