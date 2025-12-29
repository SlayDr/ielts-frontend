import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

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

  const testimonials = [
    {
      name: 'Sarah M.',
      score: 'Band 7.5',
      text: 'The AI feedback helped me identify exactly where I was losing marks in Writing Task 2. Improved from 6.0 to 7.5 in just 6 weeks!',
      country: '🇮🇳 India'
    },
    {
      name: 'Ahmed K.',
      score: 'Band 8.0',
      text: 'The speaking practice with instant feedback was a game-changer. I could practice anytime without needing a tutor.',
      country: '🇪🇬 Egypt'
    },
    {
      name: 'Li Wei',
      score: 'Band 7.0',
      text: 'Finally achieved my target score for university admission. The target band tracking kept me motivated throughout.',
      country: '🇨🇳 China'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">🎓 IELTS Master</div>
        <div className="nav-buttons">
          <button className="nav-login" onClick={() => navigate('/login')}>Login</button>
          <button className="nav-signup" onClick={() => navigate('/signup')}>Sign Up Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
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
        <div className="hero-image">
          <div className="hero-mockup">
            <div className="mockup-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
            </div>
            <div className="mockup-content">
              <div className="mockup-score">Band 7.5</div>
              <div className="mockup-bars">
                <div className="mockup-bar" style={{width: '85%'}}></div>
                <div className="mockup-bar" style={{width: '75%'}}></div>
                <div className="mockup-bar" style={{width: '80%'}}></div>
                <div className="mockup-bar" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Everything You Need to Succeed</h2>
        <p className="section-subtitle">Comprehensive preparation for all four IELTS modules</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up & Set Goals</h3>
            <p>Create your account, choose Academic or General Training, and set your target band score.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Practice Daily</h3>
            <p>Complete writing tasks, speaking exercises, reading passages, and listening sections.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get AI Feedback</h3>
            <p>Receive instant band scores and detailed advice on how to improve.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track & Achieve</h3>
            <p>Monitor your progress and reach your target band score.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Success Stories</h2>
        <p className="section-subtitle">Join thousands of students who achieved their target scores</p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.name[0]}</div>
                <div className="testimonial-info">
                  <span className="testimonial-name">{testimonial.name}</span>
                  <span className="testimonial-country">{testimonial.country}</span>
                </div>
                <span className="testimonial-score">{testimonial.score}</span>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <h2>Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Start free, upgrade when you're ready</p>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
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
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Achieve Your Target Band Score?</h2>
        <p>Join thousands of students preparing smarter with AI-powered feedback.</p>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          Start Practicing Free Today
        </button>
        <p className="cta-note">No credit card required • Cancel anytime</p>
      </section>

      {/* Footer */}
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
              <a onClick={() => navigate('/login')}>Login</a>
              <a onClick={() => navigate('/signup')}>Sign Up</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:support@ieltsmaster.com">support@ieltsmaster.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 IELTS Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;