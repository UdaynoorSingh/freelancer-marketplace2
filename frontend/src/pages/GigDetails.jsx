import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdStar,
  MdChevronLeft,
  MdChevronRight,
  MdEdit,
  MdDelete,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { deleteService, getService } from "../services/serviceApi";
import PaymentForm from "../components/PaymentForm";

const primaryColor = "#6366f1";
const secondaryColor = "#8b5cf6";
const accentColor = "#06b6d4";
const successColor = "#10b981";
const warningColor = "#f59e0b";
const dangerColor = "#ef4444";
const darkColor = "#1e293b";
const lightColor = "#f8fafc";
const textPrimary = "#1e293b";
const textSecondary = "#64748b";
const borderColor = "#e2e8f0";

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.06)",
  padding: 0,
  maxWidth: 500,
  margin: "2rem auto",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  border: "1px solid #e2e8f0",
};

const imageStyle = {
  width: "100%",
  height: 260,
  objectFit: "cover",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  background: `linear-gradient(135deg, ${lightColor} 0%, #e2e8f0 100%)`,
};

const carouselBtn = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.9)",
  border: "none",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 3,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const sellerRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  margin: "1rem 0 0.5rem 0",
};

const avatar = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: "#fff",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.1rem",
};

const btnRow = {
  display: "flex",
  gap: "1rem",
  marginTop: "2rem",
  justifyContent: "flex-end",
};

const actionBtn = {
  padding: "0.5rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
};

const editBtn = {
  ...actionBtn,
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: "#fff",
};

const deleteBtn = {
  ...actionBtn,
  background: dangerColor,
  color: "#fff",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBox = {
  background: "#fff",
  borderRadius: 12,
  padding: "2rem",
  boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
  minWidth: 320,
  textAlign: "center",
};

const modalBtnRow = {
  display: "flex",
  gap: "1rem",
  marginTop: "1.5rem",
  justifyContent: "center",
};

const modalBtn = {
  padding: "0.5rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
};

const modalDeleteBtn = {
  ...modalBtn,
  background: dangerColor,
  color: "#fff",
};

const modalCancelBtn = {
  ...modalBtn,
  background: "#eee",
  color: "#222",
};

const starStyle = {
  color: warningColor,
  marginRight: 2,
};

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [gig, setGig] = useState(null);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true);
      try {
        const data = await getService(id);
        if (data && data._id) {
          setGig(data);
        } else {
          setError(data.message || "Gig not found.");
        }
      } catch (err) {
        setError("Failed to fetch gig.");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  useEffect(() => {
    if (gig && gig._id) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/reviews/${gig._id}`)
        .then((res) => res.json())
        .then((data) => setReviews(Array.isArray(data) ? data : []));
    }
  }, [gig]);

  useEffect(() => {
    if (gig && gig._id && token) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/favorites/check/${gig._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setIsFavorite(data.isFavorite))
        .catch((err) => console.error("Error checking favorite status:", err));
    }
  }, [gig, token]);

  const handlePrev = () => {
    if (!gig?.images?.length) return;
    setIdx(idx > 0 ? idx - 1 : gig.images.length - 1);
  };

  const handleNext = () => {
    if (!gig?.images?.length) return;
    setIdx(idx < gig.images.length - 1 ? idx + 1 : 0);
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/favorites/remove/${gig._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          setIsFavorite(false);
        }
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/favorites/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ serviceId: gig._id }),
          }
        );
        if (response.ok) {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);
    const res = await deleteService(id, token);
    setLoading(false);
    if (res?.message === "Service deleted") {
      navigate("/");
    } else {
      setError(res.message || "Failed to delete gig.");
    }
  };

  const handlePurchase = async () => {
    setPurchaseMsg("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gigId: gig._id }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setPurchaseMsg("Order placed successfully!");
      } else {
        setPurchaseMsg(data.message || "Failed to place order.");
      }
    } catch (err) {
      setPurchaseMsg("Failed to place order.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMsg("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/reviews/${gig._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setReviewMsg("Review submitted!");
        setShowReviewForm(false);
        setReviews((prev) => [...prev, data]);
        localStorage.setItem("refreshSearch", "true");
      } else {
        setReviewMsg(data.message || "Failed to submit review.");
      }
    } catch (err) {
      setReviewMsg("Failed to submit review.");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (error)
    return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  if (!gig) return null;

  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : 0;

  const imageURL = gig.images?.[idx]
    ? `${process.env.REACT_APP_SERVER_URL}/uploads/${gig.images[idx]}`
    : "https://via.placeholder.com/320x180?text=No+Image";

  const isOwner =
    user && gig.seller && String(user.id) === String(gig.seller._id);
  const canReview =
    !reviews.some((r) => r.userId?._id === user?.id) && !isOwner;

  return (
    <div style={cardStyle}>
      <div style={{ position: "relative" }}>
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
        {!isOwner && (
          <button
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: isFavorite ? dangerColor : "#fff",
              border: "none",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
            }}
            onClick={handleToggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? (
              <MdFavorite size={20} color="#fff" />
            ) : (
              <MdFavoriteBorder size={20} color="#404145" />
            )}
          </button>
        )}
      </div>

      <div
        style={{
          padding: "0 1.2rem 1.2rem 1.2rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={sellerRow}>
          <div style={avatar}>
            {gig.seller?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <span style={{ color: textPrimary, fontWeight: 600 }}>
            {gig.seller?.username || "Unknown"}
          </span>
          {gig.seller?.email && (
            <span
              style={{
                color: textSecondary,
                fontSize: "0.97rem",
                marginLeft: 8,
              }}
            >
              {gig.seller.email}
            </span>
          )}
        </div>

        <div
          style={{
            color: textPrimary,
            fontWeight: 500,
            fontSize: "1.08rem",
            marginBottom: 6,
          }}
        >
          {gig.title}
        </div>
        <div
          style={{ color: textSecondary, fontSize: "0.98rem", marginBottom: 8 }}
        >
          {gig.description}
        </div>

        <div
          style={{ margin: "0.5rem 0", color: successColor, fontWeight: 500 }}
        >
          {gig.tags?.map((tag) => (
            <span
              key={tag}
              style={{
                marginRight: 8,
                fontSize: "0.95rem",
                background: "#f5f5f5",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
          <MdStar color={warningColor} size={18} />
          <span style={{ color: textPrimary, fontWeight: 600, marginLeft: 4 }}>
            {avgRating}
          </span>
          <span
            style={{ color: textSecondary, fontSize: "0.95rem", marginLeft: 4 }}
          >
            ({reviewCount})
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: textSecondary,
              fontSize: "0.95rem",
              marginRight: 4,
            }}
          >
            From
          </span>
          <span
            style={{ color: textPrimary, fontWeight: 700, fontSize: "1.1rem" }}
          >
            ₹{gig.price}
          </span>
        </div>

        {!isOwner && (
          <>
            <button
              style={{
                background: successColor,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.9rem 2.2rem",
                fontWeight: 700,
                fontSize: "1.1rem",
                margin: "1.5rem 0 0.5rem 0",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "background 0.2s",
              }}
              onClick={() => setShowPaymentModal(true)}
            >
              Purchase Now
            </button>
            <button
              style={{
                background: "#fff",
                color: successColor,
                border: `2px solid ${successColor}`,
                borderRadius: 8,
                padding: "0.9rem 2.2rem",
                fontWeight: 700,
                fontSize: "1.1rem",
                margin: "0.5rem 0 0.5rem 0",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "background 0.2s",
              }}
              onClick={() =>
                navigate(`/chat/${gig.seller?._id}`, {
                  state: { gigId: gig._id, gigTitle: gig.title },
                })
              }
            >
              Chat
            </button>
            {purchaseMsg && (
              <div
                style={{
                  color: purchaseMsg.includes("success") ? successColor : "red",
                  marginTop: 8,
                }}
              >
                {purchaseMsg}
              </div>
            )}
          </>
        )}

        {isOwner && (
          <div style={btnRow}>
            <button
              style={editBtn}
              onClick={() => navigate(`/edit-gig/${gig._id}`)}
            >
              <MdEdit size={18} /> Edit
            </button>
            <button style={deleteBtn} onClick={() => setShowDeleteModal(true)}>
              <MdDelete size={18} /> Delete
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: successColor, fontWeight: 700, marginBottom: 10 }}>
          Reviews
        </h3>
        {reviews.length === 0 && <div>No reviews yet.</div>}
        {reviews.map((r, i) => (
          <div
            key={i}
            style={{
              background: "#f7f7f7",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {r.userId?.username || "User"}
            </div>
            <div
              style={{ display: "flex", alignItems: "center", margin: "4px 0" }}
            >
              {[...Array(r.rating)].map((_, idx) => (
                <span key={idx} style={starStyle}>
                  ★
                </span>
              ))}
              {[...Array(5 - r.rating)].map((_, idx) => (
                <span key={idx} style={{ ...starStyle, color: "#ddd" }}>
                  ★
                </span>
              ))}
            </div>
            <div style={{ color: textSecondary, fontSize: "1rem" }}>
              {r.comment}
            </div>
            <div
              style={{
                color: textSecondary,
                fontSize: "0.92rem",
                marginTop: 2,
              }}
            >
              {new Date(r.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
        {canReview && !showReviewForm && (
          <button
            style={{
              background: successColor,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.7rem 1.5rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: 10,
            }}
            onClick={() => setShowReviewForm(true)}
          >
            Leave a Review
          </button>
        )}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            style={{
              marginTop: 12,
              background: "#fff",
              borderRadius: 8,
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600 }}>Rating: </label>
              <select
                value={reviewData.rating}
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    rating: Number(e.target.value),
                  })
                }
                style={{ marginLeft: 8, fontSize: "1rem" }}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600 }}>Comment: </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  padding: 8,
                  fontSize: "1rem",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: successColor,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 1.5rem",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            {reviewMsg && (
              <div
                style={{
                  color: reviewMsg.includes("submitted") ? successColor : "red",
                  marginTop: 8,
                }}
              >
                {reviewMsg}
              </div>
            )}
          </form>
        )}
      </div>

      {showDeleteModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ color: dangerColor, marginBottom: 16 }}>
              Delete Gig?
            </h3>
            <p>
              Are you sure you want to delete this gig? This action cannot be
              undone.
            </p>
            <div style={modalBtnRow}>
              <button style={modalDeleteBtn} onClick={handleDelete}>
                Delete
              </button>
              <button
                style={modalCancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, maxWidth: 600, width: "90%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: textPrimary, margin: 0 }}>
                Complete Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: textSecondary,
                }}
              >
                ×
              </button>
            </div>
            <PaymentForm
              gig={gig}
              onSuccess={(order) => {
                setPurchaseMsg("Payment successful! Order created.");
                setShowPaymentModal(false);
              }}
              onError={(error) => {
                setPurchaseMsg(`Payment failed: ${error}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetails;
