import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfileSettings.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: ''
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

// Subscription state
  const [subscription, setSubscription] = useState({
    status: 'free',
    isPremium: false,
    expiryDate: null
  });
  const [cancelLoading, setCancelLoading] = useState(false);  
  // Settings state
  const [settings, setSettings] = useState({
    examType: 'academic',
    dailyGoal: 3,
    focusAreas: ['writing', 'speaking', 'reading', 'listening'],
    reminderEnabled: false,
    targetBand: 7
  });

  useEffect(() => {
    fetchProfile();
    fetchSettings();
    fetchSubscription();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile({ name: data.user.name, email: data.user.email });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings({
          examType: data.examType || 'academic',
          dailyGoal: data.dailyGoal || 3,
          focusAreas: data.focusAreas || ['writing', 'speaking', 'reading', 'listening'],
          reminderEnabled: data.reminderEnabled || false,
          targetBand: data.targetBand || 7
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/stripe/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription({
          status: data.subscription,
          isPremium: data.isPremium,
          expiryDate: data.subscriptionExpiry
        });
      }
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your Premium subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Subscription cancelled successfully' });
        setSubscription({ status: 'free', isPremium: false, expiryDate: null });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to cancel subscription' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to cancel subscription' });
    }
    setCancelLoading(false);
  };
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const toggleFocusArea = (area) => {
    setSettings(prev => {
      const areas = prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: areas };
    });
  };

  return (
    <div className="profile-settings">
      <header className="settings-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>⚙️ Settings</h1>
          <p className="subtitle">Manage your profile and study preferences</p>
        </div>
      </header>

      <main className="settings-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
          >
            👤 Profile
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => { setActiveTab('password'); setMessage({ type: '', text: '' }); }}
          >
            🔒 Password
          </button>
          <button
            className={`tab ${activeTab === 'study' ? 'active' : ''}`}
            onClick={() => { setActiveTab('study'); setMessage({ type: '', text: '' }); }}
          >
            📚 Study Plan
          </button>
          <button
            className={`tab ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => { setActiveTab('subscription'); setMessage({ type: '', text: '' }); }}
          >
            💳 Subscription
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? '✓' : '⚠'} {message.text}
          </div>
        )}

        <div className="tab-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Your email"
                />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'study' && (
            <form onSubmit={handleSettingsUpdate} className="settings-form">
              <div className="form-group">
                <label>IELTS Exam Type</label>
                <div className="exam-type-selector">
                  <button
                    type="button"
                    className={`exam-type-option ${settings.examType === 'academic' ? 'selected' : ''}`}
                    onClick={() => setSettings({ ...settings, examType: 'academic' })}
                  >
                    <span className="exam-icon">🎓</span>
                    <span className="exam-label">Academic</span>
                    <span className="exam-desc">University & Professional</span>
                  </button>
                  <button
                    type="button"
                    className={`exam-type-option ${settings.examType === 'general' ? 'selected' : ''}`}
                    onClick={() => setSettings({ ...settings, examType: 'general' })}
                  >
                    <span className="exam-icon">🌍</span>
                    <span className="exam-label">General Training</span>
                    <span className="exam-desc">Work & Migration</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Target Band Score</label>
                <div className="band-selector">
                  {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                    <button
                      key={band}
                      type="button"
                      className={`band-option ${settings.targetBand === band ? 'selected' : ''}`}
                      onClick={() => setSettings({ ...settings, targetBand: band })}
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Daily Practice Goal</label>
                <div className="goal-selector">
                  {[1, 2, 3, 5, 10].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      className={`goal-option ${settings.dailyGoal === goal ? 'selected' : ''}`}
                      onClick={() => setSettings({ ...settings, dailyGoal: goal })}
                    >
                      {goal} {goal === 1 ? 'session' : 'sessions'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Focus Areas</label>
                <div className="focus-areas">
                  {[
                    { id: 'writing', icon: '✏️', label: 'Writing' },
                    { id: 'speaking', icon: '🎤', label: 'Speaking' },
                    { id: 'reading', icon: '📖', label: 'Reading' },
                    { id: 'listening', icon: '🎧', label: 'Listening' }
                  ].map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      className={`focus-option ${settings.focusAreas.includes(area.id) ? 'selected' : ''}`}
                      onClick={() => toggleFocusArea(area.id)}
                    >
                      <span className="focus-icon">{area.icon}</span>
                      <span className="focus-label">{area.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="toggle-label">
                  <span>Daily Reminder</span>
                  <div 
                    className={`toggle ${settings.reminderEnabled ? 'active' : ''}`}
                    onClick={() => setSettings({ ...settings, reminderEnabled: !settings.reminderEnabled })}
                  >
                    <div className="toggle-knob"></div>
                  </div>
                </label>
                <p className="helper-text">Get reminded to practice every day</p>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
         {activeTab === 'subscription' && (
            <div className="subscription-content">
              <div className="subscription-status">
                <h3>Current Plan</h3>
                <div className={`plan-badge ${subscription.isPremium ? 'premium' : 'free'}`}>
                  {subscription.isPremium ? '⭐ Premium' : '🆓 Free'}
                </div>
                {subscription.isPremium && subscription.expiryDate && (
                  <p className="expiry-date">
                    Valid until: {new Date(subscription.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {subscription.isPremium ? (
                <div className="premium-info">
                  <h3>Your Premium Benefits</h3>
                  <ul className="benefits-list">
                    <li>✅ Unlimited AI evaluations</li>
                    <li>✅ Access to all Reading passages</li>
                    <li>✅ Access to all Listening sections</li>
                    <li>✅ All Writing prompts</li>
                    <li>✅ All Speaking Parts (1, 2 & 3)</li>
                    <li>✅ All Full Tests</li>
                    <li>✅ Detailed model answers</li>
                  </ul>
                  
                  <div className="cancel-section">
                    <h4>Cancel Subscription</h4>
                    <p className="cancel-warning">
                      If you cancel, you'll lose access to premium features at the end of your billing period.
                    </p>
                    <button 
                      className="cancel-btn" 
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="free-info">
                  <h3>Free Plan Limits</h3>
                  <ul className="limits-list">
                    <li>⚠️ 3 AI evaluations per day</li>
                    <li>⚠️ 5 Reading passages</li>
                    <li>⚠️ 5 Listening sections</li>
                    <li>⚠️ 5 Writing prompts</li>
                    <li>⚠️ Speaking Part 1 only</li>
                    <li>⚠️ 1 Full Test per module</li>
                  </ul>
                  
                  <div className="upgrade-section">
                    <h4>Upgrade to Premium</h4>
                    <p>Get unlimited access to all features and content.</p>
                    <button 
                      className="upgrade-btn-large" 
                      onClick={() => navigate('/upgrade')}
                    >
                      ⭐ Upgrade to Premium
                    </button>
                  </div>
                </div>
              )}
            </div>
          )} 
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
