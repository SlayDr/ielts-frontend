import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upgrade.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const Upgrade = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceType: selectedPlan })
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="upgrade-page">
      <header className="upgrade-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>⭐ Upgrade to Premium</h1>
        <p className="subtitle">Unlock unlimited access to all features</p>
      </header>

      <main className="upgrade-main">
        <div className="plans-container">
          <div 
            className={`plan-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <h2>Monthly</h2>
            <div className="price">
              <span className="amount">$9.99</span>
              <span className="period">/month</span>
            </div>
            <p className="billing-info">Billed monthly</p>
          </div>

          <div 
            className={`plan-card ${selectedPlan === 'yearly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className="best-value">Best Value</div>
            <h2>Yearly</h2>
            <div className="price">
              <span className="amount">$79.99</span>
              <span className="period">/year</span>
            </div>
            <p className="billing-info">Billed annually</p>
            <p className="savings">Save 33% ($40/year)</p>
          </div>
        </div>

        <div className="features-list">
          <h3>Premium includes:</h3>
          <ul>
            <li>✅ Unlimited AI evaluations (Writing & Speaking)</li>
            <li>✅ Access to all 40+ Reading passages</li>
            <li>✅ Access to all 20+ Listening sections</li>
            <li>✅ Access to all Writing prompts</li>
            <li>✅ All Speaking Parts (1, 2 & 3)</li>
            <li>✅ Detailed model answers</li>
            <li>✅ Target band score advice</li>
            <li>✅ Progress analytics</li>
            <li>✅ Priority support</li>
          </ul>
        </div>

        <button 
          className="checkout-btn" 
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? 'Loading...' : `Subscribe ${selectedPlan === 'yearly' ? '@ $79.99/year' : '@ $9.99/month'}`}
        </button>

        <p className="guarantee">🔒 Secure payment via Stripe • Cancel anytime</p>
      </main>
    </div>
  );
};

export default Upgrade;