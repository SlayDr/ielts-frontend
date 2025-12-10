import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListeningPractice.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const ListeningPractice = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // select, listening, results
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

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
      setStep('listening');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!selectedSection || isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(selectedSection.transcript);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setHasPlayed(true);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setError('Audio playback failed. Please try again.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
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
      stopAudio();
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/listening/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionId: selectedSection.id,
          answers
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
    stopAudio();
    setSelectedSection(null);
    setAnswers({});
    setResults(null);
    setHasPlayed(false);
    setStep('select');
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
    <div className="listening-practice">
      <header className="listening-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => { stopAudio(); navigate('/dashboard'); }}>
            ← Dashboard
          </button>
          <h1>🎧 Listening Practice</h1>
          <p className="subtitle">Practice IELTS Listening with audio</p>
        </div>
      </header>

      <main className="listening-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Section Selection */}
        {step === 'select' && (
          <section className="section-selection">
            <h2>Choose a Listening Section</h2>
            <p className="selection-subtitle">Select a section to practice your listening skills</p>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading sections...</p>
              </div>
            ) : (
              <div className="sections-grid">
                {sections.map(section => (
                  <div
                    key={section.id}
                    className="section-card"
                    onClick={() => selectSection(section.id)}
                  >
                    <div className="section-header">
                      <span className="part-badge">Part {section.part}</span>
                      <span className={`difficulty-badge ${getDifficultyColor(section.difficulty)}`}>
                        {section.difficulty}
                      </span>
                    </div>
                    <h3>{section.title}</h3>
                    <p className="section-description">{section.description}</p>
                    <div className="section-footer">
                      <span className="question-count">{section.questionCount} questions</span>
                      <button className="start-btn">Start Practice →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Listening Section */}
        {step === 'listening' && selectedSection && (
          <section className="listening-section">
            <div className="listening-toolbar">
              <div className="section-info">
                <h2>{selectedSection.title}</h2>
                <div className="badges">
                  <span className="part-badge">Part {selectedSection.part}</span>
                  <span className={`difficulty-badge ${getDifficultyColor(selectedSection.difficulty)}`}>
                    {selectedSection.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="audio-player">
              <div className="player-content">
                <div className={`player-icon ${isPlaying ? 'playing' : ''}`}>
                  🎧
                </div>
                <div className="player-info">
                  <h3>Audio Recording</h3>
                  <p>{selectedSection.description}</p>
                </div>
                <div className="player-controls">
                  {!isPlaying ? (
                    <button className="play-btn" onClick={playAudio}>
                      ▶ {hasPlayed ? 'Replay' : 'Play'} Audio
                    </button>
                  ) : (
                    <button className="stop-btn" onClick={stopAudio}>
                      ⏹ Stop
                    </button>
                  )}
                </div>
              </div>
              {isPlaying && (
                <div className="playing-indicator">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <span>Playing audio...</span>
                </div>
              )}
              <p className="audio-note">
                💡 Tip: Listen carefully! In the real IELTS test, you can only hear the audio once.
              </p>
            </div>

            <div className="questions-container">
              <h3>Questions</h3>
              <div className="questions-list">
                {selectedSection.questions.map((q, idx) => (
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
                  Answered: {Object.keys(answers).length} / {selectedSection.questions.length}
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
                🎧 Try Another Section
              </button>
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                🏠 Back to Dashboard
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ListeningPractice;