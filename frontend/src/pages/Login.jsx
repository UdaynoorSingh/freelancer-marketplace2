import React, { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const formContainer = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1dbf73 0%, #f7f7f7 100%)',
};
const formStyle = {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '400px',
};
const inputStyle = {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s',
};
const buttonStyle = {
    width: '100%',
    background: '#1dbf73',
    color: '#fff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.2s',
};
const errorStyle = { color: '#e53e3e', marginBottom: '1rem', fontWeight: 500 };

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await loginUser(form);
        if (res.token && res.user) {
            login(res.token, res.user);
            navigate('/');
        } else {
            setError(res.message || 'Login failed');
        }
    };

    return (
        <div style={formContainer}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center', color: '#1dbf73' }}>Login</h2>
                {error && <div style={errorStyle}>{error}</div>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
                <button type="submit" style={buttonStyle} onMouseOver={e => e.target.style.background = '#169c5f'} onMouseOut={e => e.target.style.background = '#1dbf73'}>Login</button>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.95rem' }}>
                    Don't have an account? <a href="/register" style={{ color: '#1dbf73', textDecoration: 'underline' }}>Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login; 