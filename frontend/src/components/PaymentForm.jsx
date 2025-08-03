import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Payment form component
const PaymentFormComponent = ({ gig, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        createPaymentIntent();
    }, [gig]);

    const createPaymentIntent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/payment/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: gig.price,
                    gigId: gig._id,
                    gigTitle: gig.title,
                    sellerId: gig.seller._id
                })
            });

            const data = await response.json();
            if (response.ok) {
                setClientSecret(data.clientSecret);
            } else {
                setError(data.message || 'Failed to create payment intent');
            }
        } catch (err) {
            setError('Failed to create payment intent');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet');
            setLoading(false);
            return;
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.username || 'User'
                }
            }
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            // Confirm payment with backend
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/payment/confirm-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        gigId: gig._id
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    onSuccess(data.order);
                } else {
                    setError(data.message || 'Failed to confirm payment');
                }
            } catch (err) {
                setError('Failed to confirm payment');
            }
        }

        setLoading(false);
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div style={headerStyle}>
                <h2 style={{ color: textPrimary, margin: 0 }}>Complete Payment</h2>
                <p style={{ color: textSecondary, margin: '0.5rem 0 1rem 0' }}>
                    Pay ${gig.price} for "{gig.title}"
                </p>
            </div>

            <div style={cardContainerStyle}>
                <label style={labelStyle}>Card Details</label>
                <CardElement options={cardElementOptions} />
            </div>

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                style={{
                    ...buttonStyle,
                    opacity: (!stripe || loading) ? 0.6 : 1,
                    cursor: (!stripe || loading) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Processing...' : `Pay $${gig.price}`}
            </button>
        </form>
    );
};

// Main Payment Form component
const PaymentForm = ({ gig, onSuccess, onError }) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentFormComponent gig={gig} onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
};

// Styles
const primaryColor = '#6366f1';
const secondaryColor = '#8b5cf6';
const textPrimary = '#1e293b';
const textSecondary = '#64748b';
const dangerColor = '#ef4444';

const formStyle = {
    maxWidth: 500,
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
    border: '1px solid #e2e8f0',
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
};

const cardContainerStyle = {
    marginBottom: '2rem',
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: textPrimary,
    fontWeight: 600,
    fontSize: '1rem',
};

const buttonStyle = {
    width: '100%',
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    color: '#fff',
    padding: '1rem',
    border: 'none',
    borderRadius: 8,
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const errorStyle = {
    background: '#fef2f2',
    color: dangerColor,
    padding: '0.75rem',
    borderRadius: 6,
    marginBottom: '1rem',
    border: '1px solid #fecaca',
    fontSize: '0.9rem',
};

export default PaymentForm; 