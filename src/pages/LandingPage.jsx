import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'IELTS Master - AI-Powered IELTS Preparation | Get Band 7+ with Smart Practice';
  }, []);

  const features = [
    {
      icon: '✍️',
      title: 'Writing Practice',
      description: 'Task 1 & Task 2 with AI-powered feedback and band scores'
    },
    {
      icon: '🎤',
      title: 'Speaking Practice',
      description: 'Record responses, get instant AI evaluation and model answers'
    },
    {
      icon: '📖',
      title: 'Reading Practice',
      description: 'Academic & General Training passages with varied question types'
    },
    {
      icon: '🎧',
      title: 'Listening Practice',
      description: 'Audio sections with comprehension questions and instant scoring'
    },
    {
      icon: '🎯',
      title: 'Target Band Tracking',
      description: 'Set your goal and track progress across all skills'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Feedback',
      description: 'Get detailed feedback tailored to reach your target band score'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '3 AI evaluations per day',
        '5 Reading passages',
        '5 Listening sections',
        '5 Writing prompts',
        'Speaking Part 1 only',
        'Basic progress tracking'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      yearlyPrice: '$79.99/year (Save 33%)',
      features: [
        'Unlimited AI evaluations',
        'All 40+ Reading passages',
        'All 20+ Listening sections',
        'All Writing prompts',
        'All Speaking Parts (1, 2 & 3)',
        'Detailed model answers',
        'Target band advice',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true
    }
  ];

  const faqs = [
    {
      question: 'How does the AI feedback work?',
      answer: 'Our AI evaluates your writing and speaking responses using official IELTS criteria. You get band scores for each criterion plus specific advice on how to improve and reach your target score.'
    },
    {
      question: 'Is this suitable for both Academic and General Training?',
      answer: 'Yes! When you sign up, you choose your exam type. The app then shows you relevant content - academic passages for Academic test takers, and practical texts like letters and notices for General Training.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely. You can cancel your Premium subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period.'
    },
    {
      question: 'How accurate is the AI scoring?',
      answer: 'Our AI is trained on official IELTS scoring criteria and provides scores that closely align with real IELTS results. However, we recommend using it as a practice tool alongside other preparation methods.'
    },
    {
      question: 'Do I need any special equipment?',
      answer: 'Just a device with a web browser! For speaking practice, you\'ll need a microphone (built-in laptop/phone mics work great). For listening practice, you\'ll need speakers or headphones.'
    }
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <div className="nav-logo">🎓 IELTS Master</div>
        <div className="nav-buttons">
          <button className="nav-login" onClick={() => navigate('/login')}>Login</button>
          <button className="nav-signup" onClick={() => navigate('/signup')}>Sign Up Free</button>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1>Ace Your IELTS Exam with AI-Powered Practice</h1>
          <p className="hero-subtitle">
            Get instant feedback on Writing & Speaking, practice with real exam-style questions, 
            and track your progress toward your target band score.
          </p>
          <div className="hero-buttons">
            <button className="hero-cta-primary" onClick={() => navigate('/signup')}>
              Start Practicing Free
            </button>
            <button className="hero-cta-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              See Features
            </button>
          </div>
          <p className="hero-note">✓ No credit card required ✓ 3 free AI evaluations daily</p>
        </div>
        <div className="hero-image" aria-hidden="true">
          <div className="hero-mockup">
            <div className="mockup-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
            </div>
            <div className="mockup-content">
              <div className="mockup-score">Band 7.5+</div>
              <div className="mockup-bars">
                <div className="mockup-bar" style={{width: '85%'}}></div>
                <div className="mockup-bar" style={{width: '75%'}}></div>
                <div className="mockup-bar" style={{width: '80%'}}></div>
                <div className="mockup-bar" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <h2>Everything You Need to Succeed in IELTS</h2>
        <p className="section-subtitle">Comprehensive preparation for all four IELTS modules</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <article key={index} className="feature-card">
              <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>How IELTS Master Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up & Set Goals</h3>
            <p>Create your account, choose Academic or General Training, and set your target band score.</p>
          </div>
          <div className="step-arrow" aria-hidden="true">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Practice Daily</h3>
            <p>Complete writing tasks, speaking exercises, reading passages, and listening sections.</p>
          </div>
          <div className="step-arrow" aria-hidden="true">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get AI Feedback</h3>
            <p>Receive instant band scores and detailed advice on how to improve.</p>
          </div>
          <div className="step-arrow" aria-hidden="true">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track & Achieve</h3>
            <p>Monitor your progress and reach your target band score.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Join Thousands of IELTS Achievers</h2>
        <p className="section-subtitle">Students from Nigeria, India, Pakistan, Philippines and 50+ countries trust IELTS Master</p>
        <div className="testimonials-placeholder">
          <div className="placeholder-icon">🌟</div>
          <h3>Be One of Our First Success Stories!</h3>
          <p>We're just getting started. Achieve your target band score and inspire others on their IELTS journey.</p>
          <button className="placeholder-cta" onClick={() => navigate('/signup')}>
            Start Your Journey
          </button>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <h2>Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Start free, upgrade when you're ready</p>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <article key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="popular-badge">Most Popular</span>}
              <h3>{plan.name}</h3>
              <div className="pricing-amount">
                <span className="price">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>
              {plan.yearlyPrice && <p className="yearly-option">{plan.yearlyPrice}</p>}
              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                className={`pricing-cta ${plan.popular ? 'primary' : 'secondary'}`}
                onClick={() => navigate('/signup')}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <article key={index} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Achieve Your Target Band Score?</h2>
        <p>Join thousands of students preparing smarter with AI-powered feedback.</p>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          Start Practicing Free Today
        </button>
        <p className="cta-note">No credit card required • Cancel anytime</p>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🎓 IELTS Master</h3>
            <p>AI-powered IELTS preparation for Academic & General Training</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
              <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign Up</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:support@ielts-masters.com">support@ielts-masters.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} IELTS Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;