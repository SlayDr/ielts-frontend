import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EssayHistory.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const EssayHistory = () => {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEssay, setExpandedEssay] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEssays();
  }, []);

  const fetchEssays = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/essays`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch essays');
      }

      const data = await response.json();
      setEssays(data.essays || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'score-high';
    if (score >= 5.5) return 'score-medium';
    return 'score-low';
  };

  const getTaskTypeLabel = (type) => {
    const types = {
      task1: 'Task 1 - Academic',
      task1_general: 'Task 1 - General',
      task2: 'Task 2 - Essay'
    };
    return types[type] || type || 'Essay';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredAndSortedEssays = () => {
    let result = [...essays];

    if (filter !== 'all') {
      result = result.filter(essay => essay.taskType === filter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return (b.score || 0) - (a.score || 0);
        case 'lowest':
          return (a.score || 0) - (b.score || 0);
        default:
          return 0;
      }
    });

    return result;
  };

  const calculateStats = () => {
    if (essays.length === 0) return { total: 0, average: 0, highest: 0 };
    
    const scores = essays.filter(e => e.score).map(e => e.score);
    return {
      total: essays.length,
      average: scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
      highest: scores.length > 0 ? Math.max(...scores) : 0
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="essay-history">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your essays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="essay-history">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to load essays</h2>
          <p>{error}</p>
          <button onClick={fetchEssays} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="essay-history">
      <header className="history-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>Essay History</h1>
          <p className="subtitle">Track your IELTS writing progress</p>
        </div>
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Essays</span>
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

      <section className="filters-section">
        <div className="filter-group">
          <label>Task Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="task1">Task 1 - Academic</option>
            <option value="task1_general">Task 1 - General</option>
            <option value="task2">Task 2 - Essay</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </section>

      <section className="essays-section">
        {filteredAndSortedEssays().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>No essays yet</h2>
            <p>Start practicing to see your essay history here!</p>
            <button onClick={() => navigate('/practice')} className="start-btn">
              Start Writing Practice
            </button>
          </div>
        ) : (
          <div className="essays-list">
            {filteredAndSortedEssays().map((essay) => (
              <div 
                key={essay._id || essay.id} 
                className={`essay-card ${expandedEssay === (essay._id || essay.id) ? 'expanded' : ''}`}
              >
                <div 
                  className="essay-card-header"
                  onClick={() => setExpandedEssay(
                    expandedEssay === (essay._id || essay.id) ? null : (essay._id || essay.id)
                  )}
                >
                  <div className="essay-main-info">
                    <span className="task-type-badge">
                      {getTaskTypeLabel(essay.taskType)}
                    </span>
                    <h3 className="essay-topic">
                      {truncateText(essay.topic || essay.prompt || 'Untitled Essay', 80)}
                    </h3>
                    <span className="essay-date">{formatDate(essay.createdAt)}</span>
                  </div>
                  <div className="essay-score-section">
                    {essay.score ? (
                      <div className={`score-badge ${getScoreColor(essay.score)}`}>
                        <span className="score-label">Band</span>
                        <span className="score-value">{essay.score}</span>
                      </div>
                    ) : (
                      <div className="score-badge score-pending">
                        <span className="score-label">Pending</span>
                      </div>
                    )}
                    <span className="expand-icon">
                      {expandedEssay === (essay._id || essay.id) ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {expandedEssay === (essay._id || essay.id) && (
                  <div className="essay-card-body">
                    <div className="essay-content-section">
                      <h4>Your Essay</h4>
                      <p className="essay-text">{essay.content || essay.essay}</p>
                      <div className="word-count">
                        Word count: {(essay.content || essay.essay || '').split(/\s+/).filter(w => w).length}
                      </div>
                    </div>

                    {essay.feedback && (
                      <div className="feedback-section">
                        <h4>AI Feedback</h4>
                        <div className="feedback-content">
                          {typeof essay.feedback === 'string' ? (
                            <p>{essay.feedback}</p>
                          ) : (
                            <>
                              {essay.feedback.taskAchievement && (
                                <div className="feedback-category">
                                  <span className="category-label">Task Achievement:</span>
                                  <span className="category-score">{essay.feedback.taskAchievement}</span>
                                </div>
                              )}
                              {essay.feedback.coherence && (
                                <div className="feedback-category">
                                  <span className="category-label">Coherence & Cohesion:</span>
                                  <span className="category-score">{essay.feedback.coherence}</span>
                                </div>
                              )}
                              {essay.feedback.vocabulary && (
                                <div className="feedback-category">
                                  <span className="category-label">Lexical Resource:</span>
                                  <span className="category-score">{essay.feedback.vocabulary}</span>
                                </div>
                              )}
                              {essay.feedback.grammar && (
                                <div className="feedback-category">
                                  <span className="category-label">Grammar & Accuracy:</span>
                                  <span className="category-score">{essay.feedback.grammar}</span>
                                </div>
                              )}
                              {essay.feedback.comments && (
                                <div className="feedback-comments">
                                  <h5>Comments</h5>
                                  <p>{essay.feedback.comments}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {essay.rewrite && (
                      <div className="rewrite-section">
                        <h4>AI Improved Version</h4>
                        <p className="rewrite-text">{essay.rewrite}</p>
                      </div>
                    )}

                    <div className="essay-actions">
                      <button 
                        className="action-btn practice-again"
                        onClick={() => navigate('/practice', { 
                          state: { topic: essay.topic || essay.prompt, taskType: essay.taskType }
                        })}
                      >
                        Practice Similar Topic
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EssayHistory;