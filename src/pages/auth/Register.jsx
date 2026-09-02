import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    zip: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        zip: formData.zip
      });

      if (res.success) {
        setSuccessMsg('Account created successfully! Check your email to verify your address.');
        setTimeout(() => {
          navigate('/account');
        }, 1500);
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in container section">
      <div className="auth-card" style={{ maxWidth: '580px' }}>
        <div className="auth-header text-center">
          <span className="trade-badge">Join Lumina</span>
          <h1>Create your customer account</h1>
          <p className="auth-subtitle">
            Access transparent project estimates, order timelines, and dedicated designer support.
          </p>
        </div>

        {error && (
          <div className="auth-alert error animate-fade-in">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#2e7d32" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <div className="input-icon-wrap">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder="Jane"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <div className="input-icon-wrap">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="last_name"
                  required
                  placeholder="Smith"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <div className="input-icon-wrap">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <div className="input-icon-wrap">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="(301) 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password (min 6 chars) *</label>
              <div className="input-icon-wrap">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="input-icon-wrap">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>DMV ZIP Code</label>
            <div className="input-icon-wrap">
              <MapPin className="input-icon" size={18} />
              <input
                type="text"
                name="zip"
                placeholder="20877 (Gaithersburg / DMV area)"
                value={formData.zip}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large full-width"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create My Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-text text-center">
          Already have an account?{' '}
          <Link to="/login" className="auth-link-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
