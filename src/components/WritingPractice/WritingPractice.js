import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { essayAPI } from '../../services/api';
import './WritingPractice.css';

// Task 2 questions (essay questions)
const task2Questions = [
  // Opinion Essays (Agree/Disagree)
  "Some people think that governments should invest more in public services instead of spending money on arts and culture. To what extent do you agree or disagree?",
  "Some people believe that technology has made our lives too complex, and the solution is to live a simpler life without technology. To what extent do you agree or disagree?",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better ways to reduce crime. Discuss both views and give your opinion.",
  "In many countries, the gap between the rich and the poor is increasing. What problems does this cause? What solutions can you suggest?",
  "Some people believe that children should be taught to be competitive. Others think they should learn to cooperate. Discuss both views and give your opinion.",
  "Many people believe that social networking sites have had a huge negative impact on both individuals and society. To what extent do you agree or disagree?",
  "Some people think that it is better to educate boys and girls in separate schools. Others believe that both sexes should be educated together. Discuss both views and give your opinion.",
  "The increasing use of technology in education is changing the role of teachers. To what extent do you agree or disagree?",
  
  // Discussion Essays
  "These days more fathers stay at home and take care of their children while mothers go out to work. What are the reasons for this? Is this a positive or negative development?",
  "In many countries, the amount of crime is increasing. What do you think are the main causes of crime? What solutions can you suggest?",
  "Many people today prefer to read news online rather than in newspapers. What are the advantages and disadvantages of this trend?",
  "Some people think that governments should spend money on railways rather than roads. To what extent do you agree or disagree?",
  "In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university. Discuss the advantages and disadvantages of this.",
  "Some people believe that unpaid community service should be a compulsory part of high school programs. To what extent do you agree or disagree?",
  "More and more people are relying on private cars as their main form of transportation. Describe some of the problems caused by this and suggest some solutions.",
  
  // Problem/Solution Essays
  "Global warming is one of the biggest threats humans face in the 21st century. What are the causes of global warming and what solutions are there?",
  "In many cities, traffic congestion is a major problem. What are the causes? What measures could be taken to reduce traffic in big cities?",
  "Obesity is an increasing problem in many countries, especially among young people. What are the causes and effects of this problem? What solutions can be implemented?",
  "Many languages are dying out every year. What are the causes of this? What effects will it have on society?",
  "Plastic pollution is becoming an increasingly serious environmental problem. What are the causes? What solutions would you suggest?",
  
  // Advantages/Disadvantages Essays
  "Many museums and historical sites are mainly visited by tourists, not local people. Why is this? What can be done to attract local people?",
  "In some countries, an increasing number of people are suffering from health problems as a result of eating too much fast food. What are the causes? What can be done about this?",
  "Some people prefer to spend their lives doing the same things and avoiding change. Others think that change is always a good thing. Discuss both views and give your opinion.",
  "Many governments think that economic progress is their most important goal. Some people, however, think that other types of progress are equally important. Discuss both views and give your opinion.",
  "Some people think that parents should teach children how to be good members of society. Others believe that school is the place to learn this. Discuss both views and give your opinion."
];

// Task 1 questions (graphs, charts, maps, processes)
const task1Questions = [
  // LINE GRAPHS (4)
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
    type: 'line-graph',
    title: 'Global CO2 Emissions',
    description: 'The graph shows carbon dioxide emissions (in billion tonnes) from four major countries between 1990 and 2020.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['1990', '1995', '2000', '2005', '2010', '2015', '2020'],
      datasets: [
        { label: 'China', data: [2.4, 3.0, 3.4, 5.5, 8.5, 9.5, 10.2], color: '#E53935' },
        { label: 'USA', data: [5.0, 5.3, 5.8, 5.9, 5.5, 5.2, 4.8], color: '#1E88E5' },
        { label: 'India', data: [0.6, 0.8, 1.0, 1.2, 1.7, 2.2, 2.6], color: '#43A047' },
        { label: 'Russia', data: [2.4, 1.8, 1.5, 1.6, 1.6, 1.5, 1.5], color: '#FB8C00' }
      ]
    }
  },
  {
    id: 3,
    type: 'line-graph',
    title: 'University Enrollment Rates',
    description: 'The line graph shows the percentage of 18-24 year olds enrolled in university education in three countries from 1980 to 2020.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['1980', '1990', '2000', '2010', '2020'],
      datasets: [
        { label: 'South Korea', data: [15, 35, 68, 95, 98], color: '#3F51B5' },
        { label: 'UK', data: [20, 25, 35, 48, 55], color: '#009688' },
        { label: 'Brazil', data: [10, 12, 18, 28, 42], color: '#FF5722' }
      ]
    }
  },
  {
    id: 4,
    type: 'line-graph',
    title: 'Smartphone Sales',
    description: 'The line graph shows the number of smartphones sold (in millions) by three major companies between 2010 and 2022.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022'],
      datasets: [
        { label: 'Samsung', data: [20, 95, 180, 220, 280, 250, 270], color: '#1565C0' },
        { label: 'Apple', data: [40, 125, 170, 210, 205, 200, 230], color: '#616161' },
        { label: 'Huawei', data: [5, 25, 70, 140, 200, 180, 120], color: '#C62828' }
      ]
    }
  },

  // BAR CHARTS (4)
  {
    id: 5,
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
    id: 6,
    type: 'bar-chart',
    title: 'Average Working Hours',
    description: 'The bar chart shows the average number of working hours per week in six different countries.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['Mexico', 'South Korea', 'USA', 'Japan', 'UK', 'Germany'],
      datasets: [
        { label: 'Working Hours', data: [48, 44, 42, 40, 38, 35], color: '#673AB7' }
      ]
    }
  },
  {
    id: 7,
    type: 'bar-chart',
    title: 'Tourism Revenue',
    description: 'The bar chart shows tourism revenue (in billion USD) for five countries in 2010 and 2020.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['France', 'Spain', 'USA', 'Thailand', 'Australia'],
      datasets: [
        { label: '2010', data: [46, 52, 103, 20, 29], color: '#00BCD4' },
        { label: '2020', data: [42, 35, 75, 15, 22], color: '#E91E63' }
      ]
    }
  },
  {
    id: 8,
    type: 'bar-chart',
    title: 'Renewable Energy Sources',
    description: 'The bar chart shows the percentage of electricity generated from renewable sources in four countries.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      labels: ['Norway', 'Brazil', 'Germany', 'USA'],
      datasets: [
        { label: 'Hydropower', data: [95, 65, 4, 7], color: '#03A9F4' },
        { label: 'Wind', data: [2, 8, 25, 10], color: '#8BC34A' },
        { label: 'Solar', data: [0, 2, 10, 4], color: '#FFC107' }
      ]
    }
  },

  // PIE CHARTS (4)
  {
    id: 9,
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
    id: 10,
    type: 'pie-chart',
    title: 'Global Smartphone Market Share',
    description: 'The pie chart shows the market share of smartphone manufacturers worldwide in 2023.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      segments: [
        { label: 'Samsung', value: 22, color: '#1565C0' },
        { label: 'Apple', value: 18, color: '#616161' },
        { label: 'Xiaomi', value: 14, color: '#FF6F00' },
        { label: 'OPPO', value: 10, color: '#00897B' },
        { label: 'Vivo', value: 8, color: '#5E35B1' },
        { label: 'Others', value: 28, color: '#78909C' }
      ]
    }
  },
  {
    id: 11,
    type: 'pie-chart',
    title: 'Causes of Deforestation',
    description: 'The pie chart shows the main causes of deforestation worldwide.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      segments: [
        { label: 'Agriculture', value: 40, color: '#8BC34A' },
        { label: 'Logging', value: 25, color: '#795548' },
        { label: 'Infrastructure', value: 15, color: '#607D8B' },
        { label: 'Mining', value: 10, color: '#FF5722' },
        { label: 'Urbanization', value: 7, color: '#9C27B0' },
        { label: 'Other', value: 3, color: '#BDBDBD' }
      ]
    }
  },
  {
    id: 12,
    type: 'pie-chart',
    title: 'Household Budget',
    description: 'The pie chart shows how an average family in the US spends their monthly income.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      segments: [
        { label: 'Housing', value: 33, color: '#E53935' },
        { label: 'Transportation', value: 17, color: '#1E88E5' },
        { label: 'Food', value: 13, color: '#43A047' },
        { label: 'Insurance', value: 11, color: '#FB8C00' },
        { label: 'Healthcare', value: 8, color: '#8E24AA' },
        { label: 'Entertainment', value: 5, color: '#00ACC1' },
        { label: 'Other', value: 13, color: '#757575' }
      ]
    }
  },

  // PROCESS DIAGRAMS (4)
  {
    id: 13,
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
    id: 14,
    type: 'process',
    title: 'Water Treatment Process',
    description: 'The diagram below shows how drinking water is treated before distribution to homes.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      steps: [
        'Raw water collected from reservoir',
        'Large debris removed by screens',
        'Chemicals added for coagulation',
        'Water settles in sedimentation tank',
        'Water filtered through sand and gravel',
        'Chlorine added for disinfection',
        'pH adjusted if necessary',
        'Clean water stored in tanks',
        'Water distributed to homes'
      ]
    }
  },
  {
    id: 15,
    type: 'process',
    title: 'Paper Recycling Process',
    description: 'The diagram below illustrates the process of recycling paper.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      steps: [
        'Used paper collected from recycling bins',
        'Paper sorted by type and grade',
        'Paper shredded into small pieces',
        'Mixed with water to create pulp',
        'Ink removed through de-inking process',
        'Pulp cleaned and refined',
        'New paper sheets formed',
        'Paper dried and rolled'
      ]
    }
  },
  {
    id: 16,
    type: 'process',
    title: 'Brick Manufacturing',
    description: 'The diagram below shows how bricks are manufactured for construction.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      steps: [
        'Clay extracted from quarry',
        'Clay crushed and ground',
        'Water added to form mixture',
        'Clay shaped into brick molds',
        'Bricks dried for 24-48 hours',
        'Bricks loaded into kiln',
        'Fired at 1000°C for several days',
        'Bricks cooled gradually',
        'Quality inspection and packaging'
      ]
    }
  },

  // MAPS (4)
  {
    id: 17,
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
    id: 18,
    type: 'map',
    title: 'University Campus Changes',
    description: 'The maps show the changes to a university campus between 2000 and 2023.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      before: {
        year: '2000',
        features: ['Main library in center', 'Three academic buildings', 'Large car park in north', 'Sports field in south', 'Single cafeteria', 'Small student accommodation block']
      },
      after: {
        year: '2023',
        features: ['New science complex added', 'Car park converted to green space', 'Underground parking built', 'Indoor sports center replaced field', 'Three new residence halls', 'Second library building added']
      }
    }
  },
  {
    id: 19,
    type: 'map',
    title: 'Coastal Resort Development',
    description: 'The maps show how a coastal area was developed for tourism between 1980 and 2020.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      before: {
        year: '1980',
        features: ['Undeveloped beach', 'Fishing village with 50 houses', 'Dirt road to main highway', 'Mangrove forest along coast', 'Small pier for fishing boats', 'Coconut plantation inland']
      },
      after: {
        year: '2020',
        features: ['Five luxury hotels along beach', 'Marina with 200 boat spaces', 'Paved highway with airport access', 'Golf course replaced plantation', 'Water treatment plant built', 'Mangrove reduced to small area']
      }
    }
  },
  {
    id: 20,
    type: 'map',
    title: 'Industrial Area Transformation',
    description: 'The maps show the transformation of an old industrial area into a mixed-use development.',
    question: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    imageData: {
      before: {
        year: '1995',
        features: ['Large factory complex', 'Railway freight yard', 'Warehouse district', 'Worker housing blocks', 'Polluted canal', 'No green spaces']
      },
      after: {
        year: '2023',
        features: ['Tech company offices', 'Apartment buildings', 'Shopping and entertainment district', 'Canal cleaned and used for boats', 'Central park with walking paths', 'New metro station']
      }
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