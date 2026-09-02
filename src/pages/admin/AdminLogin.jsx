import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Default development key is admin123! or custom
    if (adminKey.trim().length > 0) {
      sessionStorage.setItem('lumina_admin_key', adminKey.trim());
      localStorage.setItem('lumina_admin_key', adminKey.trim());
      navigate('/admin');
    } else {
      setError('Please enter the administrative access key.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in container section">
      <div className="auth-card" style={{ maxWidth: '420px', borderTop: '4px solid var(--color-primary-text)' }}>
        <div className="auth-header text-center">
          <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--color-secondary-bg)', borderRadius: '50%', marginBottom: '12px' }}>
            <Shield size={32} color="var(--color-primary-text)" />
          </div>
          <h1>Lumina Admin CRM</h1>
          <p className="auth-subtitle">
            Restricted management portal for Gaithersburg HQ dispatch & sales.
          </p>
        </div>

        {error && (
          <div className="auth-alert error animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Admin Access Key</label>
            <div className="input-icon-wrap">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                autoFocus
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
              Default development key: <code>admin123!</code>
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large full-width"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Admin Hub'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
