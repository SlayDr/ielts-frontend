import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadingPractice.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ReadingPractice = () => {
  const navigate = useNavigate();
  const [passages, setPassages] = useState([]);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // select, reading, results
  const [timer, setTimer] = useState(60 * 60); // 60 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    fetchPassages();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            // Auto-submit when time runs out
            if (selectedPassage) {
              submitAnswers();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);
  const fetchPassages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading/passages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch passages');
      
      const data = await response.json();
      setPassages(data.passages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectPassage = async (passageId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/reading/passages/${passageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch passage');
      
      const data = await response.json();
      setSelectedPassage(data.passage);
      setAnswers({});
      setResults(null);
      setTimer(60 * 60);
      setIsTimerRunning(true);
      setStep('reading');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitAnswers = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsTimerRunning(false);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passageId: selectedPassage.id,
          answers,
          timeSpent: timer
        })
      });

      if (!response.ok) throw new Error('Failed to submit answers');
      
      const data = await response.json();
      setResults(data);
      setStep('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPractice = () => {
    setSelectedPassage(null);
    setAnswers({});
    setResults(null);
   setTimer(60 * 60); // Reset to 60 minutes
    setIsTimerRunning(false);
    setStep('select');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return '';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return 'score-high';
    if (percentage >= 50) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="reading-practice">
      <header className="reading-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>📖 Reading Practice</h1>
          <p className="subtitle">Practice IELTS Academic Reading</p>
        </div>
      </header>

      <main className="reading-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Passage Selection */}
        {step === 'select' && (
          <section className="passage-selection">
            <h2>Choose a Reading Passage</h2>
            <p className="selection-subtitle">Select a passage to practice your reading skills</p>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading passages...</p>
              </div>
            ) : (
              <div className="passages-grid">
                {passages.map(passage => (
                  <div
                    key={passage.id}
                    className="passage-card"
                    onClick={() => selectPassage(passage.id)}
                  >
                    <div className="passage-header">
                      <span className={`difficulty-badge ${getDifficultyColor(passage.difficulty)}`}>
                        {passage.difficulty}
                      </span>
                      <span className="question-count">{passage.questionCount} questions</span>
                    </div>
                    <h3>{passage.title}</h3>
                    <p className="passage-topic">{passage.topic}</p>
                    <button className="start-btn">Start Practice →</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Reading Section */}
        {step === 'reading' && selectedPassage && (
          <section className="reading-section">
            <div className="reading-toolbar">
              <div className="passage-info">
                <h2>{selectedPassage.title}</h2>
                <span className={`difficulty-badge ${getDifficultyColor(selectedPassage.difficulty)}`}>
                  {selectedPassage.difficulty}
                </span>
              </div>
              <div className={`timer-display ${timer < 300 ? 'timer-warning' : ''}`}>
                  <span className="timer-icon">⏱</span>
                  <span className="timer-value">{formatTime(timer)}</span>
                   {timer < 300 && <span className="timer-alert">⚠️ Less than 5 min!</span>}
              </div>
            </div>

            <div className="reading-content">
              <div className="passage-container">
                <h3>Reading Passage</h3>
                <div className="passage-text">
                  {selectedPassage.passage.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="questions-container">
                <h3>Questions</h3>
                <div className="questions-list">
                  {selectedPassage.questions.map((q, idx) => (
                    <div key={q.id} className="question-item">
                      <div className="question-number">Question {idx + 1}</div>
                      <p className="question-text">{q.question}</p>
                      
                      {q.type === 'multiple-choice' && (
                        <div className="options-list">
                          {q.options.map((option, optIdx) => (
                            <label key={optIdx} className="option-label">
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={optIdx}
                                checked={answers[q.id] === optIdx.toString()}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              />
                              <span className="option-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'true-false-notgiven' && (
                        <div className="tfng-options">
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map(option => (
                            <label key={option} className="tfng-label">
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={option}
                                checked={answers[q.id] === option}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              />
                              <span className="tfng-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'fill-blank' && (
                        <input
                          type="text"
                          className="fill-blank-input"
                          placeholder="Type your answer..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="submit-section">
                  <p className="answered-count">
                    Answered: {Object.keys(answers).length} / {selectedPassage.questions.length}
                  </p>
                  <button 
                    className="btn-submit"
                    onClick={submitAnswers}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Answers'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {step === 'results' && results && (
          <section className="results-section">
            <h2>Your Results</h2>
            
            <div className="score-overview">
              <div className={`score-circle ${getScoreColor(results.percentage)}`}>
                <span className="score-number">{results.score}/{results.totalQuestions}</span>
                <span className="score-percentage">{results.percentage}%</span>
              </div>
              <div className="score-details">
                <div className="band-score">
                  <span className="band-label">Band Score</span>
                  <span className="band-value">{results.bandScore}</span>
                </div>
                <div className="time-taken">
                  <span className="time-label">Time Taken</span>
                  <span className="time-value">{formatTime(timer)}</span>
                </div>
              </div>
            </div>

            <div className="results-breakdown">
              <h3>Answer Review</h3>
              {results.results.map((result, idx) => (
                <div key={idx} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className="result-number">Q{idx + 1}</span>
                    <span className={`result-badge ${result.isCorrect ? 'badge-correct' : 'badge-incorrect'}`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="result-question">{result.question}</p>
                  <div className="result-answers">
                    <p><strong>Your answer:</strong> {result.userAnswer || 'Not answered'}</p>
                    {!result.isCorrect && (
                      <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
                    )}
                  </div>
                  <div className="result-explanation">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="btn-secondary" onClick={resetPractice}>
                📚 Try Another Passage
              </button>
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                🏠 Back to Dashboard
              </button>
            </div>
          </section>
        )}

        {loading && step === 'select' && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadingPractice;