import React from 'react';
import { Briefcase, Building, Coffee, ShoppingBag } from 'lucide-react';

const Business = ({ onOpenQuote }) => {
  return (
    <div className="business-page animate-fade-in">
      <section className="hero" style={{ backgroundColor: '#2c2e2a' }}>
        <img 
          src="/images/hero-business.jpg" 
          alt="Commercial window treatments" 
          className="hero-image"
          style={{ opacity: 0.6 }}
        />
        <div className="hero-content" style={{ background: 'transparent', boxShadow: 'none', color: 'var(--color-white)' }}>
          <h1 style={{ color: 'var(--color-white)' }}>Window treatments built for business.</h1>
          <p style={{ color: '#E0E0E0' }}>Reliable, scalable window solutions for offices, hospitality, retail and commercial spaces.</p>
          <div className="hero-actions">
            <button className="btn btn-accent btn-large" onClick={onOpenQuote}>Request a Commercial Quote</button>
            <button className="btn btn-secondary btn-large" style={{ color: 'var(--color-white)', borderColor: 'var(--color-white)' }} onClick={onOpenQuote}>Talk to a Project Specialist</button>
          </div>
        </div>
      </section>

      <section className="section container text-center">
        <h2>Industries we serve</h2>
        <div className="trust-section" style={{ border: 'none', padding: 'var(--spacing-8) 0' }}>
          <div className="trust-item">
            <Briefcase size={40} className="trust-icon" />
            <h4>Office</h4>
          </div>
          <div className="trust-item">
            <Coffee size={40} className="trust-icon" />
            <h4>Hospitality</h4>
          </div>
          <div className="trust-item">
            <ShoppingBag size={40} className="trust-icon" />
            <h4>Retail</h4>
          </div>
          <div className="trust-item">
            <Building size={40} className="trust-icon" />
            <h4>Multifamily</h4>
          </div>
        </div>
      </section>
      
      <section className="section container" style={{ backgroundColor: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-lg)' }}>
        <div className="service-section" style={{ padding: 'var(--spacing-8)' }}>
          <div className="service-content">
            <h2>Why businesses choose Lumina</h2>
            <p style={{ marginBottom: 'var(--spacing-6)' }}>From a single office to an entire commercial project, we make window treatments simple.</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <li><strong>Dedicated Support:</strong> Work with a single point of contact for your entire project.</li>
              <li><strong>Volume Pricing:</strong> Get competitive rates for large-scale installations.</li>
              <li><strong>Commercial Grade:</strong> Fire-retardant and high-durability options available.</li>
              <li><strong>Turnkey Solutions:</strong> From measuring to final installation, we handle it all.</li>
            </ul>
          </div>
          <div className="service-image">
            <img src="/images/business-meeting.jpg" alt="Business Meeting" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Business;
