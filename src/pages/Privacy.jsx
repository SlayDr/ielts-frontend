import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <nav className="legal-nav">
        <div className="nav-logo" onClick={() => navigate('/')}>🎓 IELTS Master</div>
        <button className="nav-back" onClick={() => navigate(-1)}>← Back</button>
      </nav>

      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: December 28, 2024</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            IELTS Master ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password when you register</li>
            <li><strong>Profile Information:</strong> Target band score, exam type (Academic/General), study preferences</li>
            <li><strong>Practice Content:</strong> Essays, speaking recordings, and answers you submit</li>
            <li><strong>Payment Information:</strong> Processed securely by Stripe; we do not store credit card numbers</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
            <li><strong>Log Data:</strong> IP address, access times, error logs</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our Service</li>
            <li>Process your AI evaluations and generate feedback</li>
            <li>Track your progress and display analytics</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service updates and notifications</li>
            <li>Improve our AI models and Service quality</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal data. We may share information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third parties that help us operate our Service (e.g., Stripe for payments, cloud hosting providers)</li>
            <li><strong>AI Processing:</strong> Your practice content is sent to AI providers (OpenAI, Anthropic) for evaluation; this data is not used to train their models</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your data, including:
          </p>
          <ul>
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Secure password hashing</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee 
            absolute security of your data.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>We retain your data as follows:</p>
          <ul>
            <li><strong>Account Data:</strong> Until you delete your account</li>
            <li><strong>Practice History:</strong> Until you delete your account or request deletion</li>
            <li><strong>Payment Records:</strong> As required by law (typically 7 years)</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data</li>
            <li><strong>Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Objection:</strong> Object to certain processing of your data</li>
            <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us at support@ieltsmaster.com.
          </p>
        </section>

        <section>
          <h2>8. Cookies and Tracking</h2>
          <p>We use essential cookies to:</p>
          <ul>
            <li>Keep you logged in</li>
            <li>Remember your preferences</li>
            <li>Ensure security</li>
          </ul>
          <p>
            We may use analytics cookies to understand how users interact with our Service. 
            You can disable cookies in your browser settings, but this may affect functionality.
          </p>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you believe we have collected such information, 
            please contact us immediately.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place for such transfers in compliance with 
            applicable data protection laws.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes via email or through the Service. The "Last updated" date at the top indicates 
            when the policy was last revised.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, 
            please contact us at:
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

export default Privacy;