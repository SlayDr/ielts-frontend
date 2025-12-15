import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { essayAPI } from '../../services/api';
import './WritingPractice.css';

// Task 2 questions (essay questions)
const task2Questions = [
  "Some people think that governments should invest more in public services instead of spending money on arts and culture. To what extent do you agree or disagree?",
  "These days more fathers stay at home and take care of their children while mothers go out to work. What are the reasons for this? Is this a positive or negative development?",
  "In many countries, the amount of crime is increasing. What do you think are the main causes of crime? What solutions can you suggest?",
  "Some people believe that technology has made our lives too complex, and the solution is to live a simpler life without technology. To what extent do you agree or disagree?",
  "Many people today prefer to read news online rather than in newspapers. What are the advantages and disadvantages of this trend?"
];

// Task 1 questions (graphs, charts, maps, processes)
const task1Questions = [
  {
    id: 1,
    type: 'line-graph',
    title: 'Internet Usage by Age Group',
    description: 'The line graph below shows the percentage of people using the internet by age group from 2000 to 2020.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['2000', '2005', '2010', '2015', '2020'],
      datasets: [
        { label: '16-24', data: [40, 65, 85, 95, 99], color: '#4CAF50' },
        { label: '25-44', data: [30, 55, 78, 90, 97], color: '#2196F3' },
        { label: '45-64', data: [15, 35, 60, 80, 92], color: '#FF9800' },
        { label: '65+', data: [5, 12, 25, 45, 70], color: '#9C27B0' }
      ]
    }
  },
  {
    id: 2,
    type: 'bar-chart',
    title: 'Water Consumption by Sector',
    description: 'The bar chart below shows water consumption (%) in different sectors in five countries.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['USA', 'China', 'India', 'Brazil', 'UK'],
      datasets: [
        { label: 'Agriculture', data: [40, 65, 85, 60, 30], color: '#4CAF50' },
        { label: 'Industry', data: [45, 25, 10, 25, 35], color: '#2196F3' },
        { label: 'Domestic', data: [15, 10, 5, 15, 35], color: '#FF9800' }
      ]
    }
  },
  {
    id: 3,
    type: 'pie-chart',
    title: 'Household Energy Use',
    description: 'The pie chart below shows the breakdown of energy consumption in an average UK household.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      segments: [
        { label: 'Heating', value: 42, color: '#FF6384' },
        { label: 'Hot Water', value: 25, color: '#36A2EB' },
        { label: 'Appliances', value: 18, color: '#FFCE56' },
        { label: 'Lighting', value: 10, color: '#4BC0C0' },
        { label: 'Cooking', value: 5, color: '#9966FF' }
      ]
    }
  },
  {
    id: 4,
    type: 'process',
    title: 'Chocolate Production Process',
    description: 'The diagram below shows the stages in the production of chocolate.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      steps: [
        'Cocoa pods harvested from trees',
        'Beans removed from pods',
        'Beans fermented for 5-7 days',
        'Beans dried in sun',
        'Beans roasted at 120-150°C',
        'Shells removed (winnowing)',
        'Nibs ground into cocoa paste',
        'Chocolate refined and tempered'
      ]
    }
  },
  {
    id: 5,
    type: 'map',
    title: 'Riverside Town Development',
    description: 'The two maps below show the changes in a small town called Riverside between 1990 and 2020.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      before: {
        year: '1990',
        features: ['Farmland covering northern area', 'Small town center with shops', 'River running east to west', 'Dense forest in southern region', 'Single bridge crossing river', 'Railway station in the east']
      },
      after: {
        year: '2020',
        features: ['Shopping mall replaced farmland', 'Expanded residential areas', 'New motorway bridge added', 'Forest reduced by 50%', 'Sports complex built in south', 'New hospital near station']
      }
    }
  },
  {
    id: 6,
    type: 'table',
    title: 'University Graduate Employment',
    description: 'The table below shows the employment rates of graduates from different degree subjects six months after graduation.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      headers: ['Subject', '2015', '2018', '2021'],
      rows: [
        ['Medicine', '99%', '99%', '98%'],
        ['Engineering', '85%', '88%', '92%'],
        ['Computer Science', '80%', '87%', '95%'],
        ['Business', '75%', '78%', '82%'],
        ['Arts', '55%', '52%', '48%'],
        ['Humanities', '50%', '48%', '45%']
      ]
    }
  }
];

function WritingPractice() {
  const navigate = useNavigate();
  
  // Task selection state
  const [selectedTask, setSelectedTask] = useState(null); // null, 'task1', or 'task2'
  
  // Common states
  const [essay, setEssay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [rewrittenEssay, setRewrittenEssay] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);
  
  // Task 2 state
  const [task2Question, setTask2Question] = useState(() =>
    task2Questions[Math.floor(Math.random() * task2Questions.length)]
  );
  
  // Task 1 state
  const [task1Question, setTask1Question] = useState(() =>
    task1Questions[Math.floor(Math.random() * task1Questions.length)]
  );

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Start timer when task is selected
  useEffect(() => {
    if (selectedTask && timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedTask, timerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTask = (taskType) => {
    setSelectedTask(taskType);
    if (taskType === 'task1') {
      setTimeRemaining(20 * 60); // 20 minutes for Task 1
    } else {
      setTimeRemaining(40 * 60); // 40 minutes for Task 2
    }
    setTimerActive(true);
  };

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const minWords = selectedTask === 'task1' ? 150 : 250;

  const handleSubmit = async () => {
    if (wordCount < 50) {
      setError('Please write at least 50 words.');
      return;
    }

    setError('');
    setLoading(true);
    setTimerActive(false);

    try {
      let response;
      if (selectedTask === 'task1') {
        response = await essayAPI.evaluateTask1({
          question: `${task1Question.title}: ${task1Question.description} ${task1Question.question}`,
          response: essay,
          taskType: task1Question.type
        });
      } else {
        response = await essayAPI.evaluate(essay);
      }
      setFeedback(response.data.feedback || response.data.evaluation);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to evaluate essay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    setRewriteLoading(true);
    try {
      const question = selectedTask === 'task1' 
        ? `${task1Question.title}: ${task1Question.description}`
        : task2Question;
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
    setSelectedTask(null);
    setTimerActive(false);
    setTimeRemaining(null);
    // Get new random questions
    setTask1Question(task1Questions[Math.floor(Math.random() * task1Questions.length)]);
    setTask2Question(task2Questions[Math.floor(Math.random() * task2Questions.length)]);
  };

  const getNewQuestion = () => {
    if (selectedTask === 'task1') {
      let newQuestion;
      do {
        newQuestion = task1Questions[Math.floor(Math.random() * task1Questions.length)];
      } while (newQuestion.id === task1Question.id && task1Questions.length > 1);
      setTask1Question(newQuestion);
    } else {
      let newQuestion;
      do {
        newQuestion = task2Questions[Math.floor(Math.random() * task2Questions.length)];
      } while (newQuestion === task2Question && task2Questions.length > 1);
      setTask2Question(newQuestion);
    }
    setEssay('');
    setError('');
  };

  // Render Task 1 visual data
  const renderTask1Visual = () => {
    const q = task1Question;
    
    if (q.type === 'line-graph' || q.type === 'bar-chart') {
      return (
        <div className="chart-container">
          <div className="chart-visual">
            <div className="chart-legend">
              {q.imageData.datasets.map((dataset, idx) => (
                <span key={idx} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: dataset.color }}></span>
                  {dataset.label}
                </span>
              ))}
            </div>
            <div className="chart-data">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year/Country</th>
                    {q.imageData.labels.map((label, idx) => (
                      <th key={idx}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {q.imageData.datasets.map((dataset, idx) => (
                    <tr key={idx}>
                      <td style={{ color: dataset.color, fontWeight: 'bold' }}>{dataset.label}</td>
                      {dataset.data.map((value, vIdx) => (
                        <td key={vIdx}>{value}%</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    
    if (q.type === 'pie-chart') {
      return (
        <div className="chart-container">
          <div className="pie-chart-visual">
            {q.imageData.segments.map((segment, idx) => (
              <div key={idx} className="pie-segment">
                <span className="segment-color" style={{ backgroundColor: segment.color }}></span>
                <span className="segment-label">{segment.label}</span>
                <span className="segment-value">{segment.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (q.type === 'process') {
      return (
        <div className="chart-container">
          <div className="process-visual">
            {q.imageData.steps.map((step, idx) => (
              <div key={idx} className="process-step">
                <div className="step-number">{idx + 1}</div>
                <div className="step-text">{step}</div>
                {idx < q.imageData.steps.length - 1 && <div className="step-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (q.type === 'map') {
      return (
        <div className="chart-container">
          <div className="map-visual">
            <div className="map-panel">
              <h4>{q.imageData.before.year}</h4>
              <ul>
                {q.imageData.before.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="map-arrow">→</div>
            <div className="map-panel">
              <h4>{q.imageData.after.year}</h4>
              <ul>
                {q.imageData.after.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
    if (q.type === 'table') {
      return (
        <div className="chart-container">
          <table className="data-table">
            <thead>
              <tr>
                {q.imageData.headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.imageData.rows.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    return null;
  };

  // Task Selection Screen
  if (!selectedTask) {
    return (
      <div className="writing-practice-container">
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        
        <div className="task-selection">
          <h1>✍️ IELTS Writing Practice</h1>
          <p className="selection-subtitle">Choose your task type to begin</p>
          
          <div className="task-options">
            <div className="task-card" onClick={() => startTask('task1')}>
              <div className="task-icon">📊</div>
              <h2>Task 1</h2>
              <p className="task-time">⏱️ 20 minutes</p>
              <p className="task-words">📝 Minimum 150 words</p>
              <p className="task-description">
                Describe visual information such as graphs, charts, tables, maps, or processes.
              </p>
              <ul className="task-types">
                <li>Line graphs</li>
                <li>Bar charts</li>
                <li>Pie charts</li>
                <li>Tables</li>
                <li>Maps</li>
                <li>Process diagrams</li>
              </ul>
              <button className="start-task-btn">Start Task 1</button>
            </div>
            
            <div className="task-card" onClick={() => startTask('task2')}>
              <div className="task-icon">📝</div>
              <h2>Task 2</h2>
              <p className="task-time">⏱️ 40 minutes</p>
              <p className="task-words">📝 Minimum 250 words</p>
              <p className="task-description">
                Write an essay responding to a point of view, argument, or problem.
              </p>
              <ul className="task-types">
                <li>Opinion essays</li>
                <li>Discussion essays</li>
                <li>Problem/Solution</li>
                <li>Advantages/Disadvantages</li>
                <li>Two-part questions</li>
              </ul>
              <button className="start-task-btn">Start Task 2</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Feedback View
  if (feedback) {
    return (
      <div className="feedback-container">
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>

        <div className="header">
          <h1>Your Results</h1>
          <p>AI-powered feedback on your {selectedTask === 'task1' ? 'Task 1 report' : 'Task 2 essay'}</p>
        </div>

        <div className="band-score">
          <div className="score">{feedback.overallBand}</div>
          <div className="score-label">Overall Band Score</div>
        </div>

        <div className="criteria-scores">
          <div className="criteria">
            <span className="criteria-label">
              {selectedTask === 'task1' ? 'Task Achievement' : 'Task Response'}
            </span>
            <span className="criteria-score">{feedback.taskAchievement || feedback.taskResponse}</span>
          </div>
          <div className="criteria">
            <span className="criteria-label">Coherence & Cohesion</span>
            <span className="criteria-score">{feedback.coherenceCohesion}</span>
          </div>
          <div className="criteria">
            <span className="criteria-label">Lexical Resource</span>
            <span className="criteria-score">{feedback.lexicalResource}</span>
          </div>
          <div className="criteria">
            <span className="criteria-label">Grammatical Range</span>
            <span className="criteria-score">{feedback.grammaticalRange}</span>
          </div>
        </div>

        <div className="feedback-sections">
          <div className="feedback-section strengths">
            <h3>💪 Strengths</h3>
            <ul>
              {feedback.strengths?.map((s, i) => <li key={i}>{s}</li>) || 
               feedback.feedback?.strengths?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="feedback-section improvements">
            <h3>📈 Areas for Improvement</h3>
            <ul>
              {feedback.improvements?.map((s, i) => <li key={i}>{s}</li>) ||
               feedback.feedback?.improvements?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {(feedback.taskSpecificFeedback || feedback.feedback?.taskSpecificFeedback) && (
            <div className="feedback-section task-specific">
              <h3>🎯 Task-Specific Feedback</h3>
              <p>{feedback.taskSpecificFeedback || feedback.feedback?.taskSpecificFeedback}</p>
            </div>
          )}

          {(feedback.summary || feedback.feedback?.summary) && (
            <div className="feedback-section summary">
              <h3>📋 Summary</h3>
              <p>{feedback.summary || feedback.feedback?.summary}</p>
            </div>
          )}
        </div>

        {!rewrittenEssay ? (
          <button 
            className="rewrite-btn" 
            onClick={handleRewrite}
            disabled={rewriteLoading}
          >
            {rewriteLoading ? '✨ Generating improved version...' : '✨ Generate Band 8+ Version'}
          </button>
        ) : (
          <div className="rewritten-section">
            <h3>✨ Band 8+ Model Answer</h3>
            <div className="rewritten-essay">{rewrittenEssay}</div>
          </div>
        )}

        <div className="action-buttons">
          <button className="new-essay-btn" onClick={handleNewEssay}>
            📝 New Writing Task
          </button>
          <button className="history-btn" onClick={() => navigate('/essay-history')}>
            📚 View History
          </button>
        </div>
      </div>
    );
  }

  // Writing Task View
  return (
    <div className="writing-practice-container">
      <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>

      <div className="header">
        <h1>✍️ Writing {selectedTask === 'task1' ? 'Task 1' : 'Task 2'}</h1>
        {timeRemaining !== null && (
          <div className={`timer ${timeRemaining < 300 ? 'timer-warning' : ''}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      <div className="question-section">
        <div className="question-header">
          <span className="question-label">
            {selectedTask === 'task1' ? task1Question.type.replace('-', ' ').toUpperCase() : 'ESSAY QUESTION'}
          </span>
          <button className="new-question-btn" onClick={getNewQuestion}>
            🔄 New Question
          </button>
        </div>
        
        {selectedTask === 'task1' ? (
          <>
            <h3 className="question-title">{task1Question.title}</h3>
            <p className="question-description">{task1Question.description}</p>
            {renderTask1Visual()}
            <p className="question-prompt">{task1Question.question}</p>
          </>
        ) : (
          <p className="question-text">{task2Question}</p>
        )}
      </div>

      <div className="essay-section">
        <div className="word-count">
          Words: <span className={wordCount >= minWords ? 'count-good' : 'count-low'}>{wordCount}</span>
          <span className="min-words"> (minimum {minWords})</span>
        </div>
        
        <textarea
          className="essay-input"
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder={selectedTask === 'task1' 
            ? "Write your Task 1 report here. Describe the main features and make comparisons where relevant..."
            : "Write your essay here. Remember to include an introduction, body paragraphs, and conclusion..."
          }
          disabled={loading}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button className="back-to-selection" onClick={handleNewEssay}>
            ← Change Task
          </button>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={loading || wordCount < 50}
          >
            {loading ? 'Evaluating...' : '📤 Submit for Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WritingPractice;