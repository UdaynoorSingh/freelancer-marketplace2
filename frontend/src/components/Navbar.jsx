import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdNotificationsNone, MdMailOutline, MdFavoriteBorder } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';

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

const notificationDot = {
    position: 'absolute',
    top: -4,
    right: -4,
    background: '#e53e3e',
    color: '#fff',
    borderRadius: '50%',
    width: 16,
    height: 16,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    zIndex: 2,
};

const socket = io(process.env.REACT_APP_SERVER_URL, {
    transports: ['websocket'],
    withCredentials: true,
});

const REACT_APP_ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const Navbar = () => {
    const [search, setSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const avatarRef = useRef();
    const dropdownRef = useRef();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);

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

    useEffect(() => {
        if (!user) return;
        socket.emit('join', user.id);
        socket.on('chat:receive', (msg) => {
            // Only notify if not already chatting with sender
            if (window.location.pathname !== `/chat/${msg.sender}`) {
                setNotifications((prev) => [
                    { sender: msg.sender, content: msg.content, timestamp: msg.timestamp },
                    ...prev,
                ]);
            }
        });
        return () => {
            socket.off('chat:receive');
        };
    }, [user]);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/login');
    };

    const handleNotifClick = () => {
        setNotifOpen((open) => !open);
    };
    const handleNotifSelect = (sender) => {
        setNotifOpen(false);
        setNotifications((prev) => prev.filter((n) => n.sender !== sender));
        navigate(`/chat/${sender}`);
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
                <div style={{ position: 'relative' }}>
                    <MdNotificationsNone size={22} color="#404145" style={{ cursor: 'pointer' }} title="Notifications" onClick={handleNotifClick} />
                    {notifications.length > 0 && (
                        <div style={notificationDot}>{notifications.length}</div>
                    )}
                    {notifOpen && notifications.length > 0 && (
                        <div style={{ position: 'absolute', top: 28, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: 260, zIndex: 999 }}>
                            {notifications.map((n, i) => (
                                <div key={i} style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', color: '#222' }} onClick={() => handleNotifSelect(n.sender)}>
                                    <b>New message</b>: {n.content.length > 32 ? n.content.slice(0, 32) + '...' : n.content}
                                    <div style={{ color: '#888', fontSize: '0.92rem', marginTop: 2 }}>{new Date(n.timestamp).toLocaleTimeString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
                            {user && user.email === REACT_APP_ADMIN_EMAIL && (
                                <button
                                    style={hovered === 'admin' ? dropdownItemHover : dropdownItem}
                                    onMouseEnter={() => setHovered('admin')}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => { setDropdownOpen(false); navigate('/admin'); }}
                                >Admin</button>
                            )}
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