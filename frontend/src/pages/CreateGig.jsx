import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

const formStyle = {
  background: '#fff',
  borderRadius: '20px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  padding: '3rem',
  maxWidth: 500,
  margin: '2rem auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  border: '1px solid #e2e8f0',
};
const labelStyle = { fontWeight: 600, color: textPrimary };
const inputStyle = {
  padding: '0.75rem 1rem',
  border: `1px solid ${borderColor}`,
  borderRadius: '8px',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.2s ease',
  background: '#fff',
};
const btnStyle = {
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.8rem 1.5rem',
  fontWeight: 600,
  fontSize: '1.1rem',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const categories = [
  'Trending',
  'Graphics & Design',
  'Programming & Tech',
  'Digital Marketing',
  'Video & Animation',
  'Writing & Translation',
  'Music & Audio',
  'Business',
];

const CreateGig = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    price: '',
    category: categories[0],
    images: [],
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('tags', form.tags);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('seller', user?.id);
    form.images.forEach(img => formData.append('images', img));
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/services`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Gig created successfully!');
        setForm({ title: '', description: '', tags: '', price: '', category: categories[0], images: [] });
      } else {
        setError(data.message || 'Failed to create gig.');
      }
    } catch (err) {
      setError('Failed to create gig.');
    }
    setLoading(false);
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 style={{ color: textPrimary, fontWeight: 700, textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Create a Gig</h2>
      {error && <div style={{ color: dangerColor, fontWeight: 500, textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ color: successColor, fontWeight: 500, textAlign: 'center', fontSize: '0.9rem' }}>{success}</div>}
      <label style={labelStyle}>Title</label>
      <input style={inputStyle} name="title" value={form.title} onChange={handleChange} required />
      <label style={labelStyle}>Description</label>
      <textarea style={{ ...inputStyle, minHeight: 80 }} name="description" value={form.description} onChange={handleChange} required />
      <label style={labelStyle}>Tags (comma separated)</label>
      <input style={inputStyle} name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. website, react, node" />
      <label style={labelStyle}>Price (INR)</label>
      <input style={inputStyle} name="price" type="number" value={form.price} onChange={handleChange} required min={1} />
      <label style={labelStyle}>Category</label>
      <select style={inputStyle} name="category" value={form.category} onChange={handleChange}>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <label style={labelStyle}>Images (up to 5)</label>
      <input
        style={inputStyle}
        name="images"
        type="file"
        accept="image/*"
        onChange={handleChange}
        multiple
      />
      <button style={btnStyle} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Gig'}</button>
    </form>
  );
};

export default CreateGig; 