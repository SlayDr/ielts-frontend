import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadingHistory.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ReadingHistory = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBandColor = (band) => {
    if (band >= 7) return 'band-high';
    if (band >= 5.5) return 'band-medium';
    return 'band-low';
  };

  const getScorePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  const calculateStats = () => {
    if (sessions.length === 0) return { total: 0, average: 0, highest: 0 };
    const scores = sessions.filter(s => s.bandScore).map(s => s.bandScore);
    return {
      total: sessions.length,
      average: scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
      highest: scores.length > 0 ? Math.max(...scores) : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="reading-history">
      <header className="history-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>📖 Reading History</h1>
          <p className="subtitle">Review your past reading sessions</p>
        </div>
      </header>

      <main className="history-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading history...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>⚠️ {error}</p>
            <button onClick={fetchHistory}>Try Again</button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📖</span>
            <h2>No Reading Sessions Yet</h2>
            <p>Complete a reading practice to see your history here.</p>
            <button onClick={() => navigate('/reading')}>Start Reading Practice</button>
          </div>
        ) : (
          <>
            <section className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total Sessions</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.average}</span>
                  <span className="stat-label">Average Band</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.highest}</span>
                  <span className="stat-label">Highest Score</span>
                </div>
              </div>
            </section>

            <div className="sessions-list">
              {sessions.map((session, index) => (
                <div key={session._id || index} className="session-card">
                  <div className="session-header">
                    <h3 className="passage-title">{session.passageTitle}</h3>
                    <span className={`band-badge ${getBandColor(session.bandScore)}`}>
                      Band {session.bandScore}
                    </span>
                  </div>
                  <div className="session-stats">
                    <div className="stat-item">
                      <span className="stat-value">{session.score}/{session.totalQuestions}</span>
                      <span className="stat-label">Correct</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{getScorePercentage(session.score, session.totalQuestions)}%</span>
                      <span className="stat-label">Score</span>
                    </div>
                    {session.timeSpent && (
                      <div className="stat-item">
                        <span className="stat-value">{Math.floor(session.timeSpent / 60)}:{(session.timeSpent % 60).toString().padStart(2, '0')}</span>
                        <span className="stat-label">Time</span>
                      </div>
                    )}
                  </div>
                  <div className="session-meta">
                    <span className="date">{formatDate(session.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReadingHistory;