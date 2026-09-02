import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  ArrowRight 
} from 'lucide-react';
import { CITIES_DATA } from './cityData';
import { api } from '../../services/api';
import SEOHead, { generateLocalBusinessSchema } from '../../components/seo/SEOHead';

const CityPage = ({ onOpenQuote }) => {
  const { citySlug } = useParams();
  const city = CITIES_DATA[citySlug] || CITIES_DATA['gaithersburg-md'];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zip: city.zipCodes[0] || '20877',
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
        city: city.name,
        source: 'local_seo',
        notes: `[City Page: ${city.name}, ${city.state}] [Windows: ${formData.window_count}] [Room: ${formData.room_type}] ${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
        utm_source: 'organic_local',
        utm_medium: 'seo_city_page',
        utm_campaign: `local-${city.slug}`
      });

      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again or call us at (800) 555-0199.');
    } finally {
      setLoading(false);
    }
  };

  const allCities = Object.values(CITIES_DATA);

  return (
    <div className="city-landing-page animate-fade-in">
      <SEOHead 
        title={`${city.title} | Lumina Window Treatments`}
        description={`Professional custom blinds, motorized shades, and shutters in ${city.name}, ${city.state}. Free in-home laser measurement and 100% Fit Guarantee.`}
        canonical={`/locations/${city.slug}`}
        ogImage={city.heroImage}
        schema={generateLocalBusinessSchema()}
      />
      {/* Top Banner */}
      <div className="campaign-top-bar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MapPin size={16} />
          <span><strong>LOCAL SERVICE AREA:</strong> Free In-Home Laser Measuring Daily Throughout {city.name}, {city.state}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="campaign-hero container section">
        <div className="campaign-hero-grid">
          {/* Content */}
          <div className="campaign-hero-content">
            <span className="trade-badge">{city.tagline}</span>
            <h1>{city.title}</h1>
            <p className="campaign-hero-desc">{city.description}</p>

            <div className="campaign-perks-list">
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>100% Guaranteed Fit</strong> — In-home laser verification</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>White-Glove Master Installation</strong> — Clean, insured technicians</span>
              </div>
              <div className="campaign-perk-item">
                <CheckCircle2 size={18} color="#2e7d32" />
                <span><strong>Designer Swatches Brought to You</strong> — Real fabric sample books</span>
              </div>
            </div>

            <div className="campaign-social-proof">
              <div className="stars" style={{ display: 'flex', color: '#D4AF37' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p>Top Rated 5.0 Star Local Service across {city.name} and {city.region}</p>
            </div>
          </div>

          {/* Inline Scheduling Form */}
          <div className="campaign-form-card">
            <div className="campaign-form-header text-center">
              <span className="voucher-pill">Free Local Measure</span>
              <h3>Schedule In-Home Consultation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                Serving all {city.name} neighborhoods ({city.zipCodes.join(', ')}).
              </p>
            </div>

            {error && <div className="auth-alert error">{error}</div>}

            {submitted ? (
              <div className="trade-success text-center animate-fade-in">
                <CheckCircle2 size={48} color="#2e7d32" style={{ margin: '0 auto 12px' }} />
                <h3>Consultation Scheduled!</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                  Thank you, <strong>{formData.name}</strong>. Our local {city.name} specialist will contact you at <strong>{formData.phone}</strong> to confirm your appointment time.
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
                    <label>{city.name} ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder={city.zipCodes[0]}
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
                  {loading ? 'Scheduling...' : `Book Free Measure in ${city.name}`} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Neighborhoods & Architectural Match */}
      <section className="section container" style={{ backgroundColor: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-12) var(--spacing-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <span className="trade-badge">{city.region} Coverage</span>
          <h2>Tailored for {city.name} Homes & Architecture</h2>
          <p style={{ color: 'var(--color-secondary-text)', maxWidth: '640px', margin: '0 auto' }}>
            We specialize in solutions for {city.architecturalStyles}.
          </p>
        </div>

        {/* Neighborhood tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto var(--spacing-12)' }}>
          {city.neighborhoods.map(nh => (
            <span key={nh} style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} color="var(--color-accent-premium)" /> {nh}
            </span>
          ))}
        </div>

        {/* Local Verified Review */}
        <div className="guarantee-section" style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--spacing-8)', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)' }}>
          <div className="stars" style={{ display: 'flex', color: '#D4AF37', marginBottom: '8px' }}>
            <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
          </div>
          <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--color-primary-text)', lineHeight: 1.6 }}>
            "{city.localReview.quote}"
          </p>
          <strong style={{ display: 'block', marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-accent-premium)' }}>
            — {city.localReview.author} ({city.localReview.neighborhood})
          </strong>
        </div>
      </section>

      {/* Popular Products in City */}
      <section className="section container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <h2>Popular Treatments Installed in {city.name}</h2>
        </div>
        <div className="catalog-grid">
          <div className="product-card">
            <div className="product-card-image-wrap">
              <img src="/images/cat-roller.jpg" alt="Custom Roller Shades" className="product-card-image" />
            </div>
            <div className="product-card-body">
              <h3 className="product-card-title"><Link to="/products/roller-shades">Custom Roller Shades</Link></h3>
              <p className="product-card-desc">Clean minimalist light filtering and blackout fabrics for {city.name} modern residences.</p>
              <div className="product-card-footer">
                <span className="price-value">$89</span>
                <Link to="/products/roller-shades" className="btn btn-secondary btn-sm">Customize</Link>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="product-card-image-wrap">
              <img src="/images/cat-roman.jpg" alt="Tailored Roman Shades" className="product-card-image" />
            </div>
            <div className="product-card-body">
              <h3 className="product-card-title"><Link to="/products/roman-shades">Tailored Roman Shades</Link></h3>
              <p className="product-card-desc">Linen and textured drapery folds that add classic warmth to {city.name} living spaces.</p>
              <div className="product-card-footer">
                <span className="price-value">$120</span>
                <Link to="/products/roman-shades" className="btn btn-secondary btn-sm">Customize</Link>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="product-card-image-wrap">
              <img src="/images/hero-living-room.jpg" alt="Smart Motorized PowerView" className="product-card-image" />
            </div>
            <div className="product-card-body">
              <h3 className="product-card-title"><Link to="/products/hunter-douglas-powerview-motorized">Smart Motorized Shades</Link></h3>
              <p className="product-card-desc">Automated light control with Matter, Alexa, and Apple HomeKit smart home pairing.</p>
              <div className="product-card-footer">
                <span className="price-value">$350</span>
                <Link to="/products/hunter-douglas-powerview-motorized" className="btn btn-secondary btn-sm">Customize</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-City Internal Linking Grid */}
      <section className="section container" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-12)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>Explore Our Other DMV Service Locations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {allCities.map(c => (
            <Link 
              key={c.slug} 
              to={`/locations/${c.slug}`}
              className="btn btn-secondary btn-sm"
              style={{ textAlign: 'center', display: 'block', backgroundColor: c.slug === city.slug ? 'var(--color-primary-text)' : undefined, color: c.slug === city.slug ? 'var(--color-white)' : undefined }}
            >
              {c.name}, {c.state}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CityPage;
