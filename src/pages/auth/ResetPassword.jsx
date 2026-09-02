import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Lock, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';

const ResetPassword = () => {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = paramToken || searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const activeToken = token || customToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!activeToken) {
      setError('Password reset token is missing. Please check your reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.resetPassword(activeToken, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.error || 'Failed to reset password. Link may be expired.');
      }
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
          <h1>Set New Password</h1>
          <p className="auth-subtitle">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="auth-alert error animate-fade-in">
            {error}
          </div>
        )}

        {success ? (
          <div className="trade-success animate-fade-in text-center">
            <CheckCircle2 size={48} color="#2e7d32" style={{ margin: '0 auto var(--spacing-4)' }} />
            <h3>Password Updated!</h3>
            <p style={{ color: 'var(--color-secondary-text)' }}>
              Your password has been changed. Redirecting to sign in...
            </p>
            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <Link to="/login" className="btn btn-primary">
                Sign In Now
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>New Password (min 6 characters)</label>
              <div className="input-icon-wrap">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-icon-wrap">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large full-width"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
