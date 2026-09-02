import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Check, CheckCircle2 } from 'lucide-react';

const ChildSafety = ({ onOpenQuote }) => {
  return (
    <div className="content-page animate-fade-in container section">
      <div className="catalog-header">
        <span className="trade-badge">Safety & CPSC Compliance</span>
        <h1>Child & Pet Safe Cordless Window Treatments</h1>
        <p className="catalog-subtitle">
          Engineered to the highest US Consumer Product Safety Commission (CPSC) cordless standards to protect families across the DMV.
        </p>
      </div>

      <div className="about-story-grid">
        <div className="about-story-image">
          <img src="/images/hero-living-room.jpg" alt="Child-safe cordless blinds in living room" />
        </div>
        <div className="about-story-content">
          <h2>100% Cord-Free for Peace of Mind</h2>
          <p>
            Dangling cords are one of the top hidden hazards in residential homes. At Lumina, we prioritize cordless technology across our entire collection of roller shades, cellular shades, natural wood blinds, and Roman drapery.
          </p>
          <p>
            Our precision-balanced cordless spring mechanisms and smart motorized systems allow you to raise or lower treatments with a gentle touch or voice command—completely eliminating dangerous loops and cords.
          </p>

          <div style={{ marginTop: 'var(--spacing-6)' }}>
            <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
              Schedule Free In-Home Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="trade-perks-grid section">
        <div className="trade-perk-card">
          <ShieldCheck size={32} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>CPSC & ANSI Certified</h3>
          <p>Meets and exceeds all federal child safety standards for cord-free operation.</p>
        </div>
        <div className="trade-perk-card">
          <Sparkles size={32} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>Smart Voice Automation</h3>
          <p>Raise and lower shades via Alexa, Google Assistant, or Apple Siri without touching the window.</p>
        </div>
        <div className="trade-perk-card">
          <Heart size={32} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>Pet & Claw Resistant</h3>
          <p>Durable performance fabrics that resist snagging, curious paws, and daily family use.</p>
        </div>
      </div>
    </div>
  );
};

export default ChildSafety;
