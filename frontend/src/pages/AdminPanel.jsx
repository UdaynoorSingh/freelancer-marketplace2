import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const cardStyle = {
    maxWidth: 900,
    margin: '2.5rem auto',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    padding: '2.5rem 2rem 2rem 2rem',
};
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 16,
};
const thStyle = {
    background: '#f7f7f7',
    color: '#222',
    fontWeight: 700,
    padding: '0.7rem',
    borderBottom: '1px solid #eee',
};
const tdStyle = {
    padding: '0.7rem',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
};
const btnStyle = {
    background: '#1dbf73',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.5rem 1.2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
};

const AdminPanel = () => {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    // Frontend admin check
    if (user && user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
        return <div style={{ padding: '2rem', color: 'red', fontWeight: 600 }}>Admin access required.</div>;
    }

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token, msg]);

    const markCompleted = async (id) => {
        setMsg('');
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders/${id}/complete`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setMsg('Order marked as completed!');
        else setMsg(data.message || 'Failed to update order.');
    };

    return (
        <div style={cardStyle}>
            <h2 style={{ color: '#1dbf73', fontWeight: 700, marginBottom: 24 }}>Admin Panel - Orders</h2>
            {msg && <div style={{ color: msg.includes('completed') ? '#1dbf73' : 'red', marginBottom: 12 }}>{msg}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Order ID</th>
                            <th style={thStyle}>Gig</th>
                            <th style={thStyle}>Buyer</th>
                            <th style={thStyle}>Seller</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Created</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td style={tdStyle}>{order._id}</td>
                                <td style={tdStyle}>{order.gigId?.title || 'N/A'}</td>
                                <td style={tdStyle}>{order.buyerId?.username || 'N/A'}</td>
                                <td style={tdStyle}>{order.sellerId?.username || 'N/A'}</td>
                                <td style={tdStyle}>{order.status}</td>
                                <td style={tdStyle}>{new Date(order.createdAt).toLocaleString()}</td>
                                <td style={tdStyle}>
                                    {order.status !== 'completed' && (
                                        <button style={btnStyle} onClick={() => markCompleted(order._id)}>Mark as Completed</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel; 