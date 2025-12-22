import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadingPractice.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ReadingPractice = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null, 'practice', 'fulltest'
  const [passages, setPassages] = useState([]);
  const [fullTests, setFullTests] = useState([]);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // select, reading, results
  const [timer, setTimer] = useState(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === 'practice') {
      fetchPassages();
    } else if (mode === 'fulltest') {
      fetchFullTests();
    }
  }, [mode]);

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleSubmit();
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

  const fetchFullTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading/full-tests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch full tests');
      const data = await response.json();
      setFullTests(data.tests);
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
      setTimer(20 * 60); // 20 minutes for single passage
      setIsTimerRunning(true);
      setStep('reading');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectFullTest = async (testId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading/full-tests/${testId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch test');
      const data = await response.json();
      setSelectedTest(data.test);
      setCurrentPassageIndex(0);
      setAnswers({});
      setResults(null);
      setTimer(60 * 60); // 60 minutes for full test
      setIsTimerRunning(true);
      setStep('reading');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (passageId, questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${passageId}-${questionId}`]: answer
    }));
  };

  const handleSubmit = async () => {
    setIsTimerRunning(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (mode === 'fulltest' && selectedTest) {
        const response = await fetch(`${API_URL}/api/reading/full-tests/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            testId: selectedTest.id,
            answers,
            timeSpent: 3600 - timer
          })
        });
        if (!response.ok) throw new Error('Failed to submit test');
        const data = await response.json();
        setResults(data.results);
      } else if (selectedPassage) {
        const response = await fetch(`${API_URL}/api/reading/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passageId: selectedPassage.id,
            answers,
            timeSpent: 1200 - timer
          })
        });
        if (!response.ok) throw new Error('Failed to submit answers');
        const data = await response.json();
        setResults(data);
      }
      setStep('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPractice = () => {
    setMode(null);
    setSelectedPassage(null);
    setSelectedTest(null);
    setCurrentPassageIndex(0);
    setAnswers({});
    setResults(null);
    setTimer(60 * 60);
    setIsTimerRunning(false);
    setStep('select');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return 'difficulty-medium';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return 'score-high';
    if (percentage >= 50) return 'score-medium';
    return 'score-low';
  };

  const getCurrentPassage = () => {
    if (mode === 'fulltest' && selectedTest) {
      return selectedTest.passages[currentPassageIndex];
    }
    return selectedPassage;
  };

  const getTotalQuestions = () => {
    if (mode === 'fulltest' && selectedTest) {
      return selectedTest.totalQuestions;
    }
    return selectedPassage?.questions?.length || 0;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  // Mode Selection Screen
  if (!mode) {
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
          <section className="mode-selection">
            <h2>Choose Your Practice Mode</h2>
            <p className="selection-subtitle">Select how you want to practice today</p>

            <div className="mode-options">
              <div className="mode-card" onClick={() => setMode('practice')}>
                <div className="mode-icon">📄</div>
                <h3>Practice Mode</h3>
                <p className="mode-time">⏱️ 20 minutes per passage</p>
                <p className="mode-description">
                  Practice with individual passages. Great for focused practice on specific topics.
                </p>
                <ul className="mode-features">
                  <li>Single passage</li>
                 {/* <li>10-13 questions</li> */}
                  <li>Immediate feedback</li>
                  <li>Choose your topic</li>
                </ul>
                <button className="mode-btn">Start Practice</button>
              </div>

              <div className="mode-card featured" onClick={() => setMode('fulltest')}>
                <div className="mode-badge">IELTS Format</div>
                <div className="mode-icon">📚</div>
                <h3>Full Test Mode</h3>
                <p className="mode-time">⏱️ 60 minutes</p>
                <p className="mode-description">
                 Complete IELTS Reading test in real exam conditions.
                </p>
                <ul className="mode-features">
                 {/* <li>3 passages</li> */}
                 {/* <li>42 questions total</li> */}
                  <li>Real exam timing</li>
                  <li>Band score calculation</li>
                </ul>
                <button className="mode-btn primary">Start Full Test</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Passage/Test Selection Screen
  if (step === 'select') {
    return (
      <div className="reading-practice">
        <header className="reading-header">
          <div className="header-content">
            <button className="back-btn" onClick={resetPractice}>
              ← Back
            </button>
            <h1>📖 {mode === 'fulltest' ? 'Full Reading Tests' : 'Reading Passages'}</h1>
            <p className="subtitle">
              {mode === 'fulltest' 
                ? 'Choose a complete IELTS Reading test' 
                : 'Select a passage to practice'}
            </p>
          </div>
        </header>

        <main className="reading-main">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : mode === 'fulltest' ? (
            <section className="passage-selection">
              <div className="passages-grid">
              {fullTests.slice(0, 4).map(test => (
                  <div
                    key={test.id}
                    className="passage-card fulltest-card"
                    onClick={() => selectFullTest(test.id)}
                  >
                    <div className="passage-header">
                      {/* <span className="question-count">{test.totalQuestions} questions</span> */}
                    </div>
                    <h3>{test.title}</h3>
                    <div className="test-passages">
                      {test.passages.map((p, idx) => (
                        <div key={p.id} className="test-passage-item">
                          <span className="passage-number">Passage {idx + 1}:</span>
                          <span className="passage-title">{p.title}</span>
                        </div>
                      ))}
                    </div>
                    <button className="start-btn">Start Test →</button>
                  </div>
                ))}
                {fullTests.length > 4 && (
                  <div className="passage-card fulltest-card more-tests-card">
                    <div className="passage-header">
                      <span className="more-badge">✨ More Content</span>
                    </div>
                    <h3>More Tests Available</h3>
                    <div className="more-tests-content">
                      <p>Continue practicing to discover more full-length IELTS Reading tests!</p>
                    </div>
                    <button className="start-btn" onClick={() => selectFullTest(fullTests[4].id)}>
                      Try Next Test →
                    </button>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="passage-selection">
              <div className="passages-grid">
        {passages.slice(0, 6).map(passage => (
                  <div
                    key={passage.id}
                    className="passage-card"
                    onClick={() => selectPassage(passage.id)}
                  >
                    <div className="passage-header">
                      {/* <span className="question-count">{passage.questionCount} questions</span> */}
                    </div>
                    <h3>{passage.title}</h3>
                    <p className="passage-topic">{passage.topic}</p>
                    <button className="start-btn">Start Practice →</button>
                  </div>
                ))}
                {passages.length > 6 && (
                  <div className="passage-card more-passages-card">
                    <div className="passage-header">
                      <span className="more-badge">✨ More Content</span>
                    </div>
                    <h3>More Passages Available</h3>
                    <div className="more-tests-content">
                      <p>Keep practicing to unlock more reading passages on various topics!</p>
                    </div>
                    <button className="start-btn" onClick={() => selectPassage(passages[6].id)}>
                      Try Next Passage →
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  // Reading/Questions Screen
  if (step === 'reading') {
    const currentPassage = getCurrentPassage();
    
    return (
      <div className="reading-practice">
        <header className="reading-header">
          <div className="header-content">
            <button className="back-btn" onClick={resetPractice}>
              ← Exit
            </button>
            <h1>📖 Reading Practice</h1>
            <div className={`timer-display ${timer < 300 ? 'timer-warning' : ''}`}>
              <span className="timer-icon">⏱</span>
              <span className="timer-value">{formatTime(timer)}</span>
              {timer < 300 && <span className="timer-alert">⚠️ Less than 5 min!</span>}
            </div>
          </div>
        </header>

        <main className="reading-main">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {mode === 'fulltest' && selectedTest && (
            <div className="passage-tabs">
              {selectedTest.passages.map((p, idx) => (
                <button
                  key={p.id}
                  className={`passage-tab ${currentPassageIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentPassageIndex(idx)}
                >
                  Passage {idx + 1}
                </button>
              ))}
            </div>
          )}

          <section className="reading-section">
            <div className="reading-toolbar">
              <div className="passage-info">
                <h2>{currentPassage?.title}</h2>
              </div>
            </div>

            <div className="reading-content">
              <div className="passage-container">
                <h3>Reading Passage</h3>
                <div className="passage-text">
                  {currentPassage?.passage?.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="questions-container">
                <h3>Questions</h3>
                <div className="questions-list">
                  {currentPassage?.questions?.map((q, idx) => (
                    <div key={q.id} className="question-item">
                      <div className="question-number">Question {idx + 1}</div>
                      <p className="question-text">{q.question}</p>

                      {q.type === 'multiple-choice' && (
                        <div className="options-list">
                          {q.options?.map((option, optIdx) => (
                            <label key={optIdx} className="option-label">
                              <input
                                type="radio"
                                name={`${currentPassage.id}-${q.id}`}
                                value={optIdx}
                                checked={answers[`${currentPassage.id}-${q.id}`] === optIdx}
                                onChange={() => handleAnswerChange(currentPassage.id, q.id, optIdx)}
                              />
                              <span className="option-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'true-false-notgiven' && (
                        <div className="options-list tfng">
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map((option, optIdx) => (
                            <label key={optIdx} className="option-label">
                              <input
                                type="radio"
                                name={`${currentPassage.id}-${q.id}`}
                                value={optIdx}
                                checked={answers[`${currentPassage.id}-${q.id}`] === optIdx}
                                onChange={() => handleAnswerChange(currentPassage.id, q.id, optIdx)}
                              />
                              <span className="option-text">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'fill-blank' && (
                        <input
                          type="text"
                          className="fill-blank-input"
                          placeholder="Type your answer..."
                          value={answers[`${currentPassage.id}-${q.id}`] || ''}
                          onChange={(e) => handleAnswerChange(currentPassage.id, q.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="submit-section">
                  <p className="answered-count">
                    Answered: {getAnsweredCount()} / {getTotalQuestions()}
                  </p>
                  <button 
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Answers'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Results Screen
  if (step === 'results') {
    const percentage = results?.percentage || Math.round((results?.score / results?.totalQuestions) * 100) || 0;
    
    return (
      <div className="reading-practice">
        <header className="reading-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </button>
            <h1>📖 Reading Results</h1>
          </div>
        </header>

        <main className="reading-main">
          <section className="results-section">
            <div className="results-card">
              <h2>Your Results</h2>
              
              <div className="score-display">
                <div className={`score-circle ${getScoreColor(percentage)}`}>
                  <span className="score-value">{results?.bandScore || results?.band || '-'}</span>
                  <span className="score-label">Band</span>
                </div>
              </div>

              <div className="score-details">
                <div className="detail-item">
                  <span className="detail-label">Correct Answers</span>
                  <span className="detail-value">
                    {results?.totalCorrect || results?.score} / {results?.totalQuestions}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Percentage</span>
                  <span className="detail-value">{percentage}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time Spent</span>
                  <span className="detail-value">
                    {formatTime(results?.timeSpent || 0)}
                  </span>
                </div>
              </div>

              {results?.passageResults && (
                <div className="passage-results">
                  <h3>Results by Passage</h3>
                  {results.passageResults.map((pr, idx) => (
                    <div key={pr.passageId} className="passage-result-item">
                      <span className="pr-title">Passage {idx + 1}: {pr.title}</span>
                      <span className="pr-score">{pr.correct} / {pr.total}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="results-actions">
                <button className="action-btn" onClick={resetPractice}>
                  Practice Again
                </button>
                <button className="action-btn secondary" onClick={() => navigate('/reading-history')}>
                  View History
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return null;
};

export default ReadingPractice;