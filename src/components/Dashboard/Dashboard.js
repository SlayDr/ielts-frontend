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

  useEffect(() => {
    fetchStats();
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
          <h1>IELTS Master</h1>
          <div className="user-section">
            <span className="user-name">{user?.name || 'Student'}</span>
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
              <span className="stat-label">Essays</span>
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