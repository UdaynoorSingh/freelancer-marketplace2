import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdNotifications, MdMessage, MdFavoriteBorder, MdFavorite, MdShoppingCart, MdAdd, MdMenu, MdClose } from 'react-icons/md';

// Updated color scheme - Modern Purple/Blue Theme
const primaryColor = '#6366f1'; // Indigo
const secondaryColor = '#8b5cf6'; // Purple
const accentColor = '#06b6d4'; // Cyan
const successColor = '#10b981'; // Emerald
const warningColor = '#f59e0b'; // Amber
const dangerColor = '#ef4444'; // Red
const darkColor = '#1e293b'; // Slate
const lightColor = '#f8fafc'; // Slate light
const textPrimary = '#1e293b'; // Slate dark
const textSecondary = '#64748b'; // Slate medium
const borderColor = '#e2e8f0'; // Slate light border

const navbarStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
};

const navItems = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
};

const iconButton = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',
};

const iconButtonHover = {
    ...iconButton,
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-1px)',
};

const userSection = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
};

const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 100%)`,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.2s ease',
};

const avatarStyleHover = {
    ...avatarStyle,
    border: '2px solid rgba(255, 255, 255, 0.4)',
    transform: 'scale(1.05)',
};

const dropdownMenu = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '0.5rem',
    minWidth: '200px',
    zIndex: 1001,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
};

const dropdownButton = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: textPrimary,
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
};

const dropdownButtonHover = {
    ...dropdownButton,
    background: '#f8fafc',
    color: primaryColor,
};

const mobileMenuButton = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    color: '#fff',
    cursor: 'pointer',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
};

const mobileMenuButtonHover = {
    ...mobileMenuButton,
    background: 'rgba(255, 255, 255, 0.2)',
};

const sidebar = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '280px',
    height: '100vh',
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    color: '#fff',
    padding: '2rem 1.5rem',
    zIndex: 1002,
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

const sidebarOpen = {
    ...sidebar,
    transform: 'translateX(0)',
};

const sidebarOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s ease',
};

const sidebarOverlayOpen = {
    ...sidebarOverlay,
    opacity: 1,
    visibility: 'visible',
};

const sidebarItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    marginBottom: '0.5rem',
};

const sidebarItemHover = {
    ...sidebarItem,
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(4px)',
};

const closeButton = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
};

const closeButtonHover = {
    ...closeButton,
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
};

const mobileStyles = `
  @media (max-width: 768px) {
    .nav-items {
      display: none;
    }
    .mobile-menu-button {
      display: flex;
    }
    .search-container {
      display: none;
    }
    .logo {
      font-size: 1.2rem;
    }
  }
`;

const Navbar = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
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

    // Fetch unread messages count
    useEffect(() => {
        if (!user || !token) return;

        fetch(`${process.env.REACT_APP_SERVER_URL}/api/messages/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const totalUnread = data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
                    setUnreadMessages(totalUnread);
                }
            })
            .catch(err => console.error('Error fetching unread messages:', err));
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
            <nav style={navbarStyle} className="nav-container">
                {/* Mobile Menu Button */}
                <button style={mobileMenuButton} onClick={toggleMobileMenu} className="mobile-menu-button">
                    <MdMenu size={24} />
                </button>

                {/* Logo */}
                <div style={logoStyle} className="logo">
                    TaskLoft
                </div>

                {/* Search Bar - Desktop Only */}
                <div style={{ flex: 1, maxWidth: '600px', margin: '0 2rem', position: 'relative' }} className="search-container">
                    <MdSearch style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#fff' }} size={20} />
                    <input
                        type="text"
                        placeholder="Find services"
                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', fontSize: '1rem', outline: 'none', color: '#fff' }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                navigate(`/search?q=${e.target.value}`);
                            }
                        }}
                    />
                </div>

                {/* Right Actions */}
                <div style={navItems} className="nav-items">
                    {user && (
                        <>
                            <button style={iconButton} title="Notifications">
                                <MdNotifications size={22} />
                            </button>

                            <button style={iconButton} onClick={() => navigate('/chat')} title="Messages">
                                <MdMessage size={22} />
                                {unreadMessages > 0 && (
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
                                        {unreadMessages}
                                    </div>
                                )}
                            </button>

                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/favorites')} className="desktop-only">
                                <MdFavoriteBorder size={22} color="#fff" title="Favorites" />
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
                                <MdShoppingCart size={22} />
                            </button>

                            {user.role === 'freelancer' && (
                                <button style={{
                                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                                    className="desktop-only"
                                    onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'; }}
                                    onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; }}
                                    onClick={() => navigate('/create-gig')}
                                >
                                    <MdAdd size={20} />
                                    Create Gig
                                </button>
                            )}
                        </>
                    )}

                    {/* User Avatar */}
                    <div style={userSection}>
                        <div style={avatarStyle} ref={avatarRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {user && user.username ? user.username[0].toUpperCase() : 'A'}
                            <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', border: '2px solid #fff' }}></div>
                        </div>

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
                                        onClick={() => { setDropdownOpen(false); navigate('/create-gig'); }}
                                    >
                                        Create Gig
                                    </button>
                                )}
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
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.3rem', color: '#fff' }}>Menu</div>
                    <button
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        onClick={closeMobileMenu}
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                <div style={{ padding: '1rem 0' }}>
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