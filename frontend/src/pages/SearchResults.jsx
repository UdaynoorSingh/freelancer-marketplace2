import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdStar, MdFavoriteBorder } from 'react-icons/md';

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

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1dbf73', fontWeight: 700 }}>
        Results {search && <>for <span style={{ color: '#404145' }}>{search}</span></>}
        {category && <><span style={{ color: '#404145' }}> in </span><span style={{ color: '#1dbf73' }}>{category}</span></>}
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && results.length === 0 && <p>No results found.</p>}
      <div style={gridStyle}>
        {results.map(service => {
          // Use avgRating and reviewCount from backend
          const avgRating = service.avgRating !== undefined ? service.avgRating : (service.rating || 4.9);
          const reviewCount = service.reviewCount !== undefined ? service.reviewCount : (service.reviews ? service.reviews.length : 0);
          const images = service.images || [];
          return (
            <div key={service._id} style={cardStyle}>
              <button style={favBtn}><MdFavoriteBorder size={20} color="#404145" /></button>
              <img
                src={images.length > 0 ? `${process.env.REACT_APP_SERVER_URL}/uploads/${images[0]}` : 'https://via.placeholder.com/320x180?text=No+Image'}
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

export default SearchResults; 