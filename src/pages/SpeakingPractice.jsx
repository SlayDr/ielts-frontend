import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpeakingPractice.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://ielts-backend-0u1s.onrender.com';

const SpeakingPractice = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState(null);
  const [question, setQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select');
  const [modelAnswer, setModelAnswer] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const partInfo = {
    1: { title: 'Part 1: Introduction', duration: '4-5 minutes', description: 'Answer questions about familiar topics' },
    2: { title: 'Part 2: Long Turn', duration: '3-4 minutes', description: 'Speak for 1-2 minutes on a topic card' },
    3: { title: 'Part 3: Discussion', duration: '4-5 minutes', description: 'Discuss abstract ideas related to Part 2' }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const fetchQuestion = async (part) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/speaking/questions/${part}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch question');
      
      const data = await response.json();
      setQuestion(data.question);
      setStep('question');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    let finalTranscript = '';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError('Speech recognition error: ' + event.error);
      }
    };

    recognitionRef.current.start();
    setIsRecording(true);
    setStep('recording');
    setTimer(0);

    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setStep('review');
  };

  const submitForFeedback = async () => {
    if (!transcript.trim()) {
      setError('No speech detected. Please try recording again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/speaking/evaluate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          part: selectedPart,
          question: question.question,
          transcript: transcript.trim(),
          duration: timer
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setStep('feedback');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModelAnswer = async () => {
    try {
      setLoadingModel(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/speaking/model-answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          part: selectedPart,
          question: question.question,
          userTranscript: transcript.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get model answer');
      }

      const data = await response.json();
      setModelAnswer(data.modelAnswer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingModel(false);
    }
  };

  const resetPractice = () => {
    setSelectedPart(null);
    setQuestion(null);
    setTranscript('');
    setTimer(0);
    setFeedback(null);
    setError(null);
    setModelAnswer(null);
    setStep('select');
  };

  const tryNewQuestion = () => {
    setQuestion(null);
    setTranscript('');
    setTimer(0);
    setFeedback(null);
    setError(null);
    setModelAnswer(null);
    fetchQuestion(selectedPart);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'score-high';
    if (score >= 5.5) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="speaking-practice">
      <header className="speaking-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h1>🎤 Speaking Practice</h1>
          <p className="subtitle">Practice IELTS Speaking with AI feedback</p>
        </div>
      </header>

      <main className="speaking-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Part Selection */}
        {step === 'select' && (
          <section className="part-selection">
            <h2>Choose a Speaking Part</h2>
            <div className="parts-grid">
              {[1, 2, 3].map(part => (
                <div
                  key={part}
                  className="part-card"
                  onClick={() => {
                    setSelectedPart(part);
                    fetchQuestion(part);
                  }}
                >
                  <div className="part-number">Part {part}</div>
                  <h3>{partInfo[part].title}</h3>
                  <p className="part-duration">{partInfo[part].duration}</p>
                  <p className="part-description">{partInfo[part].description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Question Display */}
        {step === 'question' && question && (
          <section className="question-section">
            <div className="part-badge">Part {selectedPart}</div>
            <div className="topic-badge">{question.topic}</div>
            <div className="question-card">
              <h2>Your Question</h2>
              <p className="question-text">{question.question}</p>
              {selectedPart === 2 && (
                <p className="prep-note">You have 1 minute to prepare, then speak for 1-2 minutes.</p>
              )}
            </div>
            <div className="action-buttons">
              <button className="btn-secondary" onClick={resetPractice}>
                Choose Different Part
              </button>
              <button className="btn-primary" onClick={startRecording}>
                🎤 Start Recording
              </button>
            </div>
          </section>
        )}

        {/* Recording */}
        {step === 'recording' && (
          <section className="recording-section">
            <div className="part-badge">Part {selectedPart}</div>
            <div className="question-reminder">
              <strong>Question:</strong> {question.question}
            </div>
            <div className="recording-indicator">
              <div className="pulse-ring"></div>
              <div className="mic-icon">🎤</div>
            </div>
            <div className="timer">{formatTime(timer)}</div>
            <p className="recording-status">Recording... Speak clearly</p>
            <div className="live-transcript">
              <h4>Live Transcript:</h4>
              <p>{transcript || 'Start speaking...'}</p>
            </div>
            <button className="btn-stop" onClick={stopRecording}>
              ⏹️ Stop Recording
            </button>
          </section>
        )}

        {/* Review */}
        {step === 'review' && (
          <section className="review-section">
            <h2>Review Your Response</h2>
            <div className="stats-row">
              <div className="stat">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{formatTime(timer)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Words</span>
                <span className="stat-value">{transcript.split(/\s+/).filter(w => w).length}</span>
              </div>
            </div>
            <div className="transcript-review">
              <h4>Your Transcript:</h4>
              <p>{transcript || 'No speech detected'}</p>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary" onClick={tryNewQuestion}>
                🔄 Try Again
              </button>
              <button 
                className="btn-primary" 
                onClick={submitForFeedback}
                disabled={loading || !transcript.trim()}
              >
                {loading ? 'Analyzing...' : '📊 Get AI Feedback'}
              </button>
            </div>
          </section>
        )}

        {/* Feedback */}
        {step === 'feedback' && feedback && (
          <section className="feedback-section">
            <h2>Your Speaking Feedback</h2>
            
            <div className="overall-score">
              <div className={`score-circle ${getScoreColor(feedback.overallBand)}`}>
                <span className="score-number">{feedback.overallBand}</span>
                <span className="score-label">Overall Band</span>
              </div>
            </div>

            <div className="criteria-scores">
              <div className="criterion">
                <span className="criterion-name">Fluency & Coherence</span>
                <span className={`criterion-score ${getScoreColor(feedback.fluencyCoherence)}`}>
                  {feedback.fluencyCoherence}
                </span>
              </div>
              <div className="criterion">
                <span className="criterion-name">Lexical Resource</span>
                <span className={`criterion-score ${getScoreColor(feedback.lexicalResource)}`}>
                  {feedback.lexicalResource}
                </span>
              </div>
              <div className="criterion">
                <span className="criterion-name">Grammatical Range</span>
                <span className={`criterion-score ${getScoreColor(feedback.grammaticalRange)}`}>
                  {feedback.grammaticalRange}
                </span>
              </div>
              <div className="criterion">
                <span className="criterion-name">Pronunciation</span>
                <span className={`criterion-score ${getScoreColor(feedback.pronunciation)}`}>
                  {feedback.pronunciation}
                </span>
              </div>
            </div>

            <div className="feedback-details">
              <div className="feedback-card strengths">
                <h4>💪 Strengths</h4>
                <ul>
                  {feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="feedback-card improvements">
                <h4>📈 Areas to Improve</h4>
                <ul>
                  {feedback.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="summary-card">
              <h4>📝 Summary</h4>
              <p>{feedback.summary}</p>
            </div>

            {/* Model Answer Section */}
            {!modelAnswer ? (
              <div className="model-answer-prompt">
                <button 
                  className="btn-model-answer"
                  onClick={fetchModelAnswer}
                  disabled={loadingModel}
                >
                  {loadingModel ? '⏳ Generating...' : '✨ See Model Answer (Band 8+)'}
                </button>
                <p className="model-answer-hint">See how a Band 8+ speaker would answer this question</p>
              </div>
            ) : (
              <div className="model-answer-section">
                <h3>✨ Band 8+ Model Answer</h3>
                <div className="model-answer-content">
                  <p>{modelAnswer.modelAnswer}</p>
                </div>
                
                <div className="key-vocabulary">
                  <h4>🔤 Key Vocabulary to Learn</h4>
                  <div className="vocab-tags">
                    {modelAnswer.keyVocabulary?.map((word, i) => (
                      <span key={i} className="vocab-tag">{word}</span>
                    ))}
                  </div>
                </div>

                <div className="improvement-tips">
                  <h4>💡 How to Improve</h4>
                  <p>{modelAnswer.improvements}</p>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="btn-secondary" onClick={tryNewQuestion}>
                🔄 Try Another Question
              </button>
              <button className="btn-primary" onClick={resetPractice}>
                📚 Choose Different Part
              </button>
            </div>
          </section>
        )}

        {loading && step !== 'review' && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpeakingPractice;