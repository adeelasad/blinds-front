import React from 'react';
import { Ruler, Palette, Wrench, Shield, CheckCircle, Calendar } from 'lucide-react';

const Services = ({ onOpenQuote }) => {
  return (
    <div className="services-page animate-fade-in container section">
      {/* Services Header */}
      <div className="services-header text-center">
        <span className="trade-badge">End-to-End White Glove Service</span>
        <h1>We make window treatments effortless.</h1>
        <p className="services-subtitle">
          From precise laser measurement to custom fabric selection and spotless professional installation, our certified specialists handle every step.
        </p>
      </div>

      {/* 3 Main Pillars */}
      <div className="services-pillar-grid">
        {/* Pillar 1 */}
        <div className="service-pillar-card">
          <div className="service-pillar-icon-wrap">
            <Ruler size={36} color="var(--color-accent-premium)" />
          </div>
          <span className="service-step-tag">Step 1</span>
          <h2>Professional In-Home Measurement</h2>
          <p>
            Avoid costly sizing mistakes. A licensed measurement technician visits your home or jobsite to record exact millimetric window dimensions, mounting depths, and window frame clearances.
          </p>
          <ul className="service-feature-list">
            <li><CheckCircle size={16} /> 100% Guaranteed Fit Guarantee</li>
            <li><CheckCircle size={16} /> Window frame & obstruction assessment</li>
            <li><CheckCircle size={16} /> Laser-calibrated measuring tools</li>
          </ul>
        </div>

        {/* Pillar 2 */}
        <div className="service-pillar-card featured">
          <div className="service-pillar-icon-wrap">
            <Palette size={36} color="var(--color-white)" />
          </div>
          <span className="service-step-tag">Step 2</span>
          <h2>Design Consultation</h2>
          <p>
            Collaborate with an interior window specialist in-home or virtually. Explore fabric weights, light filtering vs. blackout opacities, motorization power options, and hardware finishes.
          </p>
          <ul className="service-feature-list">
            <li><CheckCircle size={16} /> Physical fabric books & swatch samples</li>
            <li><CheckCircle size={16} /> Smart home & motorization planning</li>
            <li><CheckCircle size={16} /> Itemized transparent estimates on the spot</li>
          </ul>
        </div>

        {/* Pillar 3 */}
        <div className="service-pillar-card">
          <div className="service-pillar-icon-wrap">
            <Wrench size={36} color="var(--color-accent-premium)" />
          </div>
          <span className="service-step-tag">Step 3</span>
          <h2>Master Installation</h2>
          <p>
            Our factory-trained master installers secure your treatments, configure remote controls and smart hubs, test all operating mechanics, and clean up the work area thoroughly.
          </p>
          <ul className="service-feature-list">
            <li><CheckCircle size={16} /> Smart app pairing & remote setup</li>
            <li><CheckCircle size={16} /> Complete debris & old blind haul-away</li>
            <li><CheckCircle size={16} /> Full product walkthrough & care instructions</li>
          </ul>
        </div>
      </div>

      {/* Guarantee Section */}
      <section className="guarantee-section">
        <div className="guarantee-badge-box">
          <Shield size={48} color="var(--color-accent-premium)" />
          <div>
            <h3>The Lumina Perfect-Fit Promise</h3>
            <p>
              If a treatment measured by our team doesn't fit your window perfectly, we will remake or adjust it at zero cost to you.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule Consultation CTA */}
      <section className="services-cta-card">
        <div className="services-cta-text">
          <Calendar size={36} />
          <div>
            <h3>Ready to get started?</h3>
            <p>Book a free consultation with a local design & measurement specialist today.</p>
          </div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
          Schedule Free Consultation
        </button>
      </section>
    </div>
  );
};

export default Services;
