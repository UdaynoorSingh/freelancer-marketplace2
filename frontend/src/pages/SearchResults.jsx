import React from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
    const query = useQuery();
    const search = query.get('query');

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ color: '#1dbf73', fontWeight: 700 }}>Results for <span style={{ color: '#404145' }}>{search}</span></h2>
            <p style={{ marginTop: '1rem' }}>This is a placeholder for search results.</p>
        </div>
    );
};

export default SearchResults; 