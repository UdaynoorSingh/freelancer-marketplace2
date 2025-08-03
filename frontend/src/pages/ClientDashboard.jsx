import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdStar, MdChat, MdFavorite } from 'react-icons/md';

const containerStyle = {
    maxWidth: 1200,
    margin: '2.5rem auto',
    padding: '0 2rem',
};

const headerStyle = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    padding: '2rem',
    marginBottom: '2rem',
};

const statsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
};

const statCard = {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: 12,
    textAlign: 'center',
};

const statNumber = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1dbf73',
    marginBottom: '0.5rem',
};

const statLabel = {
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: 500,
};

const sectionStyle = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    padding: '2rem',
    marginBottom: '2rem',
};

const sectionHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
};

const sectionTitle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#222',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thStyle = {
    background: '#f7f7f7',
    color: '#222',
    fontWeight: 700,
    padding: '0.7rem',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
};

const tdStyle = {
    padding: '0.7rem',
    borderBottom: '1px solid #eee',
};

const actionBtn = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.3rem',
    marginRight: '0.5rem',
    borderRadius: 4,
};

const statusBadge = (status) => ({
    padding: '0.3rem 0.8rem',
    borderRadius: 20,
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    background: status === 'completed' ? '#d4edda' : status === 'active' ? '#fff3cd' : '#f8d7da',
    color: status === 'completed' ? '#155724' : status === 'active' ? '#856404' : '#721c24',
});

const gigCard = {
    background: '#f8f9fa',
    borderRadius: 12,
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #eee',
};

const ClientDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [purchasedGigs, setPurchasedGigs] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [stats, setStats] = useState({
        totalPurchases: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'client') {
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, [user, token]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch orders where user is buyer
            const ordersRes = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, { headers });
            const ordersData = await ordersRes.json();
            const buyerOrders = Array.isArray(ordersData) ? ordersData.filter(order => order.buyerId?._id === user.id) : [];
            setPurchasedGigs(buyerOrders);

            // Fetch favorites
            const favoritesRes = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites`, { headers });
            const favoritesData = await favoritesRes.json();
            setFavorites(Array.isArray(favoritesData) ? favoritesData : []);

            // Calculate stats
            const activeOrders = buyerOrders.filter(order => order.status === 'active').length;
            const completedOrders = buyerOrders.filter(order => order.status === 'completed').length;
            const totalSpent = buyerOrders
                .filter(order => order.status === 'completed')
                .reduce((sum, order) => sum + (order.gigId?.price || 0), 0);

            setStats({
                totalPurchases: buyerOrders.length,
                activeOrders,
                completedOrders,
                totalSpent,
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={{ color: '#1dbf73', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Welcome back, {user?.username}!
                </h1>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                    Here's your client dashboard overview
                </p>

                <div style={statsGrid}>
                    <div style={statCard}>
                        <div style={statNumber}>{stats.totalPurchases}</div>
                        <div style={statLabel}>Total Purchases</div>
                    </div>
                    <div style={statCard}>
                        <div style={statNumber}>{stats.activeOrders}</div>
                        <div style={statLabel}>Active Orders</div>
                    </div>
                    <div style={statCard}>
                        <div style={statNumber}>{stats.completedOrders}</div>
                        <div style={statLabel}>Completed Orders</div>
                    </div>
                    <div style={statCard}>
                        <div style={statNumber}>${stats.totalSpent}</div>
                        <div style={statLabel}>Total Spent</div>
                    </div>
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>My Purchases</h2>
                </div>

                {purchasedGigs.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                        You haven't purchased any gigs yet. Start exploring and find the perfect service for your needs!
                    </p>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Order ID</th>
                                <th style={thStyle}>Gig</th>
                                <th style={thStyle}>Seller</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchasedGigs.map(order => (
                                <tr key={order._id}>
                                    <td style={tdStyle}>{order._id.slice(-8)}</td>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 600 }}>{order.gigId?.title || 'N/A'}</div>
                                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{order.gigId?.description}</div>
                                    </td>
                                    <td style={tdStyle}>{order.sellerId?.username || 'N/A'}</td>
                                    <td style={tdStyle}>${order.gigId?.price || 0}</td>
                                    <td style={tdStyle}>
                                        <span style={statusBadge(order.status)}>{order.status}</span>
                                    </td>
                                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <button
                                            style={actionBtn}
                                            onClick={() => navigate(`/chat/${order.sellerId?._id}`)}
                                            title="Chat with seller"
                                        >
                                            <MdChat size={18} color="#1dbf73" />
                                        </button>
                                        <button
                                            style={actionBtn}
                                            onClick={() => navigate(`/gig/${order.gigId?._id}`)}
                                            title="View gig"
                                        >
                                            <MdStar size={18} color="#f7931e" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={sectionStyle}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>My Favorites</h2>
                </div>

                {favorites.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                        You haven't added any gigs to your favorites yet. Start exploring and save your favorite services!
                    </p>
                ) : (
                    <div>
                        {favorites.map(gig => (
                            <div key={gig._id} style={gigCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                            {gig.title}
                                        </div>
                                        <div style={{ color: '#666', marginBottom: '0.5rem' }}>
                                            {gig.description}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ color: '#1dbf73', fontWeight: 600 }}>${gig.price}</span>
                                            <span style={{ color: '#666' }}>by {gig.seller?.username}</span>
                                            <span style={{ color: '#666' }}>{gig.category}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            style={actionBtn}
                                            onClick={() => navigate(`/gig/${gig._id}`)}
                                            title="View gig"
                                        >
                                            <MdStar size={18} color="#f7931e" />
                                        </button>
                                        <button
                                            style={actionBtn}
                                            onClick={() => navigate(`/chat/${gig.seller?._id}`)}
                                            title="Chat with seller"
                                        >
                                            <MdChat size={18} color="#1dbf73" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard; 