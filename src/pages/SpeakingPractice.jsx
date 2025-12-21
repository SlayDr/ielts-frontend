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
  const [step, setStep] = useState('select'); // select, question, preparing, recording, feedback
  const [modelAnswer, setModelAnswer] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [prepTimer, setPrepTimer] = useState(60); // 1 minute prep time for Part 2
  const [speakTimer, setSpeakTimer] = useState(120); // 2 minutes speak time for Part 2
  const [notes, setNotes] = useState(''); // Notes during prep time

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const prepTimerRef = useRef(null);

  const partInfo = {
    1: { title: 'Part 1: Introduction', duration: '4-5 minutes', description: 'Answer questions about familiar topics like home, family, work, studies, and interests.', prepTime: 0, speakTime: 60 },
    2: { title: 'Part 2: Long Turn (Cue Card)', duration: '3-4 minutes', description: 'Speak for 1-2 minutes on a given topic after 1 minute of preparation.', prepTime: 60, speakTime: 120 },
    3: { title: 'Part 3: Discussion', duration: '4-5 minutes', description: 'Discuss abstract ideas related to the Part 2 topic in more depth.', prepTime: 0, speakTime: 120 }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
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

  const startPreparation = () => {
    setPrepTimer(60);
    setNotes('');
    setStep('preparing');
    
    prepTimerRef.current = setInterval(() => {
      setPrepTimer(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          // Auto-start recording after prep time ends
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipPreparation = () => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    startRecording();
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
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.start();
    setIsRecording(true);
    setTranscript('');
    setStep('recording');

    // Set timer based on part
    const speakTime = selectedPart === 2 ? 120 : 60;
    setSpeakTimer(speakTime);
    setTimer(0);

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const newTime = prev + 1;
        setSpeakTimer(speakTime - newTime);
        
        // Auto-stop for Part 2 after 2 minutes
        if (selectedPart === 2 && newTime >= 120) {
          stopRecording();
          return 120;
        }
        return newTime;
      });
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
    submitResponse();
  };

  const submitResponse = async () => {
    if (!transcript.trim()) {
      setError('No speech detected. Please try again.');
      setStep('question');
      return;
    }

    try {
      setLoading(true);
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
          transcript: transcript,
          duration: timer
        })
      });

      if (!response.ok) throw new Error('Failed to submit response');

      const data = await response.json();
      setFeedback(data.feedback || data);
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
        userTranscript: transcript
      })
    });

    if (!response.ok) throw new Error('Failed to fetch model answer');

const data = await response.json();
// Handle both nested and direct modelAnswer formats
const answer = data.modelAnswer || data;
if (typeof answer === 'object' && answer.modelAnswer) {
  setModelAnswer(answer);
} else if (typeof answer === 'string') {
  setModelAnswer({ modelAnswer: answer, keyVocabulary: [], improvements: '' });
} else {
  setModelAnswer({ modelAnswer: 'Model answer not available', keyVocabulary: [], improvements: '' });
}
  } catch (err) {
    setError(err.message);
  } finally {
    setLoadingModel(false);
  }
};

  const resetPractice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    
    setSelectedPart(null);
    setQuestion(null);
    setIsRecording(false);
    setTranscript('');
    setTimer(0);
    setFeedback(null);
    setModelAnswer(null);
    setNotes('');
    setPrepTimer(60);
    setSpeakTimer(120);
    setStep('select');
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
                  className={`part-card ${part === 2 ? 'featured' : ''}`}
                  onClick={() => {
                    setSelectedPart(part);
                    fetchQuestion(part);
                  }}
                >
                  {part === 2 && <div className="part-badge">Cue Card</div>}
                  <div className="part-number">Part {part}</div>
                  <h3>{partInfo[part].title}</h3>
                  <p className="part-duration">⏱️ {partInfo[part].duration}</p>
                  <p className="part-description">{partInfo[part].description}</p>
                  {part === 2 && (
                    <div className="part-highlight">
                      <span>📝 1 min prep</span>
                      <span>🎤 2 min speak</span>
                    </div>
                  )}
                  <button className="start-btn">Start Practice →</button>
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
              
              {selectedPart === 2 && question.bulletPoints && (
                <div className="cue-card">
                  <h3>You should say:</h3>
                  <ul className="bullet-points">
                    {question.bulletPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedPart === 2 && (
                <p className="prep-note">
                  📝 You will have <strong>1 minute</strong> to prepare and make notes, 
                  then <strong>2 minutes</strong> to speak.
                </p>
              )}
            </div>
            <div className="action-buttons">
              <button className="btn-secondary" onClick={resetPractice}>
                Choose Different Part
              </button>
              {selectedPart === 2 ? (
                <button className="btn-primary" onClick={startPreparation}>
                  📝 Start Preparation (1 min)
                </button>
              ) : (
                <button className="btn-primary" onClick={startRecording}>
                  🎤 Start Recording
                </button>
              )}
            </div>
          </section>
        )}

        {/* Preparation Phase (Part 2 only) */}
        {step === 'preparing' && (
          <section className="preparation-section">
            <div className="part-badge">Part {selectedPart} - Preparation</div>
            
            <div className="prep-timer-container">
              <div className={`prep-timer ${prepTimer <= 10 ? 'timer-warning' : ''}`}>
                <span className="timer-label">Preparation Time</span>
                <span className="timer-value">{formatTime(prepTimer)}</span>
              </div>
            </div>

            <div className="question-card">
              <h2>Your Topic</h2>
              <p className="question-text">{question.question}</p>
              
              {question.bulletPoints && (
                <div className="cue-card">
                  <h3>You should say:</h3>
                  <ul className="bullet-points">
                    {question.bulletPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="notes-section">
              <h3>📝 Your Notes</h3>
              <textarea
                className="notes-input"
                placeholder="Write your notes here... (bullet points, key ideas, vocabulary)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="action-buttons">
              <button className="btn-secondary" onClick={resetPractice}>
                Cancel
              </button>
              <button className="btn-primary" onClick={skipPreparation}>
                🎤 Start Speaking Now
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
            
            <div className={`timer ${selectedPart === 2 && speakTimer <= 30 ? 'timer-warning' : ''}`}>
              {selectedPart === 2 ? (
                <>
                  <span className="timer-label">Time Remaining</span>
                  <span className="timer-value">{formatTime(speakTimer)}</span>
                </>
              ) : (
                <>
                  <span className="timer-label">Recording Time</span>
                  <span className="timer-value">{formatTime(timer)}</span>
                </>
              )}
            </div>
            
            <p className="recording-status">Recording... Speak clearly</p>
            
            <div className="live-transcript">
              <h4>Live Transcript:</h4>
              <p>{transcript || 'Start speaking...'}</p>
            </div>
            
            <button className="btn-stop" onClick={stopRecording}>
              ⏹ Stop Recording
            </button>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Processing your response...</p>
          </div>
        )}

        {/* Feedback */}
        {step === 'feedback' && feedback && (
          <section className="feedback-section">
            <h2>Your Feedback</h2>
            
            <div className="score-display">
              <div className={`score-circle ${getScoreColor(feedback.overallBand || feedback.band)}`}>
                <span className="score-value">{feedback.overallBand || feedback.band}</span>
                <span className="score-label">Band</span>
              </div>
            </div>

            {feedback.scores && (
              <div className="criteria-scores">
                <div className="criteria-item">
                  <span className="criteria-label">Fluency & Coherence</span>
                  <span className="criteria-score">{feedback.scores.fluencyCoherence}</span>
                </div>
                <div className="criteria-item">
                  <span className="criteria-label">Lexical Resource</span>
                  <span className="criteria-score">{feedback.scores.lexicalResource}</span>
                </div>
                <div className="criteria-item">
                  <span className="criteria-label">Grammar</span>
                  <span className="criteria-score">{feedback.scores.grammaticalRange}</span>
                </div>
                <div className="criteria-item">
                  <span className="criteria-label">Pronunciation</span>
                  <span className="criteria-score">{feedback.scores.pronunciation}</span>
                </div>
              </div>
            )}

            <div className="feedback-details">
              <div className="transcript-section">
                <h3>Your Response</h3>
                <p>{transcript}</p>
                <span className="duration">Duration: {formatTime(timer)}</span>
              </div>

              {feedback.feedback && (
                <div className="feedback-text">
                  <h3>Detailed Feedback</h3>
                  <p>{feedback.feedback}</p>
                </div>
              )}

              {feedback.suggestions && (
                <div className="suggestions">
                  <h3>Suggestions for Improvement</h3>
                  <ul>
                    {feedback.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="model-answer-section">
 {!modelAnswer ? (
  <button 
    className="btn-model" 
    onClick={fetchModelAnswer}
    disabled={loadingModel}
  >
    {loadingModel ? 'Loading...' : '📖 View Model Answer'}
  </button>
) : (
  <div className="model-answer">
    <h3>Model Answer</h3>
    {typeof modelAnswer === 'object' ? (
      <>
        <p>{typeof modelAnswer.modelAnswer === 'string' ? modelAnswer.modelAnswer : 'Model answer not available'}</p>
        {modelAnswer.keyVocabulary && modelAnswer.keyVocabulary.length > 0 && (
          <div className="key-vocabulary">
            <h4>Key Vocabulary</h4>
            <ul>
              {modelAnswer.keyVocabulary.map((word, idx) => (
                <li key={idx}>{word}</li>
              ))}
            </ul>
          </div>
        )}
        {modelAnswer.improvements && (
          <div className="improvements-tip">
            <h4>Tips for Improvement</h4>
            <p>{modelAnswer.improvements}</p>
          </div>
        )}
      </>
    ) : (
      <p>{modelAnswer}</p>
    )}
  </div>
)}
            </div>

            <div className="action-buttons">
              <button className="btn-secondary" onClick={resetPractice}>
                Practice Another Question
              </button>
              <button className="btn-primary" onClick={() => navigate('/speaking-history')}>
                View History
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SpeakingPractice;