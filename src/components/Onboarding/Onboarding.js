import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    examType: '',
    targetBand: '',
    currentLevel: '',
    schedule: '',
    duration: ''
  });

  const examTypeOptions = [
    { value: 'academic', label: 'Academic', desc: 'For university admission, professional registration, or higher education' },
    { value: 'general', label: 'General Training', desc: 'For work experience, migration to English-speaking countries, or secondary education' }
  ];

  const bandOptions = [
    { value: '6.0', label: 'Band 6.0', desc: 'Competent user - Generally good understanding' },
    { value: '6.5', label: 'Band 6.5', desc: 'Good user - Operational command with some inaccuracies' },
    { value: '7.0', label: 'Band 7.0', desc: 'Good user - Operational command of the language' },
    { value: '7.5+', label: 'Band 7.5+', desc: 'Very good user - Handles complex language well' }
  ];

  const levelOptions = [
    { value: 'beginner', label: 'Beginner', desc: 'Just starting IELTS preparation' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Some experience with IELTS' },
    { value: 'advanced', label: 'Advanced', desc: 'Retaking or aiming for higher score' }
  ];

  const scheduleOptions = [
    { value: '3days', label: '3 days/week', desc: 'Light schedule' },
    { value: '5days', label: '5 days/week', desc: 'Regular practice' },
    { value: 'daily', label: 'Every day', desc: 'Intensive preparation' },
    { value: 'flexible', label: 'Flexible', desc: 'Practice when I can' }
  ];

  const durationOptions = [
    { value: '30min', label: '30 minutes', desc: 'Quick sessions' },
    { value: '1hour', label: '1 hour', desc: 'Standard sessions' },
    { value: '2hours', label: '2+ hours', desc: 'Extended practice' },
    { value: 'flexible', label: 'Flexible', desc: 'Varies by day' }
  ];

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authAPI.saveOnboarding(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = (options, field) => {
    return options.map((option) => (
      <div
        key={option.value}
        className={`option-card ${formData[field] === option.value ? 'selected' : ''}`}
        onClick={() => handleSelect(field, option.value)}
      >
        <h3>{option.label}</h3>
        <p>{option.desc}</p>
      </div>
    ));
  };

  const renderExamTypeOptions = () => {
    return examTypeOptions.map((option) => (
      <div
        key={option.value}
        className={`option-card exam-type-card ${formData.examType === option.value ? 'selected' : ''}`}
        onClick={() => handleSelect('examType', option.value)}
      >
        <div className="exam-type-icon">
          {option.value === 'academic' ? '🎓' : '🌍'}
        </div>
        <h3>{option.label}</h3>
        <p>{option.desc}</p>
      </div>
    ));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.examType !== '';
      case 2: return formData.targetBand !== '';
      case 3: return formData.currentLevel !== '';
      case 4: return formData.schedule !== '';
      case 5: return formData.duration !== '';
      default: return false;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="header">
        <h1>
          {step === 1 && 'Choose Your IELTS Type'}
          {step === 2 && 'Target Band Score'}
          {step === 3 && 'Current Level'}
          {step === 4 && 'Study Schedule'}
          {step === 5 && 'Session Duration'}
        </h1>
        <p>
          {step === 1 && 'Which IELTS exam are you preparing for?'}
          {step === 2 && 'What score are you aiming for?'}
          {step === 3 && 'Where are you starting from?'}
          {step === 4 && 'How often will you practice?'}
          {step === 5 && 'How long are your study sessions?'}
        </p>
      </div>

      <div className="progress-dots">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`dot ${step >= i ? 'active' : ''}`}></div>
        ))}
      </div>

      <div className="card">
        {step === 1 && renderExamTypeOptions()}
        {step === 2 && renderOptions(bandOptions, 'targetBand')}
        {step === 3 && renderOptions(levelOptions, 'currentLevel')}
        {step === 4 && renderOptions(scheduleOptions, 'schedule')}
        {step === 5 && renderOptions(durationOptions, 'duration')}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          
          {step < 5 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
            >
              {loading ? 'Saving...' : 'Start Learning 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
