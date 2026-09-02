import React, { useState } from 'react';
import { Compass, Percent, Layers, Clock, CheckCircle2 } from 'lucide-react';

const Trade = ({ onOpenQuote }) => {
  const [submitted, setSubmitted] = useState(false);
  const [tradeForm, setTradeForm] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    profession: 'Interior Designer',
    projectLocation: '',
    estimatedVolume: '$10,000 - $25,000'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="trade-page animate-fade-in container section">
      {/* Hero */}
      <div className="trade-hero">
        <div className="trade-hero-content">
          <span className="trade-badge">Lumina Trade & Design Program</span>
          <h1>Engineered for designers, architects & builders.</h1>
          <p>
            Partner with Lumina to access exclusive trade pricing, custom engineering, dedicated project managers, and complimentary material kits.
          </p>
          <div className="trade-hero-actions">
            <a href="#trade-form" className="btn btn-primary btn-large">Apply for Trade Account</a>
            <button className="btn btn-secondary btn-large" onClick={onOpenQuote}>Request Project Quote</button>
          </div>
        </div>
      </div>

      {/* Trade Perks */}
      <section className="trade-perks-section">
        <h2 className="text-center">Trade Member Privileges</h2>
        <div className="trade-perks-grid">
          <div className="trade-perk-card">
            <Percent className="trade-icon" size={32} />
            <h3>Tiered Trade Pricing</h3>
            <p>Enjoy 20% to 35% margin discounts with no minimum order thresholds on residential or commercial specs.</p>
          </div>
          <div className="trade-perk-card">
            <Compass className="trade-icon" size={32} />
            <h3>Dedicated Concierge</h3>
            <p>Single point of contact for technical takeoff, CAD drawings, sample requests, and rush delivery tracking.</p>
          </div>
          <div className="trade-perk-card">
            <Layers className="trade-icon" size={32} />
            <h3>Free Sample Binders</h3>
            <p>Comprehensive swatch decks including luxury linens, solar mesh, blackout fabrics, and custom wood stains.</p>
          </div>
          <div className="trade-perk-card">
            <Clock className="trade-icon" size={32} />
            <h3>Priority Fabrication</h3>
            <p>Fast-tracked manufacturing line and guaranteed delivery schedules to meet strict project deadlines.</p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="trade-form" className="trade-form-section">
        <div className="trade-form-wrapper">
          <div className="trade-form-info">
            <h2>Join the Trade Program</h2>
            <p>
              Fill out the form below to apply. Trade approvals are typically processed within 1 business day.
            </p>
            <div className="trade-checklist">
              <div><CheckCircle2 size={18} color="var(--color-accent-premium)" /> <span>Instant tax-exempt purchasing upon resale certificate verification</span></div>
              <div><CheckCircle2 size={18} color="var(--color-accent-premium)" /> <span>Complimentary swatch box delivered to your studio</span></div>
              <div><CheckCircle2 size={18} color="var(--color-accent-premium)" /> <span>Nationwide professional measuring & installation network</span></div>
            </div>
          </div>

          <div className="trade-form-card">
            {submitted ? (
              <div className="trade-success animate-fade-in">
                <CheckCircle2 size={48} color="#2e7d32" />
                <h3>Application Received!</h3>
                <p>
                  Thank you, <strong>{tradeForm.fullName || 'Partner'}</strong>. Your dedicated trade concierge will review your credentials and reach out to <strong>{tradeForm.email}</strong> shortly.
                </p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="trade-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Jane Doe"
                      value={tradeForm.fullName}
                      onChange={(e) => setTradeForm({...tradeForm, fullName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company / Studio Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Studio Design Co."
                      value={tradeForm.company}
                      onChange={(e) => setTradeForm({...tradeForm, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="jane@studiodesign.com"
                      value={tradeForm.email}
                      onChange={(e) => setTradeForm({...tradeForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="(555) 000-0000"
                      value={tradeForm.phone}
                      onChange={(e) => setTradeForm({...tradeForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Profession</label>
                    <select 
                      value={tradeForm.profession}
                      onChange={(e) => setTradeForm({...tradeForm, profession: e.target.value})}
                    >
                      <option value="Interior Designer">Interior Designer</option>
                      <option value="Architect">Architect</option>
                      <option value="General Contractor">General Contractor</option>
                      <option value="Real Estate Developer">Real Estate Developer</option>
                      <option value="Home Stager">Home Stager</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estimated Annual Window Budget</label>
                    <select 
                      value={tradeForm.estimatedVolume}
                      onChange={(e) => setTradeForm({...tradeForm, estimatedVolume: e.target.value})}
                    >
                      <option value="Under $10,000">Under $10,000</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                      <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Current Project Notes or Address (Optional)</label>
                  <textarea 
                    rows="3" 
                    placeholder="Tell us about any upcoming projects or specific swatch decks needed..."
                    value={tradeForm.projectLocation}
                    onChange={(e) => setTradeForm({...tradeForm, projectLocation: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large full-width">
                  Submit Trade Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trade;
