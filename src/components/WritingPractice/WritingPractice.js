import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { essayAPI } from '../../services/api';

const questions = [
  "Some people think that governments should invest more in public services instead of wasting money on arts such as music and painting. To what extent do you agree or disagree?",
  "These days more fathers stay at home and take care of their children while mothers go out to work. What could be the reasons for this? Is it a positive or negative development?",
  "In many countries, the amount of crime is increasing. What do you think are the main causes of crime? How can we deal with those causes?",
  "Some people believe that technology has made our lives too complex, and the solution is to lead a simpler life without technology. To what extent do you agree or disagree?",
  "Many people today prefer to read news online rather than in newspapers. What are the advantages and disadvantages of reading news online?"
];

function WritingPractice() {
  const navigate = useNavigate();
  const [essay, setEssay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [rewrittenEssay, setRewrittenEssay] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);
  
  // Random question
  const [question] = useState(() => 
    questions[Math.floor(Math.random() * questions.length)]
  );

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (wordCount < 50) {
      setError('Please write at least 50 words.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await essayAPI.evaluate(essay);
      setFeedback(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to evaluate essay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    setRewriteLoading(true);
    try {
      const response = await essayAPI.rewrite(essay, question, feedback);
      setRewrittenEssay(response.data.rewrittenEssay);
    } catch (err) {
      setError('Failed to rewrite essay. Please try again.');
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleNewEssay = () => {
    setEssay('');
    setFeedback(null);
    setRewrittenEssay('');
    setError('');
    window.location.reload();
  };

  // Show feedback view
  if (feedback) {
    return (
      <div className="feedback-container">
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>

        <div className="header">
          <h1>Your Results</h1>
          <p>AI-powered feedback on your essay</p>
        </div>

        <div className="band-score">
          <div className="score">{feedback.overallBand}</div>
          <div className="label">Overall Band Score</div>
        </div>

        <div className="scores-grid">
          <div className="score-item">
            <div className="value">{feedback.taskAchievement}</div>
            <div className="name">Task Achievement</div>
          </div>
          <div className="score-item">
            <div className="value">{feedback.coherenceCohesion}</div>
            <div className="name">Coherence</div>
          </div>
          <div className="score-item">
            <div className="value">{feedback.lexicalResource}</div>
            <div className="name">Vocabulary</div>
          </div>
          <div className="score-item">
            <div className="value">{feedback.grammaticalRange}</div>
            <div className="name">Grammar</div>
          </div>
        </div>

        <div className="feedback-section">
          <h3>✅ Strengths</h3>
          <ul>
            {feedback.strengths?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="feedback-section">
          <h3>📈 Areas for Improvement</h3>
          <ul>
            {feedback.improvements?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {!rewrittenEssay ? (
          <button 
            className="btn btn-primary" 
            onClick={handleRewrite}
            disabled={rewriteLoading}
            style={{ marginTop: '20px' }}
          >
            {rewriteLoading ? 'Rewriting with AI...' : '✨ AI Rewrite to Band 8+'}
          </button>
        ) : (
          <div className="rewrite-section">
            <h3>✨ AI Rewritten Essay (Band 8+)</h3>
            <div className="rewritten-essay">{rewrittenEssay}</div>
          </div>
        )}

        <button 
          className="btn btn-secondary" 
          onClick={handleNewEssay}
          style={{ marginTop: '15px' }}
        >
          Write Another Essay
        </button>
      </div>
    );
  }

  // Show writing view
  return (
    <div className="writing-container">
      <Link to="/dashboard" className="back-btn">← Dashboard</Link>

      <div className="header">
        <h1>Writing Practice</h1>
        <p>IELTS Task 2 Essay</p>
      </div>

      <div className="question-card">
        <div className="question-label">QUESTION:</div>
        <p className="question-text">{question}</p>
      </div>

      <div className="essay-card">
        <div className="form-group">
          <label>Write your essay (minimum 250 words):</label>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Start writing your essay here..."
          />
        </div>
        <div className="word-count">{wordCount} words</div>

        {error && <div className="error-message">{error}</div>}

        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={loading || wordCount < 50}
        >
          {loading ? 'Analyzing...' : 'Get AI Feedback 🤖'}
        </button>
      </div>
    </div>
  );
}

export default WritingPractice;