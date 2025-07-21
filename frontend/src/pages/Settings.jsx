import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const cardStyle = {
    maxWidth: 400,
    margin: '3rem auto',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
    padding: '2.5rem 2rem 2rem 2rem',
    textAlign: 'center',
};

const inputStyle = {
    width: '100%',
    padding: '0.7rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
    marginBottom: '1.2rem',
    background: '#f7f7f7',
};

const btnStyle = {
    background: '#1dbf73',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.8rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
};

const Settings = () => {
    const { user, token, login } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [email] = useState(user?.email || '');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/update-username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Username updated successfully!');
                // Update user context
                login(token, { ...user, username });
            } else {
                setError(data.message || 'Failed to update username.');
            }
        } catch (err) {
            setError('Failed to update username.');
        }
        setLoading(false);
    };

    if (!user) return <div style={{ padding: '2rem' }}>No user data.</div>;

    return (
        <div style={cardStyle}>
            <h2 style={{ color: '#1dbf73', fontWeight: 700, marginBottom: 24 }}>Account Settings</h2>
            <form onSubmit={handleSubmit}>
                <label style={{ fontWeight: 600, color: '#222', display: 'block', marginBottom: 6 }}>Username</label>
                <input
                    style={inputStyle}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <label style={{ fontWeight: 600, color: '#222', display: 'block', marginBottom: 6 }}>Email</label>
                <input style={inputStyle} value={email} disabled />
                <button style={btnStyle} type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </form>
            {success && <div style={{ color: '#1dbf73', marginTop: 12 }}>{success}</div>}
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
            <div style={{ color: '#888', fontSize: '0.98rem', marginTop: 24 }}>
                More settings coming soon...
            </div>
        </div>
    );
};

export default Settings; 