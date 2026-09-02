import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Star, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Tag 
} from 'lucide-react';
import { api } from '../../services/api';

const FacebookOffer = ({ onOpenQuote }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zip: '20877',
    window_count: '4-8 windows',
    room_type: 'Living Room',
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
        source: 'facebook',
        notes: `[Meta Promo: 20% OFF] [Windows: ${formData.window_count}] [Room: ${formData.room_type}] ${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
        utm_source: searchParams.get('utm_source') || 'facebook',
        utm_medium: searchParams.get('utm_medium') || 'paid_social',
        utm_campaign: searchParams.get('utm_campaign') || 'dmv-spring-promo-20'
      });

      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again or call us at (800) 555-0199.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-page animate-fade-in">
      {/* Top Urgency Promotional Header */}
      <div className="campaign-top-bar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Tag size={16} />
          <span><strong>EXCLUSIVE DMV SPECIAL:</strong> 20% Off All Custom Treatments + Free In-Home Measure (Code: <code>DMV20</code>)</span>
        </div>
      </div>

      {/* Hero Section with Dual Columns */}
      <section className="campaign-hero container section">
        <div className="campaign-hero-grid">
          {/* Left Column: Value Proposition */}
          <div className="campaign-hero-content">
            <span className="trade-badge">Montgomery County, DC & Northern VA</span>
            <h1>Upgrade Your Home With Custom Window Treatments — <span style={{ color: 'var(--color-accent-primary)' }}>20% Off This Month</span></h1>
            
            <p className="campaign-hero-desc">
              Skip the DIY frustration and ill-fitting store blinds. Our certified DMV design specialists bring fabric sample books and laser tools directly to your windows.
            </p>

            <div className="campaign-perks-list">
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>100% Perfect Fit Guarantee</strong> — Precision laser measured to 1/16"</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Turnkey White-Glove Installation</strong> — We mount hardware and clean up</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Certified Child-Safe & Cordless</strong> — Safe for kids and pets</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Limited Lifetime Craftsmanship Warranty</strong> on motors & mechanisms</span>
              </div>
            </div>

            <div className="campaign-social-proof">
              <div className="stars" style={{ display: 'flex', color: '#D4AF37' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p>Rated <strong>5.0 / 5.0</strong> by 120+ homeowners across Bethesda, Potomac, Rockville, and Northern VA</p>
            </div>
          </div>

          {/* Right Column: High-Converting Lead Form */}
          <div className="campaign-form-card">
            <div className="campaign-form-header text-center">
              <span className="voucher-pill">Claim 20% Off Voucher</span>
              <h3>Schedule Free In-Home Consultation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                No obligation. Exact laser pricing guaranteed for 30 days.
              </p>
            </div>

            {error && <div className="auth-alert error">{error}</div>}

            {submitted ? (
              <div className="trade-success text-center animate-fade-in">
                <CheckCircle2 size={48} color="#2e7d32" style={{ margin: '0 auto 12px' }} />
                <h3>Voucher Claimed!</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                  Thank you, <strong>{formData.name}</strong>! Your 20% discount code <code>DMV20</code> has been applied. A local specialist will call you at <strong>{formData.phone}</strong> to confirm your measuring time.
                </p>
                <div style={{ marginTop: '20px' }}>
                  <a href="tel:18005550199" className="btn btn-secondary full-width">
                    <Phone size={16} /> Need Faster Service? Call (800) 555-0199
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
                    <label>Approx. Windows</label>
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
                  {loading ? 'Securing 20% Voucher...' : 'Claim 20% Off & Book Free Measure'} <ArrowRight size={18} />
                </button>

                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', textAlign: 'center', margin: 0 }}>
                  🔒 We respect your privacy. No spam. Zero high-pressure sales tactics.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Before & After Real Transformations */}
      <section className="section container" style={{ backgroundColor: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-12) var(--spacing-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <span className="trade-badge">Real DMV Homes</span>
          <h2>Recent Before & After Transformations</h2>
          <p style={{ color: 'var(--color-secondary-text)' }}>See how custom shades elevate privacy, daylight diffusion, and home equity.</p>
        </div>

        <div className="lookbook-grid">
          <div className="lookbook-card">
            <div className="lookbook-image-wrap">
              <img src="/images/cat-roller.jpg" alt="Living Room Roller Shades Bethesda" className="lookbook-image" />
              <span className="lookbook-room-tag">Bethesda, MD • Roller Shades</span>
            </div>
            <div className="lookbook-info">
              <h3>Light-Filtering Solar Shades</h3>
              <p className="lookbook-desc">Eliminated harsh afternoon glare while preserving scenic tree views.</p>
            </div>
          </div>

          <div className="lookbook-card">
            <div className="lookbook-image-wrap">
              <img src="/images/cat-roman.jpg" alt="Potomac MD Roman Drapery" className="lookbook-image" />
              <span className="lookbook-room-tag">Potomac, MD • Tailored Roman</span>
            </div>
            <div className="lookbook-info">
              <h3>Custom Linen Roman Drapery</h3>
              <p className="lookbook-desc">Added luxurious texture and acoustic softening to primary master suite.</p>
            </div>
          </div>

          <div className="lookbook-card">
            <div className="lookbook-image-wrap">
              <img src="/images/cat-wood.jpg" alt="Rockville MD Hardwood Blinds" className="lookbook-image" />
              <span className="lookbook-room-tag">Rockville, MD • Hardwood Blinds</span>
            </div>
            <div className="lookbook-info">
              <h3>2.5" Natural Hardwood Blinds</h3>
              <p className="lookbook-desc">Precision fitted into deep colonial window jambs with cordless controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local DMV Customer Reviews */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
          <h2>What Your DMV Neighbors Are Saying</h2>
        </div>

        <div className="trade-perks-grid">
          <div className="trade-perk-card text-left" style={{ alignItems: 'flex-start' }}>
            <div className="stars" style={{ display: 'flex', color: '#D4AF37', marginBottom: '8px' }}>
              <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--color-primary-text)' }}>
              "Marcus measured 12 windows in our Bethesda colonial in 30 minutes. The shades arrived ahead of schedule and the fit is 100% flawless. Couldn't recommend them more!"
            </p>
            <strong style={{ marginTop: '12px', fontSize: '0.9rem' }}>— Jennifer L., Bethesda, MD</strong>
          </div>

          <div className="trade-perk-card text-left" style={{ alignItems: 'flex-start' }}>
            <div className="stars" style={{ display: 'flex', color: '#D4AF37', marginBottom: '8px' }}>
              <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--color-primary-text)' }}>
              "Motorized PowerView shades in our 2-story living room are incredible. Automated to close at sunset. Best home investment we've made."
            </p>
            <strong style={{ marginTop: '12px', fontSize: '0.9rem' }}>— Robert M., Potomac, MD</strong>
          </div>

          <div className="trade-perk-card text-left" style={{ alignItems: 'flex-start' }}>
            <div className="stars" style={{ display: 'flex', color: '#D4AF37', marginBottom: '8px' }}>
              <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--color-primary-text)' }}>
              "The 20% discount made them cheaper than Home Depot's custom quote, and the service was 10x better because Lumina handles everything from start to finish."
            </p>
            <strong style={{ marginTop: '12px', fontSize: '0.9rem' }}>— David S., Arlington, VA</strong>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Call Bar */}
      <div className="mobile-sticky-cta">
        <a href="tel:18005550199" className="btn btn-secondary btn-large full-width">
          <Phone size={18} /> Call (800) 555-0199
        </a>
        <button className="btn btn-primary btn-large full-width" onClick={onOpenQuote}>
          Book 20% Off Measure
        </button>
      </div>
    </div>
  );
};

export default FacebookOffer;
