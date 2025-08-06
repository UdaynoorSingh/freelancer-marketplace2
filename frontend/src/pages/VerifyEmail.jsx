import React, { useEffect, useState } from "react";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/auth/verify-email?token=${token}`
    )
      .then((res) => {
        if (res.ok) {
          setMessage("Email verified! Redirecting to login...");
          setTimeout(() => (window.location.href = "/login"), 2000);
        } else {
          res.text().then((text) => setMessage(text || "Verification failed."));
        }
      })
      .catch(() => setMessage("Verification failed. Please try again."));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", color: "#1dbf73", marginBottom: "1rem" }}
        >
          Email Verification
        </h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
