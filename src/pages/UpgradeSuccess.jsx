import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upgrade.css';

const UpgradeSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="upgrade-page">
      <div className="success-container">
        <div className="success-icon">🎉</div>
        <h1>Welcome to Premium!</h1>
        <p>Your payment was successful. You now have unlimited access to all features.</p>
        <div className="success-features">
          <p>✅ Unlimited AI evaluations</p>
          <p>✅ All Reading passages unlocked</p>
          <p>✅ All Listening sections unlocked</p>
          <p>✅ All Writing prompts unlocked</p>
          <p>✅ All Speaking parts unlocked</p>
        </div>
        <button className="checkout-btn" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
        <p className="redirect-text">Redirecting to dashboard in 5 seconds...</p>
      </div>
    </div>
  );
};

export default UpgradeSuccess;