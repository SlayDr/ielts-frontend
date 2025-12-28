import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    essaysCount: 0,
    speakingCount: 0,
    readingCount: 0,
    listeningCount: 0
  });
const [examType, setExamType] = useState('academic');
const [targetBand, setTargetBand] = useState(7);
const [usage, setUsage] = useState(null);
const [averages, setAverages] = useState({
  writing: null,
  speaking: null,
  reading: null,
  listening: null
});
  useEffect(() => {
    fetchStats();
  }, []);
useEffect(() => {
  const fetchExamType = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExamType(data.examType || 'academic');
        setTargetBand(data.targetBand || 7);
      }
    } catch (err) {
      console.error('Failed to fetch exam type:', err);
    }
  };
  fetchExamType();
}, []);
useEffect(() => {
  const fetchAverages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/averages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAverages(data);
      }
    } catch (err) {
      console.error('Failed to fetch averages:', err);
    }
  };
  fetchAverages();
}, []);
useEffect(() => {
  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/usage`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  };
  fetchUsage();
}, []);
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalPractice = stats.essaysCount + stats.speakingCount + stats.readingCount + stats.listeningCount;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>IELTS Master <span className="exam-type-badge">{examType === 'general' ? '🌍 General Training' : '🎓 Academic'}</span></h1>
          <div className="user-section">
            <span className="user-name">{user?.name || 'Student'}</span>
            <button className="settings-btn" onClick={() => navigate('/settings')}>⚙️</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Welcome back, {user?.name || 'Student'}! 👋</h2>
          <p>Continue your IELTS preparation journey</p>
        </section>

        <section className="stats-section">
          <h3>Your Progress</h3>
          <div className="stats-grid">
            <div className="stat-card" onClick={() => navigate('/history')}>
              <span className="stat-icon">✍️</span>
              <span className="stat-number">{stats.essaysCount}</span>
              <span className="stat-label">Writing</span>
            </div>
            <div className="stat-card" onClick={() => navigate('/speaking-history')}>
              <span className="stat-icon">🎤</span>
              <span className="stat-number">{stats.speakingCount}</span>
              <span className="stat-label">Speaking</span>
            </div>
            <div className="stat-card" onClick={() => navigate('/reading-history')}>
              <span className="stat-icon">📖</span>
              <span className="stat-number">{stats.readingCount}</span>
              <span className="stat-label">Reading</span>
            </div>
            <div className="stat-card" onClick={() => navigate('/listening-history')}>
              <span className="stat-icon">🎧</span>
              <span className="stat-number">{stats.listeningCount}</span>
              <span className="stat-label">Listening</span>
            </div>
          </div>
        </section>

<section className="target-section">
          <h3>🎯 Target Band: {targetBand}</h3>
          <div className="target-grid">
            <div className="target-card">
              <span className="skill-name">Writing</span>
              <div className="score-display">
                <span className="current-score">{averages.writing !== null ? averages.writing.toFixed(1) : '-'}</span>
                <span className="target-arrow">→</span>
                <span className="target-score">{targetBand}</span>
              </div>
              {averages.writing !== null && (
                <span className={`gap-indicator ${averages.writing >= targetBand ? 'achieved' : ''}`}>
                  {averages.writing >= targetBand ? '✅ Target reached!' : `${(targetBand - averages.writing).toFixed(1)} to go`}
                </span>
              )}
            </div>
            <div className="target-card">
              <span className="skill-name">Speaking</span>
              <div className="score-display">
                <span className="current-score">{averages.speaking !== null ? averages.speaking.toFixed(1) : '-'}</span>
                <span className="target-arrow">→</span>
                <span className="target-score">{targetBand}</span>
              </div>
              {averages.speaking !== null && (
                <span className={`gap-indicator ${averages.speaking >= targetBand ? 'achieved' : ''}`}>
                  {averages.speaking >= targetBand ? '✅ Target reached!' : `${(targetBand - averages.speaking).toFixed(1)} to go`}
                </span>
              )}
            </div>
            <div className="target-card">
              <span className="skill-name">Reading</span>
              <div className="score-display">
                <span className="current-score">{averages.reading !== null ? averages.reading.toFixed(1) : '-'}</span>
                <span className="target-arrow">→</span>
                <span className="target-score">{targetBand}</span>
              </div>
              {averages.reading !== null && (
                <span className={`gap-indicator ${averages.reading >= targetBand ? 'achieved' : ''}`}>
                  {averages.reading >= targetBand ? '✅ Target reached!' : `${(targetBand - averages.reading).toFixed(1)} to go`}
                </span>
              )}
            </div>
            <div className="target-card">
              <span className="skill-name">Listening</span>
              <div className="score-display">
                <span className="current-score">{averages.listening !== null ? averages.listening.toFixed(1) : '-'}</span>
                <span className="target-arrow">→</span>
                <span className="target-score">{targetBand}</span>
              </div>
              {averages.listening !== null && (
                <span className={`gap-indicator ${averages.listening >= targetBand ? 'achieved' : ''}`}>
                  {averages.listening >= targetBand ? '✅ Target reached!' : `${(targetBand - averages.listening).toFixed(1)} to go`}
                </span>
              )}
            </div>
          </div>
        </section>
         {usage && (
          <section className="usage-section">
            <h3>📊 Today's Usage</h3>
            <div className="usage-card">
              <div className="usage-info">
                <span className="usage-icon">🤖</span>
                <span className="usage-label">AI Evaluations</span>
                <span className="usage-count">
                  {usage.isPremium ? '∞' : `${usage.usage.aiEvaluations.used}/${usage.usage.aiEvaluations.limit}`}
                </span>
              </div>
              {!usage.isPremium && (
                <div className="usage-bar">
                  <div 
                    className="usage-progress" 
                    style={{ width: `${(usage.usage.aiEvaluations.used / usage.usage.aiEvaluations.limit) * 100}%` }}
                  ></div>
                </div>
              )}
              {!usage.isPremium && usage.usage.aiEvaluations.remaining <= 1 && (
                <p className="usage-warning">
                  ⚠️ {usage.usage.aiEvaluations.remaining === 0 
                    ? 'Limit reached! Upgrade for unlimited access.' 
                    : 'Only 1 evaluation left today!'}
                </p>
              )}
              {!usage.isPremium && (
                <button className="upgrade-btn" onClick={() => navigate('/upgrade')}>
                  ⭐ Upgrade to Premium
                </button>
              )}
              {usage.isPremium && (
                <span className="premium-badge">⭐ Premium Member</span>
              )}
            </div>
          </section>
        )}

        <section className="total-section">
          <div className="total-card">
            <div className="total-info">
              <span className="total-number">{totalPractice}</span>
              <span className="total-label">Total Practice Sessions</span>
            </div>
          </div>
        </section>

        <section className="action-section">
          <button className="start-practice-btn" onClick={() => navigate('/modules')}>
            🚀 Start Practicing
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;