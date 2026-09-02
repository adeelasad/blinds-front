import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Wind, ShieldCheck, Check, Sparkles } from 'lucide-react';

const OutdoorShades = ({ onOpenQuote }) => {
  return (
    <div className="content-page animate-fade-in container section">
      <div className="catalog-header">
        <span className="trade-badge">Patios, Decks & Pergolas</span>
        <h1>Weatherproof Exterior Motorized Outdoor Shades</h1>
        <p className="catalog-subtitle">
          Turn your patio, deck, screened porch, or commercial terrace into a year-round outdoor sanctuary with wind-retention drop shades.
        </p>
      </div>

      <div className="about-story-grid">
        <div className="about-story-image">
          <img src="/images/hero-business.jpg" alt="Motorized outdoor patio shades" />
        </div>
        <div className="about-story-content">
          <h2>Block 95% of Heat, Glare, and Pests</h2>
          <p>
            Enjoy your DMV backyard even in the peak of summer. Our heavy-duty exterior solar drop shades block blazing sun, lower patio temperatures by up to 15 degrees, and protect against mosquitoes and outdoor pests.
          </p>
          <p>
            Equipped with motorized remote controls and side-zipper retention tracks to withstand wind gusts up to 45 mph.
          </p>

          <div style={{ marginTop: 'var(--spacing-6)' }}>
            <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
              Get an Outdoor Patio Estimate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutdoorShades;
