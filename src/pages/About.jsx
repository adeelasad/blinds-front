import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, HeartHandshake, ShieldCheck } from 'lucide-react';

const About = ({ onOpenQuote }) => {
  return (
    <div className="about-page animate-fade-in container section">
      {/* Hero */}
      <div className="about-hero text-center">
        <span className="trade-badge">Our Story & Craft</span>
        <h1>Custom window treatments, thoughtfully crafted.</h1>
        <p className="about-subtitle">
          At Lumina, we believe window treatments should do more than just block sunlight. They shape how light, warmth, and tranquility flow through the spaces where you live and work.
        </p>
      </div>

      {/* Story Narrative */}
      <div className="about-story-grid">
        <div className="about-story-image">
          <img src="/images/hero-living-room.jpg" alt="Lumina design philosophy" />
        </div>
        <div className="about-story-content">
          <h2>Crafted with intention, fitted with precision.</h2>
          <p>
            Founded by a team of interior designers and precision engineers, Lumina was born from a frustration with off-the-shelf blinds that warp, sag, or fail to fit real-world window frames.
          </p>
          <p>
            We set out to create a seamless end-to-end experience: combining sustainably sourced natural materials, whisper-quiet motorization technology, and white-glove professional installation with guaranteed fit precision.
          </p>
          <div className="about-stat-row">
            <div className="stat-box">
              <span className="stat-number">25,000+</span>
              <span className="stat-label">Windows Fitted</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">Fit Accuracy</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">Client Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <section className="about-values-section">
        <h2 className="text-center">What Sets Lumina Apart</h2>
        <div className="about-values-grid">
          <div className="value-card">
            <Leaf size={36} color="var(--color-accent-primary)" />
            <h3>Sustainable Materials</h3>
            <p>
              We prioritize FSC-certified natural hardwoods, OEKO-TEX certified fabrics free from harmful emissions, and recycled polyester blends.
            </p>
          </div>
          <div className="value-card">
            <Award size={36} color="var(--color-accent-primary)" />
            <h3>Master Craftsmanship</h3>
            <p>
              Every blind and shade is individually assembled and rigorously tested by artisans with decades of drapery and fabrication experience.
            </p>
          </div>
          <div className="value-card">
            <ShieldCheck size={36} color="var(--color-accent-primary)" />
            <h3>Lifetime Guarantee</h3>
            <p>
              We stand behind every header, clutch, cordless spring, and motor assembly with a Limited Lifetime Warranty.
            </p>
          </div>
          <div className="value-card">
            <HeartHandshake size={36} color="var(--color-accent-primary)" />
            <h3>Human Guidance</h3>
            <p>
              Real window specialists walk you through every selection—no confusing charts, no guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-banner text-center">
        <h2>Experience the Lumina difference in your home.</h2>
        <p>Book a free consultation and let our design team bring fabric swatches and measuring tools directly to you.</p>
        <div className="about-cta-buttons">
          <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
            Get a Personalized Quote
          </button>
          <Link to="/blinds" className="btn btn-secondary btn-large">
            Explore All Collections
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
