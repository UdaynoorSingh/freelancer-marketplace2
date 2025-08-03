import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdStar, MdEdit, MdDelete, MdAdd } from 'react-icons/md';

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

const containerStyle = {
    maxWidth: 1200,
    margin: '2.5rem auto',
    padding: '0 2rem',
};

const headerStyle = {
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
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
    color: primaryColor,
    marginBottom: '0.5rem',
};

const statLabel = {
    color: textSecondary,
    fontSize: '0.9rem',
    fontWeight: 500,
};

const sectionStyle = {
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
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
    color: textPrimary,
};

const addButton = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.5rem 1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thStyle = {
    background: lightColor,
    color: textPrimary,
    fontWeight: 700,
    padding: '0.7rem',
    borderBottom: `1px solid ${borderColor}`,
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

const FreelancerDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [myGigs, setMyGigs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalGigs: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalEarnings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'freelancer') {
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, [user, token]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch my gigs
            const gigsRes = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/my-gigs`, { headers });
            const gigsData = await gigsRes.json();
            setMyGigs(Array.isArray(gigsData) ? gigsData : []);

            // Fetch orders where user is seller
            const ordersRes = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, { headers });
            const ordersData = await ordersRes.json();
            const sellerOrders = Array.isArray(ordersData) ? ordersData.filter(order => order.sellerId?._id === user.id) : [];
            setOrders(sellerOrders);

            // Calculate stats
            const activeOrders = sellerOrders.filter(order => order.status === 'active').length;
            const completedOrders = sellerOrders.filter(order => order.status === 'completed').length;
            const totalEarnings = sellerOrders
                .filter(order => order.status === 'completed')
                .reduce((sum, order) => sum + (order.gigId?.price || 0), 0);

            setStats({
                totalGigs: gigsData.length || 0,
                activeOrders,
                completedOrders,
                totalEarnings,
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGig = async (gigId) => {
        if (!window.confirm('Are you sure you want to delete this gig?')) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/${gigId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                fetchDashboardData();
            }
        } catch (err) {
            console.error('Error deleting gig:', err);
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
                    Here's your freelancer dashboard overview
                </p>

                <div style={statsGrid}>
                    <div style={statCard}>
                        <div style={statNumber}>{stats.totalGigs}</div>
                        <div style={statLabel}>Total Gigs</div>
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
                        <div style={statNumber}>${stats.totalEarnings}</div>
                        <div style={statLabel}>Total Earnings</div>
                    </div>
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>My Gigs</h2>
                    <button style={addButton} onClick={() => navigate('/create-gig')}>
                        <MdAdd size={20} />
                        Create New Gig
                    </button>
                </div>

                {myGigs.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                        You haven't created any gigs yet. Start by creating your first gig!
                    </p>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Gig</th>
                                <th style={thStyle}>Price</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Created</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myGigs.map(gig => (
                                <tr key={gig._id}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 600 }}>{gig.title}</div>
                                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{gig.description}</div>
                                    </td>
                                    <td style={tdStyle}>${gig.price}</td>
                                    <td style={tdStyle}>{gig.category}</td>
                                    <td style={tdStyle}>{new Date(gig.createdAt).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <button
                                            style={actionBtn}
                                            onClick={() => navigate(`/edit-gig/${gig._id}`)}
                                            title="Edit"
                                        >
                                            <MdEdit size={18} color="#1dbf73" />
                                        </button>
                                        <button
                                            style={actionBtn}
                                            onClick={() => handleDeleteGig(gig._id)}
                                            title="Delete"
                                        >
                                            <MdDelete size={18} color="#e53e3e" />
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
                    <h2 style={sectionTitle}>My Orders</h2>
                </div>

                {orders.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                        No orders yet. Your orders will appear here when clients purchase your gigs.
                    </p>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Order ID</th>
                                <th style={thStyle}>Gig</th>
                                <th style={thStyle}>Buyer</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td style={tdStyle}>{order._id.slice(-8)}</td>
                                    <td style={tdStyle}>{order.gigId?.title || 'N/A'}</td>
                                    <td style={tdStyle}>{order.buyerId?.username || 'N/A'}</td>
                                    <td style={tdStyle}>${order.gigId?.price || 0}</td>
                                    <td style={tdStyle}>
                                        <span style={statusBadge(order.status)}>{order.status}</span>
                                    </td>
                                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboard; 