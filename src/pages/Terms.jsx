import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <nav className="legal-nav">
        <div className="nav-logo" onClick={() => navigate('/')}>🎓 IELTS Master</div>
        <button className="nav-back" onClick={() => navigate(-1)}>← Back</button>
      </nav>

      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: December 28, 2024</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using IELTS Master ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            IELTS Master is an online platform that provides IELTS exam preparation tools, including:
          </p>
          <ul>
            <li>Writing practice with AI-powered feedback</li>
            <li>Speaking practice with speech recognition and evaluation</li>
            <li>Reading comprehension exercises</li>
            <li>Listening practice sections</li>
            <li>Progress tracking and analytics</li>
          </ul>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            To access certain features, you must create an account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete registration information</li>
            <li>Notifying us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section>
          <h2>4. Subscription and Payments</h2>
          <p>
            <strong>Free Tier:</strong> Users can access limited features at no cost, including 3 AI evaluations per day 
            and access to a subset of practice materials.
          </p>
          <p>
            <strong>Premium Subscription:</strong> Paid subscribers receive unlimited access to all features. 
            Subscriptions are billed monthly or annually depending on your selected plan.
          </p>
          <p>
            <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. 
            Cancellation takes effect at the end of your current billing period. No refunds are provided for partial billing periods.
          </p>
          <p>
            <strong>Price Changes:</strong> We reserve the right to modify subscription prices with 30 days notice. 
            Price changes will not affect your current billing period.
          </p>
        </section>

        <section>
          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Share your account credentials with others</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Reproduce, duplicate, or resell any part of the Service</li>
            <li>Use automated systems or bots to access the Service</li>
            <li>Submit content that is offensive, harmful, or violates others' rights</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content on IELTS Master, including text, graphics, logos, and software, is the property of 
            IELTS Master or its licensors and is protected by copyright and other intellectual property laws.
          </p>
          <p>
            <strong>User Content:</strong> You retain ownership of content you submit (essays, recordings, etc.). 
            By submitting content, you grant us a license to use it for providing and improving our Service.
          </p>
        </section>

        <section>
          <h2>7. AI-Generated Feedback Disclaimer</h2>
          <p>
            Our AI-powered feedback is designed to help you practice and improve. However:
          </p>
          <ul>
            <li>AI scores are estimates and may not exactly match official IELTS scores</li>
            <li>Feedback should be used as a learning tool, not as a guarantee of exam performance</li>
            <li>We recommend supplementing AI feedback with other preparation methods</li>
          </ul>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            IELTS Master is provided "as is" without warranties of any kind. We are not liable for:
          </p>
          <ul>
            <li>Any indirect, incidental, or consequential damages</li>
            <li>Loss of data or service interruptions</li>
            <li>Your actual IELTS exam results</li>
            <li>Any decisions made based on our AI feedback</li>
          </ul>
          <p>
            Our total liability shall not exceed the amount you paid for the Service in the 12 months 
            preceding the claim.
          </p>
        </section>

        <section>
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account at any time for violation of these terms or for any 
            other reason at our discretion. Upon termination, your right to use the Service ceases immediately.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will notify users of significant 
            changes via email or through the Service. Continued use after changes constitutes acceptance 
            of the new terms.
          </p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            These terms are governed by the laws of the United States. Any disputes shall be resolved 
            in the courts of [Your State/Jurisdiction].
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <p><strong>Email:</strong> support@ieltsmaster.com</p>
        </section>
      </div>

      <footer className="legal-footer">
        <p>© 2025 IELTS Master. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Terms;