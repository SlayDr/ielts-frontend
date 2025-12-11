import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send reset email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-container">
        <div className="forgot-card">
          <h1>🔐 Forgot Password?</h1>
          
          {!submitted ? (
            <>
              <p className="subtitle">Enter your email and we'll send you a reset link.</p>
              
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.type === 'error' ? '⚠️' : '✓'} {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-state">
              <span className="success-icon">📧</span>
              <h2>Check Your Email</h2>
              <p>We've sent a password reset link to:</p>
              <p className="email-sent">{email}</p>
              <p className="helper-text">Didn't receive it? Check your spam folder or try again.</p>
              <button className="try-again-btn" onClick={() => setSubmitted(false)}>
                Try Again
              </button>
            </div>
          )}

          <Link to="/login" className="back-link">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;