import React, { useEffect, useState } from 'react';
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

const avatarStyle = {
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: '#f7931e',
    color: '#fff',
    fontWeight: 700,
    fontSize: '3.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    letterSpacing: '-2px',
};

const nameStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#404145',
    marginBottom: 4,
};

const handleStyle = {
    color: '#888',
    fontSize: '1.1rem',
    marginBottom: 16,
    fontWeight: 500,
};

const infoStyle = {
    fontSize: '1.1rem',
    color: '#222',
    marginBottom: 8,
};

const Profile = () => {
    const { user } = useAuth();
    const [gigCount, setGigCount] = useState(0);

    useEffect(() => {
        if (user && user.id) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/search?seller=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setGigCount(data.length);
                });
        }
    }, [user]);

    if (!user) return <div style={{ padding: '2rem' }}>No user data.</div>;

    return (
        <div style={cardStyle}>
            <div style={avatarStyle}>
                {user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div style={nameStyle}>{user.username}</div>
            <div style={handleStyle}>@{user.username}</div>
            <div style={infoStyle}><b>Email:</b> {user.email}</div>
            <div style={infoStyle}><b>Gigs Uploaded:</b> {gigCount}</div>
        </div>
    );
};

export default Profile; 