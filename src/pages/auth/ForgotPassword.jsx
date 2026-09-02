import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in container section">
      <div className="auth-card">
        <div className="auth-header text-center">
          <span className="trade-badge">Security</span>
          <h1>Reset Password</h1>
          <p className="auth-subtitle">
            Enter your account email address and we will dispatch a secure reset link.
          </p>
        </div>

        {error && (
          <div className="auth-alert error animate-fade-in">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="trade-success animate-fade-in text-center">
            <CheckCircle2 size={48} color="#2e7d32" style={{ margin: '0 auto var(--spacing-4)' }} />
            <h3>Check Your Email</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.95rem' }}>
              We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folders.
            </p>
            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <Link to="/login" className="btn btn-primary">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large full-width"
              disabled={loading}
            >
              {loading ? 'Dispatching Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer-text text-center" style={{ marginTop: 'var(--spacing-6)' }}>
          <Link to="/login" className="auth-link-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
