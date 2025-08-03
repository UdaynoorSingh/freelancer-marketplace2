import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdNotifications, MdMessage, MdFavoriteBorder, MdFavorite, MdShoppingCart, MdAdd, MdMenu, MdClose } from 'react-icons/md';

const navStyle = {
    background: '#fff',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    height: '70px'
};

const searchBar = {
    flex: 1,
    maxWidth: '600px',
    margin: '0 2rem',
    position: 'relative'
};

const searchInput = {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none'
};

const searchIcon = {
    position: 'absolute',
    left: '0.8rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666'
};

const rightActions = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
};

const iconButton = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
};

const avatar = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#1dbf73',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    cursor: 'pointer',
    position: 'relative'
};

const onlineDot = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    background: '#22c55e',
    borderRadius: '50%',
    border: '2px solid #fff'
};

const dropdownMenu = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 1000,
    marginTop: '0.5rem',
    overflow: 'hidden'
};

const dropdownButton = {
    width: '100%',
    padding: '0.8rem 1.2rem',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#222',
    transition: 'background 0.2s',
    display: 'block'
};

const dropdownButtonHover = {
    ...dropdownButton,
    background: '#f5f5f5'
};

const createGigBtn = {
    background: '#1dbf73',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
};

// Mobile styles
const mobileMenuBtn = {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem'
};

const sidebar = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '280px',
    height: '100vh',
    background: '#fff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    zIndex: 2000,
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    overflowY: 'auto'
};

const sidebarOpen = {
    ...sidebar,
    transform: 'translateX(0)'
};

const sidebarOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1999,
    display: 'none'
};

const sidebarOverlayOpen = {
    ...sidebarOverlay,
    display: 'block'
};

const sidebarHeader = {
    padding: '1.5rem',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const sidebarContent = {
    padding: '1rem 0'
};

const sidebarItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    borderBottom: '1px solid #f5f5f5',
    color: '#333',
    textDecoration: 'none'
};

const sidebarItemHover = {
    ...sidebarItem,
    background: '#f8f9fa'
};

const mobileStyles = `
  @media (max-width: 768px) {
    .nav-container {
      padding: 0 1rem;
      height: 60px;
    }
    
    .search-bar {
      display: none;
    }
    
    .right-actions {
      gap: 0.5rem;
    }
    
    .desktop-only {
      display: none;
    }
    
    .mobile-menu-btn {
      display: block;
    }
    
    .logo {
      font-size: 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .nav-container {
      padding: 0 0.5rem;
    }
    
    .right-actions {
      gap: 0.3rem;
    }
  }
`;

const Navbar = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const dropdownRef = useRef();
    const avatarRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                avatarRef.current && !avatarRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        logout();
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleSidebarItemClick = (path) => {
        navigate(path);
        closeMobileMenu();
    };

    return (
        <>
            <style>{mobileStyles}</style>
            <nav style={navStyle} className="nav-container">
                {/* Mobile Menu Button */}
                <button style={mobileMenuBtn} onClick={toggleMobileMenu} className="mobile-menu-btn">
                    <MdMenu size={24} />
                </button>

                {/* Logo */}
                <div style={{ fontWeight: '700', fontSize: '1.5rem', color: '#404145' }} className="logo">
                    fiverr.
                </div>

                {/* Search Bar - Desktop Only */}
                <div style={searchBar} className="search-bar">
                    <MdSearch style={searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Find services"
                        style={searchInput}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                navigate(`/search?q=${e.target.value}`);
                            }
                        }}
                    />
                </div>

                {/* Right Actions */}
                <div style={rightActions} className="right-actions">
                    {user && (
                        <>
                            <button style={iconButton} title="Notifications">
                                <MdNotifications size={22} color="#404145" />
                            </button>

                            <button style={iconButton} onClick={() => navigate('/chat')} title="Messages">
                                <MdMessage size={22} color="#404145" />
                            </button>

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
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '600'
                                    }}>
                                        {favoritesCount}
                                    </div>
                                )}
                            </div>

                            <button style={iconButton} onClick={() => navigate('/orders')} title="Orders">
                                <MdShoppingCart size={22} color="#404145" />
                            </button>

                            {user.role === 'freelancer' && (
                                <button style={createGigBtn} onClick={() => navigate('/create-gig')} className="desktop-only">
                                    <MdAdd size={20} />
                                    Create Gig
                                </button>
                            )}
                        </>
                    )}

                    {/* User Avatar */}
                    <div style={avatar} ref={avatarRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                                    style={dropdownButton}
                                    onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                >
                                    Profile
                                </button>
                                {user?.role === 'freelancer' && (
                                    <button
                                        style={dropdownButton}
                                        onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                                        onClick={() => { setDropdownOpen(false); navigate('/freelancer-dashboard'); }}
                                    >
                                        Freelancer Dashboard
                                    </button>
                                )}
                                {user?.role === 'client' && (
                                    <button
                                        style={dropdownButton}
                                        onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                                        onClick={() => { setDropdownOpen(false); navigate('/client-dashboard'); }}
                                    >
                                        Client Dashboard
                                    </button>
                                )}
                                <button
                                    style={dropdownButton}
                                    onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                    onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                >
                                    Account settings
                                </button>
                                {user && user.email === process.env.REACT_APP_ADMIN_EMAIL && (
                                    <button
                                        style={dropdownButton}
                                        onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                                        onClick={() => { setDropdownOpen(false); navigate('/admin'); }}
                                    >
                                        Admin
                                    </button>
                                )}
                                <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                                <button
                                    style={dropdownButton}
                                    onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div style={mobileMenuOpen ? sidebarOverlayOpen : sidebarOverlay} onClick={closeMobileMenu}></div>
            <div style={mobileMenuOpen ? sidebarOpen : sidebar}>
                <div style={sidebarHeader}>
                    <div style={{ fontWeight: '700', fontSize: '1.3rem', color: '#404145' }}>Menu</div>
                    <button
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        onClick={closeMobileMenu}
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                <div style={sidebarContent}>
                    {user ? (
                        <>
                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/')}>
                                <MdSearch size={20} />
                                Search Gigs
                            </div>

                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/favorites')}>
                                <MdFavoriteBorder size={20} />
                                Favorites ({favoritesCount})
                            </div>

                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/orders')}>
                                <MdShoppingCart size={20} />
                                Orders
                            </div>

                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/chat')}>
                                <MdMessage size={20} />
                                Messages
                            </div>

                            {user.role === 'freelancer' && (
                                <div style={sidebarItem} onClick={() => handleSidebarItemClick('/create-gig')}>
                                    <MdAdd size={20} />
                                    Create Gig
                                </div>
                            )}

                            {user.role === 'freelancer' && (
                                <div style={sidebarItem} onClick={() => handleSidebarItemClick('/freelancer-dashboard')}>
                                    Freelancer Dashboard
                                </div>
                            )}

                            {user.role === 'client' && (
                                <div style={sidebarItem} onClick={() => handleSidebarItemClick('/client-dashboard')}>
                                    Client Dashboard
                                </div>
                            )}

                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/profile')}>
                                Profile
                            </div>

                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/settings')}>
                                Settings
                            </div>

                            {user.email === process.env.REACT_APP_ADMIN_EMAIL && (
                                <div style={sidebarItem} onClick={() => handleSidebarItemClick('/admin')}>
                                    Admin Panel
                                </div>
                            )}

                            <div style={sidebarItem} onClick={handleLogout}>
                                Logout
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/login')}>
                                Login
                            </div>
                            <div style={sidebarItem} onClick={() => handleSidebarItemClick('/register')}>
                                Register
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar; 