import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdStar, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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

const btnRow = {
  display: 'flex',
  gap: '0.8rem',
  marginTop: '1rem',
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
  flex: 1,
  textAlign: 'center',
};

const SearchResults = () => {
  const query = useQuery();
  const search = query.get('query');
  const category = query.get('category');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (!search && !category) return;
    setLoading(true);
    setError('');
    const params = [];
    if (search) params.push(`query=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/search?${params.join('&')}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setError(data.message || 'No results found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch results.');
        setLoading(false);
      });
    // Check for refreshSearch flag
    if (localStorage.getItem('refreshSearch') === 'true') {
      localStorage.removeItem('refreshSearch');
      // Optionally, you could re-fetch here, but since this useEffect runs on mount, it's enough
    }
  }, [search, category]);

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
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

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

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        ${responsiveStyles}
      `}</style>
      <h2 style={{ color: '#1dbf73', fontWeight: 700 }}>
        Results {search && <>for <span style={{ color: '#404145' }}>{search}</span></>}
        {category && <><span style={{ color: '#404145' }}> in </span><span style={{ color: '#1dbf73' }}>{category}</span></>}
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && results.length === 0 && <p>No results found.</p>}
      <div style={gridStyle} className="gig-grid">
        {results.map(service => {
          const images = service.images || [];
          const isFavorite = favorites.has(service._id);
          return (
            <div key={service._id} style={cardStyle} className="gig-card">
              <button
                style={{
                  ...favBtn,
                  background: isFavorite ? '#e53e3e' : '#fff',
                  color: isFavorite ? '#fff' : '#404145'
                }}
                onClick={() => handleToggleFavorite(service._id)}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <MdFavorite size={20} color="#fff" /> : <MdFavoriteBorder size={20} color="#404145" />}
              </button>
              <img
                src={images.length > 0 ? `${process.env.REACT_APP_SERVER_URL}/uploads/${images[0]}` : 'https://via.placeholder.com/320x180?text=No+Image'}
                alt={service.title}
                style={imageStyle}
              />
              <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={sellerRow}>
                    <div style={avatar}>{service.seller?.username ? service.seller.username[0].toUpperCase() : 'U'}</div>
                    <span style={{ color: '#222', fontWeight: 600 }}>{service.seller?.username || 'Unknown'}</span>
                    <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 'auto' }}>Level 1 ◆◆</span>
                  </div>
                  <div style={{ color: '#222', fontWeight: 500, fontSize: '1.08rem', marginBottom: 6 }}>{service.title}</div>
                  <div style={descriptionStyle}>{service.description}</div>
                  {service.tags && service.tags.length > 0 && (
                    <div style={{ marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {service.tags.slice(0, 3).map(tag => (
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
                      {service.avgRating || '0.0'}
                    </span>
                    <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: 4 }}>
                      ({service.reviewCount || 0})
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ marginLeft: 'auto', ...fromStyle }}>From</span>
                    <span style={priceStyle}>₹{service.price}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, width: '100%' }}>
                  <button
                    style={{
                      background: '#1dbf73',
                      color: '#fff',
                      padding: '0.6rem 1.2rem',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      width: '100%',
                      textAlign: 'center',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => navigate(`/gig/${service._id}`)}
                    onMouseOver={(e) => e.target.style.background = '#169c5f'}
                    onMouseOut={(e) => e.target.style.background = '#1dbf73'}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults; 