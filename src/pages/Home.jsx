import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Settings, PenTool, Star, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import SEOHead, { generateLocalBusinessSchema } from '../components/seo/SEOHead';

const Home = ({ onOpenQuote }) => {
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 'prod-1',
      slug: 'roller-shades',
      name: 'Custom Roller Shades',
      price_min: 89,
      image: '/images/cat-roller.jpg',
      tag: 'Bestseller',
      desc: 'Clean, minimalist lines with smooth cordless or motorized control.'
    },
    {
      id: 'prod-3',
      slug: 'wood-blinds',
      name: 'Natural Hardwood Blinds',
      price_min: 95,
      image: '/images/cat-wood.jpg',
      tag: '100% Real Hardwood',
      desc: 'Sustainably sourced North American hardwood with rich grain.'
    },
    {
      id: 'prod-5',
      slug: 'cellular-honeycomb-shades',
      name: 'Cellular / Honeycomb Shades',
      price_min: 110,
      image: '/images/cat-cellular.jpg',
      tag: 'Energy Saving',
      desc: 'Insulating honeycomb air pockets reducing heating & cooling bills.'
    },
    {
      id: 'prod-10',
      slug: 'hunter-douglas-powerview-motorized',
      name: 'Smart PowerView Motorized',
      price_min: 350,
      image: '/images/hero-living-room.jpg',
      tag: 'Smart Home Automation',
      desc: 'Whisper-quiet smart shades with Apple HomeKit & Alexa control.'
    }
  ]);

  useEffect(() => {
    api.getProducts({ featured: 'true' })
      .then(res => {
        if (res.success && res.products && res.products.length > 0) {
          setFeaturedProducts(res.products.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="home-page animate-fade-in">
      <SEOHead 
        title="Lumina Window Treatments | Custom Blinds, Motorized Shades & Shutters in Gaithersburg, MD"
        description="Premium custom window blinds, motorized shades, and tailored drapery with in-home laser measuring and turnkey master installation across Montgomery County, DC, and Northern VA."
        canonical="/"
        schema={generateLocalBusinessSchema()}
      />
      {/* Hero Section */}
      <section className="hero">
        <img 
          src="/images/hero-living-room.jpg" 
          alt="Modern living room with elegant custom window treatments" 
          className="hero-image"
        />
        <div className="hero-content">
          <span className="trade-badge">Gaithersburg, MD &bull; Serving DC, MD & Northern VA</span>
          <h1>Window treatments,<br/>made for your space.</h1>
          <p>Custom blinds, shades and smart motorization measured with laser precision and master-installed with our 100% Guaranteed Fit Promise.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={onOpenQuote}>Schedule Free In-Home Measure</button>
            <Link to="/blinds" className="btn btn-secondary btn-large">Explore Catalog</Link>
          </div>
          <div className="hero-reassurance">
            100% Guaranteed Fit &bull; Professional Master Installation &bull; Lifetime Warranty
          </div>
        </div>
      </section>

      {/* Quick Customer Path */}
      <section className="section container">
        <div className="shop-path">
          <h2>How would you like to shop?</h2>
          <div className="shop-path-grid">
            <div className="path-panel">
              <h3>For your home</h3>
              <p>Custom blinds and shades for bedrooms, living rooms, kitchens, and nurseries across the DMV.</p>
              <Link to="/blinds" className="btn btn-secondary">Explore Home Treatments</Link>
            </div>
            <div className="path-panel">
              <h3>For your business</h3>
              <p>Commercial-grade solar glare control for offices, restaurants, retail, and hospitality.</p>
              <Link to="/business" className="btn btn-secondary">Explore Commercial</Link>
            </div>
            <div className="path-panel">
              <h3>For designers & contractors</h3>
              <p>Dedicated trade account discounts, memo swatch decks, and dedicated project management.</p>
              <Link to="/trade" className="btn btn-secondary">Join Trade Program</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Treatments Live Rail */}
      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-8)' }}>
          <div>
            <span className="trade-badge">DMV Favorites</span>
            <h2>Featured Window Treatments</h2>
            <p style={{ color: 'var(--color-secondary-text)' }}>
              Our most popular custom treatments fabricated to exact window dimensions.
            </p>
          </div>
          <Link to="/solutions" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View Full Catalog <ArrowRight size={14} />
          </Link>
        </div>

        <div className="catalog-grid">
          {featuredProducts.map(p => {
            const slug = p.slug || p.id;
            const img = (p.images && p.images[0]) || p.image || '/images/cat-roller.jpg';
            const price = p.price_min || 89;

            return (
              <div key={p.id} className="product-card">
                <div className="product-card-image-wrap">
                  <img src={img} alt={p.name} className="product-card-image" />
                  {p.tag && <span className="product-card-badge">{p.tag}</span>}
                  {p.is_bestseller && !p.tag && <span className="product-card-badge">Bestseller</span>}
                </div>
                <div className="product-card-body">
                  <div className="product-card-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
                      ))}
                    </div>
                    <span>5.0 (95+ reviews)</span>
                  </div>
                  <h3 className="product-card-title">
                    <Link to={`/products/${slug}`}>{p.name}</Link>
                  </h3>
                  <p className="product-card-desc">{p.short_description || p.desc || p.description}</p>
                  <div className="product-card-footer">
                    <div className="product-price">
                      <span className="price-label">Starting at</span>
                      <span className="price-value">${price}</span>
                    </div>
                    <Link to={`/products/${slug}`} className="btn btn-secondary">
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Selector Promo */}
      <section className="section container">
        <div className="interactive-selector">
          <span className="trade-badge">Interactive Project Estimator</span>
          <h2>Not sure which blinds are right for your windows?</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)', marginBottom: 'var(--spacing-6)', maxWidth: '640px', margin: '0 auto var(--spacing-6)' }}>
            Answer 4 quick questions about your room, light control, and window count to receive a transparent price range in seconds.
          </p>
          <button className="btn btn-accent btn-large" onClick={onOpenQuote}>Launch Instant Quote Wizard</button>
        </div>
      </section>

      {/* Measure & Install */}
      <section className="section container service-section">
        <div className="service-content">
          <span className="trade-badge">White-Glove Service</span>
          <h2>From laser measuring to master installation, we've got you covered.</h2>
          <div className="service-steps">
            <div className="service-step">
              <div className="step-number">01</div>
              <div className="step-text">
                <h4>Laser Measure</h4>
                <p>A licensed technician verifies exact 1/16" dimensions on-site (backed by our 100% Fit Guarantee).</p>
              </div>
            </div>
            <div className="service-step">
              <div className="step-number">02</div>
              <div className="step-text">
                <h4>Design & Swatches</h4>
                <p>Test real fabric books, textures, and motorization options directly in your room's natural lighting.</p>
              </div>
            </div>
            <div className="service-step">
              <div className="step-number">03</div>
              <div className="step-text">
                <h4>Master Install</h4>
                <p>White-glove bracket mounting, cordless tension calibration, smart home setup, and spotless cleanup.</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <button className="btn btn-primary" onClick={onOpenQuote}>Schedule In-Home Measure</button>
            <Link to="/services" className="btn btn-secondary">Explore Installation Services</Link>
          </div>
        </div>
        <div className="service-image">
          <img src="/images/service-install.jpg" alt="Professional window blind installation in Gaithersburg MD" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container">
        <div className="trust-section">
          <div className="trust-item">
            <Settings className="trust-icon" size={32} />
            <h4>100% Guaranteed Fit</h4>
            <p>We measure it, we guarantee it.</p>
          </div>
          <div className="trust-item">
            <UserCheck className="trust-icon" size={32} />
            <h4>Local DMV Craftsmen</h4>
            <p>Family-owned team based in Gaithersburg.</p>
          </div>
          <div className="trust-item">
            <ShieldCheck className="trust-icon" size={32} />
            <h4>Lifetime Warranty</h4>
            <p>Full protection on motors & mechanics.</p>
          </div>
          <div className="trust-item">
            <PenTool className="trust-icon" size={32} />
            <h4>Zero-Mess Guarantee</h4>
            <p>We leave your home cleaner than we found it.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section container" style={{ textAlign: 'center' }}>
        <h2>Ready to transform your home with custom window treatments?</h2>
        <p style={{ color: 'var(--color-secondary-text)', maxWidth: '600px', margin: 'var(--spacing-2) auto var(--spacing-6)' }}>
          Serving Gaithersburg, Rockville, Bethesda, Potomac, Silver Spring, Arlington, Alexandria, and all surrounding DMV communities.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)' }}>
          <button className="btn btn-primary btn-large" onClick={onOpenQuote}>Get a Free Quote & Consultation</button>
          <a href="tel:18005550199" className="btn btn-secondary btn-large">Call (800) 555-0199</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
