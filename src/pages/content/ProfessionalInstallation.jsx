import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Ruler, CheckCircle2, Wrench, Sparkles, Clock, Check, Star } from 'lucide-react';

const ProfessionalInstallation = ({ onOpenQuote }) => {
  return (
    <div className="content-page animate-fade-in container section">
      {/* Header */}
      <div className="catalog-header">
        <span className="trade-badge">White-Glove Service Standards</span>
        <h1>Professional Window Treatment Measuring & Installation</h1>
        <p className="catalog-subtitle">
          Precision laser measurement, licensed local master installation, and our unconditional 100% Perfect Fit Guarantee across the entire DMV.
        </p>
        <div className="catalog-perks">
          <span><Check size={16} /> Laser Precision to 1/16"</span>
          <span><Check size={16} /> In-House Certified Installers</span>
          <span><Check size={16} /> Spotless Zero-Mess Cleanup</span>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="about-story-grid">
        <div className="about-story-image">
          <img 
            src="/images/service-install.jpg" 
            alt="Certified installer mounting custom window blinds" 
          />
        </div>
        <div className="about-story-content">
          <h2>Why Professional Installation Matters</h2>
          <p>
            Custom window treatments are an architectural investment. Unlike standard store-bought blinds that warp, bind, or leave unsightly light gaps, Lumina treatments are engineered around your window's exact frame depth, drywall squareness, and trim profile.
          </p>
          <p>
            Our master technicians handle every step—from heavy masonry anchors to precision cordless spring tension calibration and smart home motorized pairing.
          </p>

          <div style={{ marginTop: 'var(--spacing-6)' }}>
            <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
              Schedule Free In-Home Measure
            </button>
          </div>
        </div>
      </div>

      {/* The 4-Step Installation Protocol */}
      <section className="section" style={{ backgroundColor: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-12) var(--spacing-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
          <span className="trade-badge">Our Protocol</span>
          <h2>The Lumina 4-Step Installation Standard</h2>
        </div>

        <div className="trade-perks-grid">
          <div className="trade-perk-card">
            <div className="step-number" style={{ marginBottom: '8px' }}>01</div>
            <h3>Laser Precision Verification</h3>
            <p>We verify width at top, middle, and bottom, plus diagonal squareness with digital optical lasers.</p>
          </div>

          <div className="trade-perk-card">
            <div className="step-number" style={{ marginBottom: '8px' }}>02</div>
            <h3>Heavy-Duty Hardware Mounting</h3>
            <p>Using structural anchors and concealed brackets matched to your home's framing substrate.</p>
          </div>

          <div className="trade-perk-card">
            <div className="step-number" style={{ marginBottom: '8px' }}>03</div>
            <h3>Mechanical & Motor Calibration</h3>
            <p>Tension testing, smooth glide check, and mobile/voice app integration with Matter, Alexa, and Apple HomeKit.</p>
          </div>

          <div className="trade-perk-card">
            <div className="step-number" style={{ marginBottom: '8px' }}>04</div>
            <h3>Zero-Mess Guarantee</h3>
            <p>We pack all packaging boxes, vacuum mounting dust, and conduct a hands-on customer tutorial.</p>
          </div>
        </div>
      </section>

      {/* The 100% Fit Guarantee Box */}
      <section className="section">
        <div className="guarantee-section" style={{ padding: 'var(--spacing-12)', border: '2px solid var(--color-accent-premium)' }}>
          <div className="guarantee-badge-box">
            <ShieldCheck size={48} color="var(--color-accent-premium)" style={{ flexShrink: 0 }} />
            <div>
              <h3>The Lumina 100% Perfect Fit Guarantee</h3>
              <p style={{ fontSize: '1rem', marginTop: '4px' }}>
                Because our certified technicians perform the laser measurement, we assume 100% of the responsibility for fit. In the rare event any treatment does not fit your window frame with flawless precision, we will remake and reinstall it at zero cost to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer CTA */}
      <section className="catalog-cta-banner">
        <div className="cta-banner-content">
          <Sparkles className="cta-icon" size={36} />
          <div>
            <h3>Ready for effortless, professional window transformation?</h3>
            <p>Serving Montgomery County, Washington DC, and Northern Virginia.</p>
          </div>
        </div>
        <button className="btn btn-accent btn-large" onClick={onOpenQuote}>
          Book In-Home Consultation
        </button>
      </section>
    </div>
  );
};

export default ProfessionalInstallation;
