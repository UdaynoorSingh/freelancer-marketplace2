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
    flexWrap: 'wrap',
    gap: '1rem',
};

const logoStyle = {
    fontWeight: 900,
    fontSize: '2rem',
    color: '#1dbf73',
    letterSpacing: '-2px',
    textDecoration: 'none',
    flexShrink: 0,
};

const searchBar = {
    display: 'flex',
    alignItems: 'center',
    background: '#f5f5f5',
    borderRadius: '24px',
    padding: '0.25rem 1rem',
    flex: '1 1 300px',
    maxWidth: '500px',
    margin: '0 1rem',
    minWidth: '200px',
};

const searchInput = {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '1rem',
    flex: 1,
    padding: '0.5rem 0',
    minWidth: '100px',
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
    flexWrap: 'wrap',
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
    whiteSpace: 'nowrap',
};

const avatar = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f7931e',
    color: '#fff',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    flexShrink: 0,
};

const onlineDot = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    background: '#1dbf73',
    borderRadius: '50%',
    border: '2px solid #fff',
};

const dropdownMenu = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    minWidth: '180px',
    zIndex: 1000,
    marginTop: '0.5rem',
};

const dropdownItem = {
    width: '100%',
    padding: '0.8rem 1.2rem',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#222',
    transition: 'background 0.2s',
};

const dropdownItemHover = {
    ...dropdownItem,
    background: '#f5f5f5',
};

const notificationDot = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#e53e3e',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
};

const mobileMenuBtn = {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#404145',
    padding: '0.5rem',
};

const mobileMenu = {
    display: 'none',
    width: '100%',
    background: '#fff',
    borderTop: '1px solid #eee',
    padding: '1rem',
    flexDirection: 'column',
    gap: '1rem',
};

// Media query styles
const mobileStyles = `
    @media (max-width: 768px) {
        .nav-container {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
        }
        .search-container {
            order: 3;
            margin: 1rem 0;
            max-width: none;
        }
        .right-actions {
            justify-content: space-between;
            gap: 0.5rem;
        }
        .mobile-menu-btn {
            display: block !important;
        }
        .mobile-menu {
            display: flex !important;
        }
        .desktop-only {
            display: none !important;
        }
    }
    @media (max-width: 480px) {
        .right-actions {
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .create-btn {
            margin-left: 0;
            width: 100%;
            margin-top: 0.5rem;
        }
    }
`;

const socket = io(process.env.REACT_APP_SERVER_URL, {
    transports: ['websocket'],
    withCredentials: true,
});

const REACT_APP_ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const Navbar = () => {
    const [search, setSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const avatarRef = useRef();
    const dropdownRef = useRef();
    const navigate = useNavigate();
    const { logout, user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);

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

    // Fetch favorites count
    useEffect(() => {
        if (!user || !token) return;
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFavoritesCount(data.length);
                }
            })
            .catch(err => console.error('Error fetching favorites count:', err));
    }, [user, token]);

    // Listen for favorites updates
    useEffect(() => {
        const handleFavoritesUpdate = () => {
            if (!user || !token) return;
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setFavoritesCount(data.length);
                    }
                })
                .catch(err => console.error('Error fetching favorites count:', err));
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    }, [user, token]);

    const handleLogout = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <style>{mobileStyles}</style>
            <nav style={navStyle} className="nav-container">
                <Link to="/" style={logoStyle}>fiverr<span style={{ color: '#404145', fontWeight: 400 }}>.</span></Link>

                <form style={searchBar} onSubmit={handleSearch} className="search-container">
                    <input
                        type="text"
                        placeholder="web dev"
                        style={searchInput}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button type="submit" style={searchBtn}><MdSearch size={22} /></button>
                </form>

                <div style={rightActions} className="right-actions">
                    <div style={{ position: 'relative' }} className="desktop-only">
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
                    <MdMailOutline size={22} color="#404145" style={{ cursor: 'pointer' }} title="Messages" className="desktop-only" />
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/favorites')} className="desktop-only">
                        <MdFavoriteBorder size={22} color="#404145" title="Favorites" />
                        {favoritesCount > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#e53e3e',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                            }}>
                                {favoritesCount}
                            </div>
                        )}
                    </div>
                    <span style={{ fontWeight: 500, color: '#404145', cursor: 'pointer' }} onClick={() => navigate('/orders')} className="desktop-only">Orders</span>
                    <button style={createBtn} onClick={() => navigate('/create-gig')} className="create-btn">Create Gig</button>
                    <button style={mobileMenuBtn} onClick={toggleMobileMenu} className="mobile-menu-btn">
                        ☰
                    </button>
                    <div
                        style={avatar}
                        ref={avatarRef}
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        {user && user.username ? user.username[0].toUpperCase() : 'A'}
                        <div style={onlineDot}></div>
                        {dropdownOpen && (
                            <div style={dropdownMenu} ref={dropdownRef}>
                                <div style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid #eee', color: '#666', fontSize: '0.9rem' }}>
                                    <div style={{ fontWeight: 600, color: '#222' }}>{user?.username}</div>
                                    <div style={{ color: '#1dbf73', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                        {user?.role === 'freelancer' ? 'Freelancer' : 'Client'}
                                    </div>
                                </div>
                                <button
                                    style={hovered === 'profile' ? dropdownItemHover : dropdownItem}
                                    onMouseEnter={() => setHovered('profile')}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                >Profile</button>
                                {user?.role === 'freelancer' && (
                                    <button
                                        style={hovered === 'freelancer-dashboard' ? dropdownItemHover : dropdownItem}
                                        onMouseEnter={() => setHovered('freelancer-dashboard')}
                                        onMouseLeave={() => setHovered(null)}
                                        onClick={() => { setDropdownOpen(false); navigate('/freelancer-dashboard'); }}
                                    >Freelancer Dashboard</button>
                                )}
                                {user?.role === 'client' && (
                                    <button
                                        style={hovered === 'client-dashboard' ? dropdownItemHover : dropdownItem}
                                        onMouseEnter={() => setHovered('client-dashboard')}
                                        onMouseLeave={() => setHovered(null)}
                                        onClick={() => { setDropdownOpen(false); navigate('/client-dashboard'); }}
                                    >Client Dashboard</button>
                                )}
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

                {mobileMenuOpen && (
                    <div style={mobileMenu} className="mobile-menu">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <MdNotificationsNone size={20} color="#404145" />
                            <span>Notifications</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <MdMailOutline size={20} color="#404145" />
                            <span>Messages</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <MdFavoriteBorder size={20} color="#404145" />
                            <span onClick={() => { setMobileMenuOpen(false); navigate('/favorites'); }}>Favorites</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <span onClick={() => { setMobileMenuOpen(false); navigate('/orders'); }}>Orders</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <span onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}>Profile</span>
                        </div>
                        {user?.role === 'freelancer' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                <span onClick={() => { setMobileMenuOpen(false); navigate('/freelancer-dashboard'); }}>Freelancer Dashboard</span>
                            </div>
                        )}
                        {user?.role === 'client' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                <span onClick={() => { setMobileMenuOpen(false); navigate('/client-dashboard'); }}>Client Dashboard</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <span onClick={() => { setMobileMenuOpen(false); navigate('/settings'); }}>Settings</span>
                        </div>
                        {user && user.email === REACT_APP_ADMIN_EMAIL && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                <span onClick={() => { setMobileMenuOpen(false); navigate('/admin'); }}>Admin</span>
                            </div>
                        )}
                        <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <span onClick={handleLogout}>Logout</span>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar; 