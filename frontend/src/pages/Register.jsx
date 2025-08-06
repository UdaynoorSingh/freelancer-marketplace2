import React, { useState, useEffect } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

const formContainer = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  padding: "2rem",
};
const formStyle = {
  background: "#fff",
  padding: "3rem",
  borderRadius: "20px",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  width: "100%",
  maxWidth: "400px",
  border: "1px solid #e2e8f0",
};
const inputStyle = {
  width: "100%",
  marginBottom: "1rem",
  padding: "0.75rem 1rem",
  border: `1px solid ${borderColor}`,
  borderRadius: "8px",
  fontSize: "1rem",
  outline: "none",
  transition: "all 0.2s ease",
  background: "#fff",
};
const buttonStyle = {
  width: "100%",
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
  color: "#fff",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "1rem",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};
const errorStyle = {
  color: dangerColor,
  marginBottom: "1rem",
  fontWeight: 500,
  textAlign: "center",
  fontSize: "0.9rem",
};
const successStyle = {
  color: successColor,
  marginBottom: "1rem",
  fontWeight: 500,
  textAlign: "center",
  fontSize: "0.9rem",
};
const roleContainer = {
  marginBottom: "1rem",
};
const roleLabel = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "600",
  color: textPrimary,
};
const roleOptions = {
  display: "flex",
  gap: "1rem",
};
const roleOption = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
};

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await registerUser(form);
    if (res.message === "User registered successfully") {
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <div style={formContainer}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textAlign: "center",
            color: textPrimary,
          }}
        >
          Register
        </h2>
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={inputStyle}
          required
        />
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

        <div style={roleContainer}>
          <label style={roleLabel}>I want to:</label>
          <div style={roleOptions}>
            <label style={roleOption}>
              <input
                type="radio"
                name="role"
                value="client"
                checked={form.role === "client"}
                onChange={handleChange}
              />
              Hire for a project
            </label>
            <label style={roleOption}>
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={form.role === "freelancer"}
                onChange={handleChange}
              />
              Work as a freelancer
            </label>
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          Register
        </button>
        <p
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: textSecondary,
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: primaryColor,
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.2s ease",
            }}
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
