import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import SearchResults from './pages/SearchResults';
import CreateGig from './pages/CreateGig';
import EditGig from './pages/EditGig';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { MdStar, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import GigDetails from './pages/GigDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import Favorites from './pages/Favorites';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';

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
    height: 440, // Fixed height for all cards
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
    justifyContent: 'center',
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

const viewBtn = {
    background: '#1dbf73',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    width: '100%',
    textAlign: 'center',
    transition: 'background-color 0.2s',
};

const btnRow = {
    display: 'flex',
    gap: '0.8rem',
    marginTop: 'auto', // Push button to bottom
    paddingTop: '1rem',
    width: '100%',
};

const descriptionStyle = {
    color: '#555',
    fontSize: '0.98rem',
    marginBottom: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
    maxHeight: '1.4em', // 1 line * 1.4 line height
};

// Add responsive styles
const responsiveStyles = `
    @media (max-width: 1200px) {
      .gig-grid {
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .gig-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0 1rem;
      }
      
      .gig-card {
        max-width: 100%;
        min-width: auto;
        height: auto;
        min-height: 400px;
      }
      
      .container {
        padding: 1rem;
      }
      
      .header {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      
      .header h1 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }
      
      .header p {
        font-size: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .gig-grid {
        padding: 0 0.5rem;
        gap: 0.8rem;
      }
      
      .gig-card {
        min-height: 380px;
      }
      
      .container {
        padding: 0.5rem;
      }
      
      .header h1 {
        font-size: 1.5rem;
      }
      
      .header p {
        font-size: 0.9rem;
      }
    }
    
    @media (max-width: 360px) {
      .gig-grid {
        padding: 0 0.3rem;
        gap: 0.6rem;
      }
      
      .gig-card {
        min-height: 360px;
      }
    }
  `;

const Home = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState(new Set());

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

    // Fetch user's favorites
    useEffect(() => {
        if (token) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setFavorites(new Set(data.map(fav => fav._id)));
                    }
                })
                .catch(err => console.error('Error fetching favorites:', err));
        }
    }, [token]);

    const handleToggleFavorite = async (serviceId) => {
        try {
            if (favorites.has(serviceId)) {
                // Remove from favorites
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites/remove/${serviceId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    setFavorites(prev => {
                        const newFavorites = new Set(prev);
                        newFavorites.delete(serviceId);
                        return newFavorites;
                    });
                    // Trigger navbar favorites count update
                    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
                }
            } else {
                // Add to favorites
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ serviceId })
                });
                if (response.ok) {
                    setFavorites(prev => new Set([...prev, serviceId]));
                    // Trigger navbar favorites count update
                    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
                }
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }} className="container">
            <style>{responsiveStyles}</style>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: '#666' }}>Loading...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#e53e3e', fontSize: '1.1rem' }}>{error}</div>
            ) : (
                <div style={gridStyle} className="gig-grid">
                    {gigs.map((gig) => (
                        <div key={gig._id} style={cardStyle} className="gig-card">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={
                                        gig.images && gig.images.length > 0
                                            ? `${process.env.REACT_APP_SERVER_URL}/uploads/${gig.images[0]}`
                                            : 'https://via.placeholder.com/300x200?text=No+Image'
                                    }
                                    alt={gig.title}
                                    style={imageStyle}
                                />
                                {token && (
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            background: favorites.has(gig._id) ? '#e53e3e' : '#fff',
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
                                        }}
                                        onClick={() => handleToggleFavorite(gig._id)}
                                        title={favorites.has(gig._id) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        {favorites.has(gig._id) ? <MdFavorite size={20} color="#fff" /> : <MdFavoriteBorder size={20} color="#404145" />}
                                    </button>
                                )}
                            </div>
                            <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={sellerRow}>
                                        <div style={avatar}>{gig.seller?.username?.[0]?.toUpperCase() || 'U'}</div>
                                        <span style={{ color: '#222', fontWeight: 600 }}>{gig.seller?.username || 'Unknown'}</span>
                                        <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 'auto' }}>Level 1 ◆◆</span>
                                    </div>
                                    <div style={{ color: '#222', fontWeight: 500, fontSize: '1.08rem', marginBottom: 6 }}>{gig.title}</div>
                                    <div style={descriptionStyle}>{gig.description}</div>
                                    {gig.tags && gig.tags.length > 0 && (
                                        <div style={{ marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                            {gig.tags.slice(0, 3).map(tag => (
                                                <span key={tag} style={{
                                                    fontSize: '0.85rem',
                                                    background: '#1dbf73',
                                                    color: '#fff',
                                                    borderRadius: 6,
                                                    padding: '0.2rem 0.5rem',
                                                    fontWeight: 500
                                                }}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <MdStar color="#f7931e" size={16} />
                                        <span style={{ color: '#222', fontWeight: 600, marginLeft: 4, fontSize: '0.9rem' }}>
                                            {gig.avgRating || '0.0'}
                                        </span>
                                        <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: 4 }}>
                                            ({gig.reviewCount || 0})
                                        </span>
                                    </div>
                                    <div style={{ margin: '0.5rem 0', color: '#1dbf73', fontWeight: 500 }}>
                                        <span style={fromStyle}>from</span>
                                        <span style={priceStyle}>${gig.price}</span>
                                    </div>
                                </div>
                                <div style={btnRow}>
                                    <button
                                        style={viewBtn}
                                        onClick={() => navigate(`/gig/${gig._id}`)}
                                        onMouseOver={(e) => e.target.style.background = '#169c5f'}
                                        onMouseOut={(e) => e.target.style.background = '#1dbf73'}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


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
                    <Route path="/gig/:id" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <GigDetails />
                            </ProtectedLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-gig/:id" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <EditGig />
                            </ProtectedLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <Profile />
                            </ProtectedLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <ProtectedLayout>
                                <Settings />
                            </ProtectedLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={<ProtectedRoute><ProtectedLayout><Orders /></ProtectedLayout></ProtectedRoute>} />
                    <Route path="/chat/:userId" element={<ProtectedRoute><ProtectedLayout><Chat /></ProtectedLayout></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><ProtectedLayout><AdminPanel /></ProtectedLayout></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><ProtectedLayout><Favorites /></ProtectedLayout></ProtectedRoute>} />
                    <Route path="/freelancer-dashboard" element={<ProtectedRoute><ProtectedLayout><FreelancerDashboard /></ProtectedLayout></ProtectedRoute>} />
                    <Route path="/client-dashboard" element={<ProtectedRoute><ProtectedLayout><ClientDashboard /></ProtectedLayout></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App; 