import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { api } from '../../services/api';

const CraigslistOffer = ({ onOpenQuote }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zip: '20877',
    window_count: '4-8 windows',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        zip: formData.zip,
        city: 'Gaithersburg',
        source: 'craigslist',
        notes: `[Craigslist Factory Direct Offer] [Windows: ${formData.window_count}] ${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
        utm_source: searchParams.get('utm_source') || 'craigslist',
        utm_medium: searchParams.get('utm_medium') || 'classifieds',
        utm_campaign: searchParams.get('utm_campaign') || 'direct-factory-pricing'
      });

      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please call our direct dispatcher at (800) 555-0199.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-page animate-fade-in">
      {/* Top Bar */}
      <div className="campaign-top-bar" style={{ backgroundColor: '#2e7d32', color: '#fff' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <DollarSign size={16} />
          <span><strong>FACTORY DIRECT PRICING:</strong> Cut out retail showroom markups across the DMV</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="campaign-hero container section">
        <div className="campaign-hero-grid">
          {/* Left Column */}
          <div className="campaign-hero-content">
            <span className="trade-badge">Direct Factory Dispatch • Gaithersburg, MD</span>
            <h1>Custom Window Blinds & Shades Installed — <span style={{ color: '#2e7d32' }}>Factory Direct Pricing</span></h1>
            
            <p className="campaign-hero-desc">
              Why pay retail showroom markups? Get custom-fit roller shades, natural wood blinds, cellular honeycomb, and plantation shutters fabricated directly for your windows with <strong>free professional laser measuring</strong>.
            </p>

            <div className="campaign-perks-list">
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>No Middleman Markup</strong> — Direct factory-to-home savings</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Free In-Home Laser Measuring</strong> — Guaranteed 100% precision fit</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Fast Local DMV Turnaround</strong> — Fabricated & installed in 10–14 days</span>
              </div>
            </div>

            {/* Quick Dispatch Banner */}
            <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', padding: '16px', borderRadius: '8px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontWeight: 'bold' }}>
                <Clock size={18} /> Measuring Technician in Your Area This Week
              </div>
              <p style={{ fontSize: '0.85rem', color: '#1b5e20', margin: '4px 0 0 0' }}>
                Dispatching daily throughout Gaithersburg, Rockville, Bethesda, Potomac, Silver Spring, Germantown, Arlington, McLean, and Fairfax.
              </p>
            </div>
          </div>

          {/* Right Column: Fast Form */}
          <div className="campaign-form-card">
            <div className="campaign-form-header text-center">
              <span className="voucher-pill" style={{ backgroundColor: '#2e7d32', color: '#fff' }}>Factory Direct Rate</span>
              <h3>Get Instant Quote & Schedule</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                Fill out below or call (800) 555-0199 for immediate scheduling.
              </p>
            </div>

            {error && <div className="auth-alert error">{error}</div>}

            {submitted ? (
              <div className="trade-success text-center animate-fade-in">
                <CheckCircle2 size={48} color="#2e7d32" style={{ margin: '0 auto 12px' }} />
                <h3>Request Received!</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                  Thank you, <strong>{formData.name}</strong>. Our local dispatcher will contact you at <strong>{formData.phone}</strong> to confirm your measuring appointment.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <a href="tel:18005550199" className="btn btn-secondary full-width">
                    <Phone size={16} /> Call Dispatcher: (800) 555-0199
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(301) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20877 (Gaithersburg)"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estimated Windows</label>
                    <select
                      value={formData.window_count}
                      onChange={(e) => setFormData({ ...formData, window_count: e.target.value })}
                    >
                      <option value="1-3 windows">1–3 windows</option>
                      <option value="4-8 windows">4–8 windows</option>
                      <option value="9-15 windows">9–15 windows</option>
                      <option value="16+ Whole Home">16+ (Whole Home)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large full-width"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Request Factory Pricing & Measure'} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Transparent Room Bundles */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <span className="trade-badge">Transparent Pricing</span>
          <h2>Popular Whole-Room Packages</h2>
          <p style={{ color: 'var(--color-secondary-text)' }}>All packages include professional laser measuring and master installation.</p>
        </div>

        <div className="trade-perks-grid">
          <div className="trade-perk-card">
            <h3>Living Room Package</h3>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0' }}>
              $399 – $750
            </div>
            <p>3–5 custom light-filtering roller shades or wood blinds installed.</p>
          </div>

          <div className="trade-perk-card" style={{ borderColor: 'var(--color-primary-text)', boxShadow: 'var(--shadow-md)' }}>
            <span className="source-badge" style={{ marginBottom: '8px' }}>Most Popular</span>
            <h3>Master Suite Package</h3>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0', color: 'var(--color-accent-premium)' }}>
              $550 – $980
            </div>
            <p>100% blackout cellular or tailored Roman shades for total privacy and sleep.</p>
          </div>

          <div className="trade-perk-card">
            <h3>Whole-Home Package</h3>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0' }}>
              $1,450 – $2,800
            </div>
            <p>Complete custom fitting for 10–18 windows throughout your residence.</p>
          </div>
        </div>
      </section>

      {/* Mobile Call Sticky */}
      <div className="mobile-sticky-cta">
        <a href="tel:18005550199" className="btn btn-secondary btn-large full-width">
          <Phone size={18} /> Call (800) 555-0199
        </a>
        <button className="btn btn-primary btn-large full-width" onClick={onOpenQuote}>
          Get Factory Quote
        </button>
      </div>
    </div>
  );
};

export default CraigslistOffer;
