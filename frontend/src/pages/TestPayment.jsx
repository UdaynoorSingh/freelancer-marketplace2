import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PaymentForm from "../components/PaymentForm";

const TestPayment = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const testGig = {
    _id: "test-gig-id",
    title: "Test Service",
    price: 500,
    seller: {
      _id: "test-seller-id",
      username: "TestSeller",
    },
  };

  const handlePaymentSuccess = (order) => {
    setMessage(`Payment successful! Order ID: ${order.id}`);
  };

  const handlePaymentError = (error) => {
    setMessage(`Payment failed: ${error}`);
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Please log in to test payments.
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Payment Test Page
      </h1>

      {message && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "2rem",
            borderRadius: 8,
            background: message.includes("successful") ? "#d4edda" : "#f8d7da",
            color: message.includes("successful") ? "#155724" : "#721c24",
            border: `1px solid ${
              message.includes("successful") ? "#c3e6cb" : "#f5c6cb"
            }`,
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 16,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Test Payment</h2>
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          This is a test payment page. Use Stripe test card numbers:
        </p>
        <ul style={{ marginBottom: "2rem", color: "#666" }}>
          <li>
            <strong>Success:</strong> 4242 4242 4242 4242
          </li>
          <li>
            <strong>Decline:</strong> 4000 0000 0000 0002
          </li>
          <li>
            <strong>Expiry:</strong> Any future date
          </li>
          <li>
            <strong>CVC:</strong> Any 3 digits
          </li>
        </ul>

        <PaymentForm
          gig={testGig}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default TestPayment;
