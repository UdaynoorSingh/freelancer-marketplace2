import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdStar, MdFavorite, MdFavoriteBorder } from 'react-icons/md';

const containerStyle = {
    maxWidth: 1200,
    margin: '2.5rem auto',
    padding: '0 2rem',
};

const headerStyle = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    padding: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
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

const btnRow = {
    display: 'flex',
    gap: '0.8rem',
    marginTop: 'auto',
    paddingTop: '1rem',
    width: '100%',
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
    maxHeight: '1.4em',
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
};

const Favorites = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [user, token]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setFavorites(data);
            } else {
                setError('Failed to fetch favorites');
            }
        } catch (err) {
            setError('Failed to fetch favorites');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (serviceId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites/remove/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                // Remove from local state
                setFavorites(prev => prev.filter(fav => fav._id !== serviceId));
            }
        } catch (err) {
            console.error('Error removing from favorites:', err);
        }
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={{ color: '#1dbf73', fontWeight: 700, marginBottom: '0.5rem' }}>My Favorites</h1>
                    <p style={{ color: '#666' }}>Loading your favorite gigs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={{ color: '#e53e3e', fontWeight: 700, marginBottom: '0.5rem' }}>Error</h1>
                    <p style={{ color: '#666' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={{ color: '#1dbf73', fontWeight: 700, marginBottom: '0.5rem' }}>My Favorites</h1>
                <p style={{ color: '#666' }}>
                    {favorites.length === 0
                        ? "You haven't added any gigs to your favorites yet."
                        : `You have ${favorites.length} favorite gig${favorites.length === 1 ? '' : 's'}.`
                    }
                </p>
            </div>

            {favorites.length === 0 ? (
                <div style={emptyStateStyle}>
                    <MdFavoriteBorder size={64} color="#ccc" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#666', marginBottom: '1rem' }}>No favorites yet</h3>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>
                        Start exploring gigs and add them to your favorites by clicking the heart icon!
                    </p>
                    <button
                        style={{
                            background: '#1dbf73',
                            color: '#fff',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '1rem'
                        }}
                        onClick={() => navigate('/')}
                    >
                        Explore Gigs
                    </button>
                </div>
            ) : (
                <div style={gridStyle}>
                    {favorites.map(gig => (
                        <div key={gig._id} style={cardStyle}>
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
                                <button
                                    style={{
                                        ...favBtn,
                                        background: '#e53e3e',
                                        color: '#fff'
                                    }}
                                    onClick={() => handleToggleFavorite(gig._id)}
                                    title="Remove from favorites"
                                >
                                    <MdFavorite size={20} color="#fff" />
                                </button>
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

export default Favorites; 