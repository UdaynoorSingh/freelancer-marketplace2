import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const cardStyle = {
  maxWidth: 1200,
  margin: "2.5rem auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
  border: "1px solid #eee",
  padding: "2.5rem 2rem 2rem 2rem",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 16,
};
const thStyle = {
  background: "#f7f7f7",
  color: "#222",
  fontWeight: 700,
  padding: "0.7rem",
  borderBottom: "1px solid #eee",
};
const tdStyle = {
  padding: "0.7rem",
  borderBottom: "1px solid #eee",
  textAlign: "center",
};
const btnStyle = {
  background: "#1dbf73",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "0.5rem 1.2rem",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};
const tabContainer = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "1rem",
};
const tabStyle = {
  padding: "0.8rem 1.5rem",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1rem",
  color: "#666",
  borderRadius: "8px 8px 0 0",
};
const activeTabStyle = {
  ...tabStyle,
  background: "#1dbf73",
  color: "#fff",
};
const deleteBtnStyle = {
  ...btnStyle,
  background: "#e53e3e",
  marginLeft: "0.5rem",
};

const AdminPanel = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  if (user && user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
    return (
      <div style={{ padding: "2rem", color: "red", fontWeight: 600 }}>
        Admin access required.
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, [token, msg, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "orders") {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/orders`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else if (activeTab === "users") {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === "gigs") {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/gigs`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch gigs");
        const data = await res.json();
        setGigs(Array.isArray(data) ? data : []);
      } else if (activeTab === "reviews") {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/reviews`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id) => {
    setMsg("");
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/admin/orders/${id}/complete`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setMsg("Order marked as completed!");
      fetchData();
    } else {
      setMsg(data.message || "Failed to update order.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setMsg("User deleted successfully!");
      fetchData();
    } else {
      setMsg("Failed to delete user.");
    }
  };

  const deleteGig = async (gigId) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/admin/gigs/${gigId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setMsg("Gig deleted successfully!");
      fetchData();
    } else {
      setMsg("Failed to delete gig.");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/admin/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      setMsg("Review deleted successfully!");
      fetchData();
    } else {
      setMsg("Failed to delete review.");
    }
  };

  const renderOrders = () => (
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
        {orders.map((order) => (
          <tr key={order._id}>
            <td style={tdStyle}>{order._id}</td>
            <td style={tdStyle}>{order.serviceId?.title || "N/A"}</td>
            <td style={tdStyle}>{order.buyerId?.username || "N/A"}</td>
            <td style={tdStyle}>{order.sellerId?.username || "N/A"}</td>
            <td style={tdStyle}>{order.status}</td>
            <td style={tdStyle}>
              {new Date(order.createdAt).toLocaleString()}
            </td>
            <td style={tdStyle}>
              {order.status !== "completed" && (
                <button
                  style={btnStyle}
                  onClick={() => markCompleted(order._id)}
                >
                  Mark as Completed
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderUsers = () => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>User ID</th>
          <th style={thStyle}>Username</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Role</th>
          <th style={thStyle}>Verified</th>
          <th style={thStyle}>Created</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td style={tdStyle}>{user._id}</td>
            <td style={tdStyle}>{user.username}</td>
            <td style={tdStyle}>{user.email}</td>
            <td style={tdStyle}>{user.role}</td>
            <td style={tdStyle}>{user.verified ? "Yes" : "No"}</td>
            <td style={tdStyle}>{new Date(user.createdAt).toLocaleString()}</td>
            <td style={tdStyle}>
              <button
                style={deleteBtnStyle}
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderGigs = () => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Gig ID</th>
          <th style={thStyle}>Title</th>
          <th style={thStyle}>Seller</th>
          <th style={thStyle}>Price</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Created</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {gigs.map((gig) => (
          <tr key={gig._id}>
            <td style={tdStyle}>{gig._id}</td>
            <td style={tdStyle}>{gig.title}</td>
            <td style={tdStyle}>{gig.seller?.username || "N/A"}</td>
            <td style={tdStyle}>₹{gig.price}</td>
            <td style={tdStyle}>{gig.category}</td>
            <td style={tdStyle}>{new Date(gig.createdAt).toLocaleString()}</td>
            <td style={tdStyle}>
              <button style={deleteBtnStyle} onClick={() => deleteGig(gig._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderReviews = () => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Review ID</th>
          <th style={thStyle}>Gig</th>
          <th style={thStyle}>User</th>
          <th style={thStyle}>Rating</th>
          <th style={thStyle}>Comment</th>
          <th style={thStyle}>Created</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((review) => (
          <tr key={review._id}>
            <td style={tdStyle}>{review._id}</td>
            <td style={tdStyle}>{review.gigId?.title || "N/A"}</td>
            <td style={tdStyle}>{review.userId?.username || "N/A"}</td>
            <td style={tdStyle}>{review.rating}/5</td>
            <td style={tdStyle}>{review.comment}</td>
            <td style={tdStyle}>
              {new Date(review.timestamp).toLocaleString()}
            </td>
            <td style={tdStyle}>
              <button
                style={deleteBtnStyle}
                onClick={() => deleteReview(review._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={cardStyle}>
      <h2 style={{ color: "#1dbf73", fontWeight: 700, marginBottom: 24 }}>
        Admin Panel
      </h2>
      {msg && (
        <div
          style={{
            color:
              msg.includes("deleted") || msg.includes("completed")
                ? "#1dbf73"
                : "red",
            marginBottom: 12,
          }}
        >
          {msg}
        </div>
      )}

      <div style={tabContainer}>
        <button
          style={activeTab === "orders" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          style={activeTab === "users" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          style={activeTab === "gigs" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("gigs")}
        >
          Gigs
        </button>
        <button
          style={activeTab === "reviews" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          {activeTab === "orders" && renderOrders()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "gigs" && renderGigs()}
          {activeTab === "reviews" && renderReviews()}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
