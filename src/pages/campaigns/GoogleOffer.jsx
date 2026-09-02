import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Check, 
  X, 
  Star, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Award 
} from 'lucide-react';
import { api } from '../../services/api';

const GoogleOffer = ({ onOpenQuote }) => {
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
        source: 'google',
        notes: `[Google Search Ad: $150 VOUCHER] [Windows: ${formData.window_count}] ${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
        utm_source: searchParams.get('utm_source') || 'google',
        utm_medium: searchParams.get('utm_medium') || 'cpc',
        utm_campaign: searchParams.get('utm_campaign') || 'dmv-search-high-intent',
        utm_term: searchParams.get('utm_term') || 'custom blinds gaithersburg'
      });

      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-page animate-fade-in">
      {/* Promotional Banner */}
      <div className="campaign-top-bar" style={{ backgroundColor: 'var(--color-primary-text)', color: 'var(--color-white)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Award size={16} color="#D4AF37" />
          <span><strong>GAITHERSBURG & DMV SPECIAL:</strong> Claim a $150 Instant Project Voucher (Code: <code>GOOGLE150</code>)</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="campaign-hero container section">
        <div className="campaign-hero-grid">
          {/* Content */}
          <div className="campaign-hero-content">
            <span className="trade-badge">Local Gaithersburg, MD Business</span>
            <h1>#1 Rated In-Home Custom Window Treatments in the DMV Area</h1>
            <p className="campaign-hero-desc">
              White-glove laser measurement, bespoke fabrication, and flawless master installation. We do the work—you enjoy the results.
            </p>

            <div className="campaign-perks-list">
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Free In-Home Laser Measuring</strong> — 100% Fit Guarantee</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Turnkey White-Glove Installation</strong> included in every estimate</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Top Brands & Custom Lines</strong> — Hunter Douglas, Norman, Somfy motorization</span>
              </div>
            </div>

            <div className="campaign-social-proof">
              <div className="stars" style={{ display: 'flex', color: '#D4AF37' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p>Top Rated 5-Star Local Business on Google Reviews across Montgomery & Fairfax County</p>
            </div>
          </div>

          {/* Form */}
          <div className="campaign-form-card">
            <div className="campaign-form-header text-center">
              <span className="voucher-pill" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>$150 Instant Voucher</span>
              <h3>Get an Instant Price Estimate</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                Our Gaithersburg specialist will prepare your itemized quote.
              </p>
            </div>

            {error && <div className="auth-alert error">{error}</div>}

            {submitted ? (
              <div className="trade-success text-center animate-fade-in">
                <CheckCircle2 size={48} color="#2e7d32" style={{ margin: '0 auto 12px' }} />
                <h3>$150 Voucher Applied!</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                  Thank you, <strong>{formData.name}</strong>! Your voucher has been registered. Our measurement specialist will contact you at <strong>{formData.phone}</strong>.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <a href="tel:18005550199" className="btn btn-secondary full-width">
                    <Phone size={16} /> Direct Dispatch: (800) 555-0199
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
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
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>DMV ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="20877"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Window Count</label>
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
                  {loading ? 'Submitting...' : 'Claim $150 Voucher & Book Free Visit'} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Competitor Comparison Table */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <span className="trade-badge">Why Choose Lumina</span>
          <h2>How We Compare to Big Box Stores & DIY Websites</h2>
          <p style={{ color: 'var(--color-secondary-text)', maxWidth: '640px', margin: '0 auto' }}>
            Don't get stuck with mismeasured DIY blinds or third-party big-box contractors who don't stand behind their work.
          </p>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Feature</th>
                <th style={{ backgroundColor: '#f0ede6', color: 'var(--color-primary-text)', fontWeight: 'bold' }}>Lumina Window Treatments</th>
                <th>Big Box Stores (Home Depot/Lowe's)</th>
                <th>Online DIY Sites (SelectBlinds/Blinds.com)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>In-Home Measurement</strong></td>
                <td style={{ backgroundColor: '#f9fdfa', color: '#2e7d32', fontWeight: 'bold' }}>
                  <Check size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Free Laser Precision
                </td>
                <td>Extra $50–$100 fee</td>
                <td><X size={16} color="#c81e1e" style={{ display: 'inline', verticalAlign: 'middle' }} /> DIY (You Measure)</td>
              </tr>
              <tr>
                <td><strong>100% Fit Guarantee</strong></td>
                <td style={{ backgroundColor: '#f9fdfa', color: '#2e7d32', fontWeight: 'bold' }}>
                  <Check size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Guaranteed Fit (Zero Risk)
                </td>
                <td>Limited / Restocking fees</td>
                <td><X size={16} color="#c81e1e" style={{ display: 'inline', verticalAlign: 'middle' }} /> If you mismeasure, you pay</td>
              </tr>
              <tr>
                <td><strong>Professional Installation</strong></td>
                <td style={{ backgroundColor: '#f9fdfa', color: '#2e7d32', fontWeight: 'bold' }}>
                  <Check size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> White-Glove In-House Master Techs
                </td>
                <td>Unvetted Subcontractors</td>
                <td><X size={16} color="#c81e1e" style={{ display: 'inline', verticalAlign: 'middle' }} /> DIY (You Drill & Mount)</td>
              </tr>
              <tr>
                <td><strong>Warranty & Support</strong></td>
                <td style={{ backgroundColor: '#f9fdfa', color: '#2e7d32', fontWeight: 'bold' }}>
                  <Check size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Limited Lifetime Craftsmanship
                </td>
                <td>1-Year Standard</td>
                <td>Manufacturer return hoops</td>
              </tr>
              <tr>
                <td><strong>Fabric Swatches at Home</strong></td>
                <td style={{ backgroundColor: '#f9fdfa', color: '#2e7d32', fontWeight: 'bold' }}>
                  <Check size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Full Designer Sample Books
                </td>
                <td>Small store displays</td>
                <td>Slow mail orders</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Simple 3-Step Process */}
      <section className="section container" style={{ backgroundColor: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <h2>How It Works: Effortless 3-Step Process</h2>
        </div>
        <div className="services-pillar-grid">
          <div className="service-pillar-card">
            <span className="service-step-tag">Step 1</span>
            <h2>We Measure & Design</h2>
            <p>Our licensed technician visits your DMV home with laser measuring tools and sample fabric decks.</p>
          </div>
          <div className="service-pillar-card">
            <span className="service-step-tag">Step 2</span>
            <h2>Custom Fabrication</h2>
            <p>Your treatments are precision-machined to exact 1/16" specs using premium materials and cordless motors.</p>
          </div>
          <div className="service-pillar-card">
            <span className="service-step-tag">Step 3</span>
            <h2>Master Installation</h2>
            <p>We arrive, mount all hardware, test tensions and smart automations, and leave your rooms spotless.</p>
          </div>
        </div>
      </section>

      {/* Mobile Call Sticky */}
      <div className="mobile-sticky-cta">
        <a href="tel:18005550199" className="btn btn-secondary btn-large full-width">
          <Phone size={18} /> Call (800) 555-0199
        </a>
        <button className="btn btn-primary btn-large full-width" onClick={onOpenQuote}>
          Claim $150 Voucher
        </button>
      </div>
    </div>
  );
};

export default GoogleOffer;
