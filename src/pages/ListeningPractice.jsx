import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListeningProgress } from '../hooks/useProgress';
import './ListeningPractice.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ListeningPractice = () => {
  const navigate = useNavigate();
  const { isSectionCompleted, isTestCompleted, markSectionComplete, markTestComplete } = useListeningProgress();
  const [mode, setMode] = useState(null); // null, 'practice', 'fulltest'
  const [sections, setSections] = useState([]);
  const [fullTests, setFullTests] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // select, listening, results
  const [timer, setTimer] = useState(30 * 60); // 30 minutes for full test
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === 'practice') {
      fetchSections();
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

  const fetchSections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listening/sections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch sections');
      const data = await response.json();
      setSections(data.sections);
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
      const response = await fetch(`${API_URL}/api/listening/full-tests`, {
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

  const selectSection = async (sectionId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listening/sections/${sectionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch section');
      const data = await response.json();
      setSelectedSection(data.section);
      setAnswers({});
      setResults(null);
      setHasPlayed(false);
      setTimer(10 * 60); // 10 minutes for single section
      setIsTimerRunning(true);
      setStep('listening');
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
      const response = await fetch(`${API_URL}/api/listening/full-tests/${testId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch test');
      const data = await response.json();
      setSelectedTest(data.test);
      setCurrentSectionIndex(0);
      setAnswers({});
      setResults(null);
      setHasPlayed(false);
      setTimer(30 * 60); // 30 minutes for full test
      setIsTimerRunning(true);
      setStep('listening');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const currentSection = getCurrentSection();
    if (!currentSection || isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentSection.transcript);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
      setHasPlayed(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleAnswerChange = (sectionId, questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${sectionId}-${questionId}`]: answer
    }));
  };

  const handleSubmit = async () => {
    setIsTimerRunning(false);
    stopAudio();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (mode === 'fulltest' && selectedTest) {
        const response = await fetch(`${API_URL}/api/listening/full-tests/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            testId: selectedTest.id,
            answers,
            timeSpent: 1800 - timer
          })
        });
        if (!response.ok) throw new Error('Failed to submit test');
        const data = await response.json();
        setResults(data.results);
        // Mark test as complete
        markTestComplete(selectedTest.id);
      } else if (selectedSection) {
        const response = await fetch(`${API_URL}/api/listening/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sectionId: selectedSection.id,
            answers,
            timeSpent: 600 - timer
          })
        });
        if (!response.ok) throw new Error('Failed to submit answers');
        const data = await response.json();
        setResults(data);
        // Mark section as complete
        markSectionComplete(selectedSection.id);
      }
      setStep('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPractice = () => {
    stopAudio();
    setMode(null);
    setSelectedSection(null);
    setSelectedTest(null);
    setCurrentSectionIndex(0);
    setAnswers({});
    setResults(null);
    setTimer(30 * 60);
    setIsTimerRunning(false);
    setHasPlayed(false);
    setStep('select');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSection = () => {
    if (mode === 'fulltest' && selectedTest) {
      return selectedTest.sections[currentSectionIndex];
    }
    return selectedSection;
  };

  const getTotalQuestions = () => {
    if (mode === 'fulltest' && selectedTest) {
      return selectedTest.totalQuestions;
    }
    return selectedSection?.questions?.length || 0;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return 'score-high';
    if (percentage >= 50) return 'score-medium';
    return 'score-low';
  };

  // Mode Selection Screen
  if (!mode) {
    return (
      <div className="listening-practice">
        <header className="listening-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </button>
            <h1>🎧 Listening Practice</h1>
            <p className="subtitle">Practice IELTS Academic Listening</p>
          </div>
        </header>

        <main className="listening-main">
          <section className="mode-selection">
            <h2>Choose Your Practice Mode</h2>
            <p className="selection-subtitle">Select how you want to practice today</p>

            <div className="mode-options">
              <div className="mode-card" onClick={() => setMode('practice')}>
                <div className="mode-icon">🎵</div>
                <h3>Practice Mode</h3>
                <p className="mode-time">⏱️ 10 minutes per section</p>
                <p className="mode-description">
                  Practice with individual sections. Great for focused practice on specific question types.
                </p>
                <ul className="mode-features">
                  <li>Single section</li>
                 {/* <li>10 questions</li> */}
                  <li>Immediate feedback</li>
                  <li>Choose your topic</li>
                </ul>
                <button className="mode-btn">Start Practice</button>
              </div>

              <div className="mode-card featured" onClick={() => setMode('fulltest')}>
                <div className="mode-badge">IELTS Format</div>
                <div className="mode-icon">📻</div>
                <h3>Full Test Mode</h3>
                <p className="mode-time">⏱️ 30 minutes</p>
                <p className="mode-description">
                 Complete IELTS Listening test in real exam conditions.
                </p>
                <ul className="mode-features">
                 {/* <li>4 sections</li> */}
                 {/* <li>40 questions total</li> */}
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

  // Section/Test Selection Screen
  if (step === 'select') {
    return (
      <div className="listening-practice">
        <header className="listening-header">
          <div className="header-content">
            <button className="back-btn" onClick={resetPractice}>
              ← Back
            </button>
            <h1>🎧 {mode === 'fulltest' ? 'Full Listening Tests' : 'Listening Sections'}</h1>
            <p className="subtitle">
              {mode === 'fulltest'
                ? 'Choose a complete IELTS Listening test'
                : 'Select a section to practice'}
            </p>
          </div>
        </header>

        <main className="listening-main">
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
            <section className="section-selection">
              <div className="sections-grid">
               {fullTests.slice(0, 4).map(test => (
                  <div
                    key={test.id}
                    className={`section-card fulltest-card ${isTestCompleted(test.id) ? 'completed' : ''}`}
                    onClick={() => selectFullTest(test.id)}
                  >
                    <div className="section-header">
                      {isTestCompleted(test.id) && <span className="completed-badge">✓ Completed</span>}
                    {/* <span className="question-count">{test.totalQuestions} questions</span> */}
                    </div>
                    <h3>{test.title}</h3>
                    <div className="test-sections">
                      {test.sections.map((s, idx) => (
                        <div key={s.id} className="test-section-item">
                          <span className="section-number">Part {idx + 1}:</span>
                          <span className="section-title">{s.title}</span>
                         {/* <span className="section-questions">({s.questionCount} Q)</span> */}
                        </div>
                      ))}
                    </div>
                    <button className="start-btn">Start Test →</button>
                  </div>
                ))}
                {fullTests.length > 4 && (
                  <div className="section-card fulltest-card more-tests-card">
                    <div className="section-header">
                      <span className="more-badge">✨ More Content</span>
                    </div>
                    <h3>More Tests Available</h3>
                    <div className="more-tests-content">
                      <p>Continue practicing to discover more full-length IELTS Listening tests!</p>
                    </div>
                    <button className="start-btn" onClick={() => selectFullTest(fullTests[4].id)}>
                      Try Next Test →
                    </button>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="section-selection">
              <div className="sections-grid">
              {sections.slice(0, 6).map(section => (
                <div
                  key={section.id}
                  className={`section-card ${isSectionCompleted(section.id) ? 'completed' : ''}`}
                  onClick={() => selectSection(section.id)}
                >
                    <div className="section-header">
                      {isSectionCompleted(section.id) && <span className="completed-badge">✓ Completed</span>}
                      {/* <span className="part-badge">Part {section.part}</span> */}
                      {/* <span className="question-count">{section.questionCount} questions</span> */}
                    </div>
                    <h3>{section.title}</h3>
                    <p className="section-description">{section.description}</p>
                    <button className="start-btn">Start Practice →</button>
                  </div>
                ))}
                {sections.length > 6 && (
                <div className="section-card more-sections-card">
                  <div className="section-header">
                    <span className="more-badge">✨ More Content</span>
                  </div>
                  <h3>More Sections Available</h3>
                  <div className="more-tests-content">
                    <p>Keep practicing to unlock more listening sections!</p>
                  </div>
                  <button className="start-btn" onClick={() => selectSection(sections[6].id)}>
                    Try Next Section →
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

  // Listening/Questions Screen
  if (step === 'listening') {
    const currentSection = getCurrentSection();

    return (
      <div className="listening-practice">
        <header className="listening-header">
          <div className="header-content">
            <button className="back-btn" onClick={resetPractice}>
              ← Exit
            </button>
            <h1>🎧 Listening Practice</h1>
            <div className={`timer-display ${timer < 300 ? 'timer-warning' : ''}`}>
              <span className="timer-icon">⏱</span>
              <span className="timer-value">{formatTime(timer)}</span>
              {timer < 300 && <span className="timer-alert">⚠️ Less than 5 min!</span>}
            </div>
          </div>
        </header>

        <main className="listening-main">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {mode === 'fulltest' && selectedTest && (
            <div className="section-tabs">
              {selectedTest.sections.map((s, idx) => (
                <button
                  key={s.id}
                  className={`section-tab ${currentSectionIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    stopAudio();
                    setCurrentSectionIndex(idx);
                    setHasPlayed(false);
                  }}
                >
                  Part {idx + 1}
                </button>
              ))}
            </div>
          )}

          <section className="listening-section">
            <div className="listening-toolbar">
              <div className="section-info">
                <h2>{currentSection?.title}</h2>
                <p className="section-description">{currentSection?.description}</p>
              </div>
            </div>

            <div className="audio-player">
              <div className="audio-controls">
                {!hasPlayed ? (
                  <button
                    className={`play-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={isPlaying ? stopAudio : playAudio}
                  >
                    {isPlaying ? '⏹ Stop' : '▶ Play Audio'}
                  </button>
                ) : (
                  <div className="played-message">
                    ✓ Audio played - Answer the questions below
                  </div>
                )}
              </div>
              {isPlaying && (
                <div className="playing-indicator">
                  <span className="pulse"></span> Playing audio...
                </div>
              )}
            </div>

            <div className="listening-content">
              <div className="questions-container">
                <h3>Questions</h3>
                <div className="questions-list">
                  {currentSection?.questions?.map((q, idx) => (
                    <div key={q.id} className="question-item">
                      <div className="question-number">Question {idx + 1}</div>
                      <p className="question-text">{q.question}</p>

                      {q.type === 'multiple-choice' && (
                        <div className="options-list">
                          {q.options?.map((option, optIdx) => (
                            <label key={optIdx} className="option-label">
                              <input
                                type="radio"
                                name={`${currentSection.id}-${q.id}`}
                                value={optIdx}
                                checked={answers[`${currentSection.id}-${q.id}`] === optIdx}
                                onChange={() => handleAnswerChange(currentSection.id, q.id, optIdx)}
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
                          value={answers[`${currentSection.id}-${q.id}`] || ''}
                          onChange={(e) => handleAnswerChange(currentSection.id, q.id, e.target.value)}
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
      <div className="listening-practice">
        <header className="listening-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </button>
            <h1>🎧 Listening Results</h1>
          </div>
        </header>

        <main className="listening-main">
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

              {results?.sectionResults && (
                <div className="section-results">
                  <h3>Results by Section</h3>
                  {results.sectionResults.map((sr, idx) => (
                    <div key={sr.sectionId} className="section-result-item">
                      <span className="sr-title">Part {idx + 1}: {sr.title}</span>
                      <span className="sr-score">{sr.correct} / {sr.total}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="results-actions">
                <button className="action-btn" onClick={resetPractice}>
                  Practice Again
                </button>
                <button className="action-btn secondary" onClick={() => navigate('/listening-history')}>
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

export default ListeningPractice;