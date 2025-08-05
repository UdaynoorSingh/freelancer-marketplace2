import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const cardStyle = {
  maxWidth: 700,
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

const Orders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError('Failed to fetch orders.');
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  return (
    <div style={cardStyle}>
      <h2 style={{ color: '#1dbf73', fontWeight: 700, marginBottom: 24 }}>My Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Gig</th>
              <th style={thStyle}>Other Party</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const isBuyer = order.buyerId._id === user.id;
              const other = isBuyer ? order.sellerId : order.buyerId;
              return (
                <tr key={order._id}>
                  <td style={tdStyle}>{isBuyer ? 'Buyer' : 'Seller'}</td>
                  <td style={tdStyle}>{order.serviceId?.title || 'N/A'}</td>
                  <td style={tdStyle}>{other.username} <br /><span style={{ color: '#888', fontSize: '0.97rem' }}>{other.email}</span></td>
                  <td style={tdStyle}>{order.status}</td>
                  <td style={tdStyle}>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders; 