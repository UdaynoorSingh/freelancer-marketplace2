import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    padding: '1.2rem',
    margin: '1rem 0',
    maxWidth: 400,
    minWidth: 280,
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
};
const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '2rem',
};

const SearchResults = () => {
    const query = useQuery();
    const search = query.get('query');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!search) return;
        setLoading(true);
        setError('');
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/search?query=${encodeURIComponent(search)}`)
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
    }, [search]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ color: '#1dbf73', fontWeight: 700 }}>Results for <span style={{ color: '#404145' }}>{search}</span></h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && results.length === 0 && <p>No results found.</p>}
            <div style={gridStyle}>
                {results.map(service => (
                    <div key={service._id} style={cardStyle}>
                        <h3 style={{ color: '#222', fontWeight: 600 }}>{service.title}</h3>
                        <p style={{ color: '#555', fontSize: '1rem' }}>{service.description}</p>
                        <div style={{ margin: '0.5rem 0', color: '#1dbf73', fontWeight: 500 }}>
                            {service.tags && service.tags.map(tag => (
                                <span key={tag} style={{ marginRight: 8, fontSize: '0.95rem', background: '#f5f5f5', borderRadius: 6, padding: '2px 8px' }}>#{tag}</span>
                            ))}
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#1dbf73', fontWeight: 700, fontSize: '1.1rem' }}>₹{service.price}</span>
                            <span style={{ color: '#404145', fontSize: '0.95rem' }}>by {service.seller?.username || 'Unknown'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults; 