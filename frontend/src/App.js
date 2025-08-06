import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import SearchResults from "./pages/SearchResults";
import CreateGig from "./pages/CreateGig";
import EditGig from "./pages/EditGig";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import { MdStar, MdFavoriteBorder, MdFavorite } from "react-icons/md";
import GigDetails from "./pages/GigDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import Favorites from "./pages/Favorites";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import TestPayment from "./pages/TestPayment";

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

const headerStyle = {
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: "#fff",
  padding: "1rem 2rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const searchContainer = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  maxWidth: 600,
  margin: "0 auto",
  background: "#fff",
  borderRadius: "12px",
  padding: "0.5rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const searchInput = {
  flex: 1,
  padding: "0.75rem 1rem",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  outline: "none",
  background: "#f8fafc",
};

const searchBtn = {
  background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.75rem 1.5rem",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const searchBtnHover = {
  ...searchBtn,
  transform: "translateY(-1px)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  padding: 0,
  width: 320,
  minWidth: 320,
  maxWidth: 320,
  margin: "1rem",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s ease",
  border: "1px solid #e2e8f0",
  flex: "0 0 320px",
};

const cardStyleHover = {
  ...cardStyle,
  transform: "translateY(-4px)",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

const imageStyle = {
  width: "100%",
  height: 200,
  objectFit: "cover",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  background: `linear-gradient(135deg, ${lightColor} 0%, #e2e8f0 100%)`,
};

const sellerRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  margin: "0.75rem 0 0.5rem 0",
  padding: "0 1rem",
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
  fontSize: "1rem",
};

const titleStyle = {
  color: textPrimary,
  fontWeight: 600,
  fontSize: "1.1rem",
  marginBottom: "0.5rem",
  padding: "0 1rem",
  lineHeight: 1.3,
};

const descriptionStyle = {
  color: textSecondary,
  fontSize: "0.95rem",
  marginBottom: "0.75rem",
  padding: "0 1rem",
  lineHeight: 1.4,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  maxHeight: "1.4em",
};

const priceStyle = {
  color: successColor,
  fontWeight: 700,
  fontSize: "1.2rem",
  marginBottom: "0.5rem",
  padding: "0 1rem",
};

const fromStyle = {
  color: textSecondary,
  fontSize: "0.95rem",
  marginRight: 4,
};

const btnRow = {
  display: "flex",
  gap: "0.5rem",
  padding: "0 1rem 1rem 1rem",
  marginTop: "auto",
};

const viewBtn = {
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.75rem 1rem",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  width: "100%",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const viewBtnHover = {
  ...viewBtn,
  transform: "translateY(-1px)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
};

const gridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "2rem",
  marginTop: "2rem",
  justifyContent: "center",
};

const responsiveStyles = `
  @media (max-width: 1200px) {
    .gig-grid {
      gap: 1.5rem;
    }
    .gig-card {
      width: 300px;
      min-width: 300px;
      max-width: 300px;
      flex: 0 0 300px;
    }
  }
  @media (max-width: 768px) {
    .gig-grid {
      gap: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gig-card {
      width: 100%;
      max-width: 400px;
      min-width: 320px;
      flex: 0 0 auto;
    }
  }
  @media (max-width: 480px) {
    .gig-grid {
      gap: 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gig-card {
      width: 100%;
      max-width: 350px;
      min-width: 300px;
      flex: 0 0 auto;
    }
  }
  @media (max-width: 360px) {
    .gig-grid {
      gap: 0.6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gig-card {
      width: 100%;
      max-width: 320px;
      min-width: 280px;
      flex: 0 0 auto;
    }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/services/search`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGigs(data);
        } else {
          setError(data.message || "No gigs found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch gigs.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setFavorites(new Set(data.map((fav) => fav._id)));
          }
        })
        .catch((err) => console.error("Error fetching favorites:", err));
    }
  }, [token]);

  const handleToggleFavorite = async (serviceId) => {
    try {
      if (favorites.has(serviceId)) {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/favorites/remove/${serviceId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          setFavorites((prev) => {
            const newFavorites = new Set(prev);
            newFavorites.delete(serviceId);
            return newFavorites;
          });
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
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
            body: JSON.stringify({ serviceId }),
          }
        );
        if (response.ok) {
          setFavorites((prev) => new Set([...prev, serviceId]));
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
      className="container"
    >
      <style>{responsiveStyles}</style>
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          Loading...
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#e53e3e",
            fontSize: "1.1rem",
          }}
        >
          {error}
        </div>
      ) : (
        <div style={gridStyle} className="gig-grid">
          {gigs.map((gig) => (
            <div key={gig._id} style={cardStyle} className="gig-card">
              <div style={{ position: "relative" }}>
                <img
                  src={
                    gig.images && gig.images.length > 0
                      ? `${process.env.REACT_APP_SERVER_URL}/uploads/${gig.images[0]}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={gig.title}
                  style={imageStyle}
                />
                {token && (
                  <button
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: favorites.has(gig._id) ? "#e53e3e" : "#fff",
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
                    onClick={() => handleToggleFavorite(gig._id)}
                    title={
                      favorites.has(gig._id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.has(gig._id) ? (
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
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={sellerRow}>
                    <div style={avatar}>
                      {gig.seller?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span style={{ color: "#222", fontWeight: 600 }}>
                      {gig.seller?.username || "Unknown"}
                    </span>
                  </div>
                  <div style={titleStyle}>{gig.title}</div>
                  <div style={descriptionStyle}>{gig.description}</div>
                  {gig.tags && gig.tags.length > 0 && (
                    <div
                      style={{
                        marginBottom: "0.5rem",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.3rem",
                      }}
                    >
                      {gig.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "0.85rem",
                            background: "#1dbf73",
                            color: "#fff",
                            borderRadius: 6,
                            padding: "0.2rem 0.5rem",
                            fontWeight: 500,
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <MdStar color="#f7931e" size={16} />
                    <span
                      style={{
                        color: "#222",
                        fontWeight: 600,
                        marginLeft: 4,
                        fontSize: "0.9rem",
                      }}
                    >
                      {gig.avgRating || "0.0"}
                    </span>
                    <span
                      style={{
                        color: "#888",
                        fontSize: "0.85rem",
                        marginLeft: 4,
                      }}
                    >
                      ({gig.reviewCount || 0})
                    </span>
                  </div>
                  <div style={priceStyle}>
                    <span style={fromStyle}>from</span>
                    <span style={priceStyle}>₹{gig.price}</span>
                  </div>
                </div>
                <div style={btnRow}>
                  <button
                    style={viewBtn}
                    onClick={() => navigate(`/gig/${gig._id}`)}
                    onMouseOver={(e) => (e.target.style.background = "#169c5f")}
                    onMouseOut={(e) => (e.target.style.background = "#1dbf73")}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { user, token } = useAuth();
  if (user && token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      <CategoryBar />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Home />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <SearchResults />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <CreateGig />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/gig/:id"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <GigDetails />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-gig/:id"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <EditGig />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Orders />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Chat />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Chat />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <AdminPanel />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Favorites />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer-dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <FreelancerDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <ClientDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-payment"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <TestPayment />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
