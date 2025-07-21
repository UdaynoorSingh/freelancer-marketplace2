import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdStar, MdChevronLeft, MdChevronRight, MdEdit, MdDelete } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { deleteService, getService } from '../services/serviceApi';

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  padding: 0,
  maxWidth: 500,
  margin: '2rem auto',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
};
const imageStyle = {
  width: '100%',
  height: 260,
  objectFit: 'cover',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  background: '#f5f5f5',
};
const carouselBtn = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.8)',
  border: 'none',
  borderRadius: '50%',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 3,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
};
const sellerRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  margin: '1rem 0 0.5rem 0',
};
const avatar = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: '#f7931e',
  color: '#fff',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
};
const btnRow = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
  justifyContent: 'flex-end',
};
const actionBtn = {
  padding: '0.5rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};
const editBtn = {
  ...actionBtn,
  background: '#1dbf73',
  color: '#fff',
};
const deleteBtn = {
  ...actionBtn,
  background: '#e53e3e',
  color: '#fff',
};
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};
const modalBox = {
  background: '#fff',
  borderRadius: 12,
  padding: '2rem',
  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
  minWidth: 320,
  textAlign: 'center',
};
const modalBtnRow = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
  justifyContent: 'center',
};
const modalBtn = {
  padding: '0.5rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};
const modalDeleteBtn = {
  ...modalBtn,
  background: '#e53e3e',
  color: '#fff',
};
const modalCancelBtn = {
  ...modalBtn,
  background: '#eee',
  color: '#222',
};

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [gig, setGig] = useState(null);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState('');

  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true);
      try {
        const data = await getService(id);
        if (data && data._id) {
          setGig(data);
        } else {
          setError(data.message || 'Gig not found.');
        }
      } catch (err) {
        setError('Failed to fetch gig.');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handlePrev = () => {
    if (!gig?.images?.length) return;
    setIdx(idx > 0 ? idx - 1 : gig.images.length - 1);
  };

  const handleNext = () => {
    if (!gig?.images?.length) return;
    setIdx(idx < gig.images.length - 1 ? idx + 1 : 0);
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);
    const res = await deleteService(id, token);
    setLoading(false);
    if (res?.message === 'Service deleted') {
      navigate('/');
    } else {
      setError(res.message || 'Failed to delete gig.');
    }
  };

  const handlePurchase = async () => {
    setPurchaseMsg('');
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gigId: gig._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setPurchaseMsg('Order placed successfully!');
      } else {
        setPurchaseMsg(data.message || 'Failed to place order.');
      }
    } catch (err) {
      setPurchaseMsg('Failed to place order.');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!gig) return null;

  const reviewCount = gig.reviews?.length || 0;
  const avgRating = reviewCount
    ? (gig.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : gig.rating || 4.9;

  const imageURL = gig.images?.[idx]
    ? `${process.env.REACT_APP_SERVER_URL}/uploads/${gig.images[idx]}`
    : 'https://via.placeholder.com/320x180?text=No+Image';

  const isOwner = user && gig.seller && String(user.id) === String(gig.seller._id);

  return (
    <div style={cardStyle}>
      <div style={{ position: 'relative' }}>
        {gig.images?.length > 1 && (
          <>
            <button style={{ ...carouselBtn, left: 8 }} onClick={handlePrev}>
              <MdChevronLeft size={22} />
            </button>
            <button style={{ ...carouselBtn, right: 8 }} onClick={handleNext}>
              <MdChevronRight size={22} />
            </button>
          </>
        )}
        <img src={imageURL} alt={gig.title} style={imageStyle} />
      </div>

      <div style={{ padding: '0 1.2rem 1.2rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={sellerRow}>
          <div style={avatar}>{gig.seller?.username?.[0]?.toUpperCase() || 'U'}</div>
          <span style={{ color: '#222', fontWeight: 600 }}>{gig.seller?.username || 'Unknown'}</span>
          {gig.seller?.email && (
            <span style={{ color: '#888', fontSize: '0.97rem', marginLeft: 8 }}>
              {gig.seller.email}
            </span>
          )}
          <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 'auto' }}>Level 1 ◆◆</span>
        </div>

        <div style={{ color: '#222', fontWeight: 500, fontSize: '1.08rem', marginBottom: 6 }}>{gig.title}</div>
        <div style={{ color: '#555', fontSize: '0.98rem', marginBottom: 8 }}>{gig.description}</div>

        <div style={{ margin: '0.5rem 0', color: '#1dbf73', fontWeight: 500 }}>
          {gig.tags?.map(tag => (
            <span key={tag} style={{ marginRight: 8, fontSize: '0.95rem', background: '#f5f5f5', borderRadius: 6, padding: '2px 8px' }}>
              #{tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
          <MdStar color="#f7931e" size={18} />
          <span style={{ color: '#222', fontWeight: 600, marginLeft: 4 }}>{avgRating}</span>
          <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 4 }}>({reviewCount})</span>
          <span style={{ marginLeft: 'auto', color: '#555', fontSize: '0.95rem', marginRight: 4 }}>From</span>
          <span style={{ color: '#222', fontWeight: 700, fontSize: '1.1rem' }}>₹{gig.price}</span>
        </div>

        {/* Purchase Button (not for owner) */}
        {!isOwner && (
          <>
            <button
              style={{
                background: '#1dbf73',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.9rem 2.2rem',
                fontWeight: 700,
                fontSize: '1.1rem',
                margin: '1.5rem 0 0.5rem 0',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                transition: 'background 0.2s',
              }}
              onClick={handlePurchase}
            >
              Purchase
            </button>
            <button
              style={{
                background: '#fff',
                color: '#1dbf73',
                border: '2px solid #1dbf73',
                borderRadius: 8,
                padding: '0.9rem 2.2rem',
                fontWeight: 700,
                fontSize: '1.1rem',
                margin: '0.5rem 0 0.5rem 0',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                transition: 'background 0.2s',
              }}
              onClick={() => navigate(`/chat/${gig.seller?._id}`)}
            >
              Chat
            </button>
            {purchaseMsg && <div style={{ color: purchaseMsg.includes('success') ? '#1dbf73' : 'red', marginTop: 8 }}>{purchaseMsg}</div>}
          </>
        )}

        {isOwner && (
          <div style={btnRow}>
            <button style={editBtn} onClick={() => navigate(`/edit-gig/${gig._id}`)}>
              <MdEdit size={18} /> Edit
            </button>
            <button style={deleteBtn} onClick={() => setShowDeleteModal(true)}>
              <MdDelete size={18} /> Delete
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ color: '#e53e3e', marginBottom: 16 }}>Delete Gig?</h3>
            <p>Are you sure you want to delete this gig? This action cannot be undone.</p>
            <div style={modalBtnRow}>
              <button style={modalDeleteBtn} onClick={handleDelete}>Delete</button>
              <button style={modalCancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetails;