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

  // Settings state
  const [settings, setSettings] = useState({
    dailyGoal: 3,
    focusAreas: ['writing', 'speaking', 'reading', 'listening'],
    reminderEnabled: false,
    targetBand: 7
  });

  useEffect(() => {
    fetchProfile();
    fetchSettings();
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
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
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
                    { id: 'writing', icon: '✍️', label: 'Writing' },
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
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;