import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpeakingHistory.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const SpeakingHistory = () => {
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
      const response = await fetch(`${API_URL}/api/speaking/history`, {
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

  return (
    <div className="speaking-history">
      <header className="history-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>🎤 Speaking History</h1>
          <p className="subtitle">Review your past speaking sessions</p>
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
            <span className="empty-icon">🎤</span>
            <h2>No Speaking Sessions Yet</h2>
            <p>Complete a speaking practice to see your history here.</p>
            <button onClick={() => navigate('/speaking')}>Start Speaking Practice</button>
          </div>
        ) : (
          <div className="sessions-list">
            <div className="list-header">
              <span className="total-count">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
            </div>
            {sessions.map((session, index) => (
              <div key={session._id || index} className="session-card">
                <div className="session-header">
                  <span className="part-badge">Part {session.part}</span>
                  <span className={`band-badge ${getBandColor(session.bandScore)}`}>
                    Band {session.bandScore}
                  </span>
                </div>
                <div className="session-question">
                  <strong>Question:</strong> {session.question}
                </div>
                <div className="session-meta">
                  <span className="date">{formatDate(session.createdAt)}</span>
                </div>
                {session.feedback && (
                  <div className="session-feedback">
                    <div className="feedback-scores">
                      <span>Fluency: {session.feedback.fluency}</span>
                      <span>Vocabulary: {session.feedback.vocabulary}</span>
                      <span>Grammar: {session.feedback.grammar}</span>
                      <span>Pronunciation: {session.feedback.pronunciation}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SpeakingHistory;