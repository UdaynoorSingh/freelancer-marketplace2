import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdNotificationsNone, MdMailOutline, MdFavoriteBorder } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

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

const createBtn = {
    background: '#1dbf73',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1.2rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    marginLeft: '1rem',
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
    cursor: 'pointer',
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

const dropdownMenu = {
    position: 'absolute',
    top: '120%',
    right: 0,
    background: '#fff',
    border: '1px solid #e4e5e7',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    minWidth: '220px',
    zIndex: 999,
    padding: '0.5rem 0',
};
const dropdownItem = {
    padding: '0.7rem 1.5rem',
    cursor: 'pointer',
    color: '#404145',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    outline: 'none',
};
const dropdownItemHover = {
    ...dropdownItem,
    background: '#f5f5f5',
};

const Navbar = () => {
    const [search, setSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const avatarRef = useRef();
    const dropdownRef = useRef();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?query=${encodeURIComponent(search.trim())}`);
            setSearch('');
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/login');
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
                <span style={{ fontWeight: 500, color: '#404145', cursor: 'pointer' }} onClick={() => navigate('/orders')}>Orders</span>
                <button style={createBtn} onClick={() => navigate('/create-gig')}>Create Gig</button>
                <div
                    style={avatar}
                    ref={avatarRef}
                    onClick={() => setDropdownOpen((open) => !open)}
                >
                    {user && user.username ? user.username[0].toUpperCase() : 'A'}
                    <div style={onlineDot}></div>
                    {dropdownOpen && (
                        <div style={dropdownMenu} ref={dropdownRef}>
                            <button
                                style={hovered === 'profile' ? dropdownItemHover : dropdownItem}
                                onMouseEnter={() => setHovered('profile')}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                            >Profile</button>
                            <button
                                style={hovered === 'settings' ? dropdownItemHover : dropdownItem}
                                onMouseEnter={() => setHovered('settings')}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                            >Account settings</button>
                            <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <button
                                style={hovered === 'logout' ? dropdownItemHover : dropdownItem}
                                onMouseEnter={() => setHovered('logout')}
                                onMouseLeave={() => setHovered(null)}
                                onClick={handleLogout}
                            >Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 