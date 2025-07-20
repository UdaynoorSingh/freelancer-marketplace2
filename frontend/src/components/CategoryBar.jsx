import React from 'react';
import { MdWhatshot } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const barStyle = {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderBottom: '1px solid #e4e5e7',
    padding: '0.5rem 2rem',
    fontSize: '1.08rem',
    fontWeight: 500,
    color: '#555',
    zIndex: 99,
};
const catStyle = {
    marginRight: '1.5rem',
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
};
const postBtn = {
    marginLeft: 'auto',
    padding: '0.4rem 1.2rem',
    border: '1.5px solid #222',
    borderRadius: '8px',
    background: '#fff',
    color: '#222',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
};

const categories = [
    { label: 'Trending', icon: <MdWhatshot color="#f7931e" size={20} /> },
    { label: 'Graphics & Design', icon: null },
    { label: 'Programming & Tech', icon: null },
    { label: 'Digital Marketing', icon: null },
    { label: 'Video & Animation', icon: null },
    { label: 'Writing & Translation', icon: null },
    { label: 'Music & Audio', icon: null },
    { label: 'Business', icon: null },
];

const CategoryBar = () => {
    const navigate = useNavigate();
    const handleCategoryClick = (cat) => {
        if (cat.label === 'Trending') {
            navigate('/search?category=Trending');
        } else {
            navigate(`/search?category=${encodeURIComponent(cat.label)}`);
        }
    };
    return (
        <div style={barStyle}>
            {categories.map(cat => (
                <span
                    key={cat.label}
                    style={catStyle}
                    onClick={() => handleCategoryClick(cat)}
                >
                    {cat.icon ? <span style={{ marginRight: 4 }}>{cat.icon}</span> : null}
                    {cat.label}
                </span>
            ))}
            <button style={postBtn}>
                <FiEdit size={18} /> Post a brief
            </button>
        </div>
    );
};

export default CategoryBar; 