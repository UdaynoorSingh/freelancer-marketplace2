import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdNotificationsNone, MdMailOutline, MdFavoriteBorder } from 'react-icons/md';
import { FiPackage } from 'react-icons/fi';

const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: '#fff',
    borderBottom: '1px solid #e4e5e7',
    position: 'sticky',
    top: 0,
    zIndex: 100,
};

const logoStyle = {
    fontWeight: 900,
    fontSize: '2rem',
    color: '#1dbf73',
    letterSpacing: '-2px',
    textDecoration: 'none',
};

const searchBar = {
    display: 'flex',
    alignItems: 'center',
    background: '#f5f5f5',
    borderRadius: '24px',
    padding: '0.25rem 1rem',
    flex: 1,
    maxWidth: '500px',
    margin: '0 2rem',
};

const searchInput = {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '1rem',
    flex: 1,
    padding: '0.5rem 0',
};

const searchBtn = {
    background: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '0 20px 20px 0',
    padding: '0.5rem 1.2rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: '0',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const rightActions = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
};

const avatar = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f7931e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#fff',
    fontSize: '1.1rem',
    position: 'relative',
};
const onlineDot = {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    background: '#1dbf73',
    borderRadius: '50%',
    border: '2px solid #fff',
};

const Navbar = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?query=${encodeURIComponent(search.trim())}`);
            setSearch('');
        }
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>fiverr<span style={{ color: '#404145', fontWeight: 400 }}>.</span></Link>
            <form style={searchBar} onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="web dev"
                    style={searchInput}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" style={searchBtn}><MdSearch size={22} /></button>
            </form>
            <div style={rightActions}>
                <MdNotificationsNone size={22} color="#404145" style={{ cursor: 'pointer' }} title="Notifications" />
                <MdMailOutline size={22} color="#404145" style={{ cursor: 'pointer' }} title="Messages" />
                <MdFavoriteBorder size={22} color="#404145" style={{ cursor: 'pointer' }} title="Favorites" />
                <span style={{ fontWeight: 500, color: '#404145', cursor: 'pointer' }}>Orders</span>
                <div style={avatar}>A<div style={onlineDot}></div></div>
            </div>
        </nav>
    );
};

export default Navbar; 