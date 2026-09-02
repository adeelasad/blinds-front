import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, DollarSign, ThermometerSnowflake, Sun, ShieldCheck } from 'lucide-react';

const EnergySaving = ({ onOpenQuote }) => {
  return (
    <div className="content-page animate-fade-in container section">
      <div className="catalog-header">
        <span className="trade-badge">Thermal Efficiency & Green Living</span>
        <h1>Energy Saving Cellular & Insulating Shades</h1>
        <p className="catalog-subtitle">
          Trap air at the glass pane to slash winter heating and summer cooling bills across Maryland, DC, and Northern Virginia.
        </p>
      </div>

      <div className="about-story-grid">
        <div className="about-story-image">
          <img src="/images/cat-cellular.jpg" alt="Energy-efficient cellular honeycomb shades" />
        </div>
        <div className="about-story-content">
          <h2>Reduce Window Heat Loss by Up to 40%</h2>
          <p>
            Windows account for up to 30% of a residential home's heating and cooling energy loss. In the DMV's humid summers and frosty winters, untreated windows strain HVAC systems and drive up PEPCO, BGE, and Dominion Energy utility bills.
          </p>
          <p>
            Lumina honeycomb cellular shades feature double and single honeycomb air pockets that act as a thermal barrier, locking comfortable air inside your living spaces while gently diffusing exterior daylight.
          </p>

          <div style={{ marginTop: 'var(--spacing-6)' }}>
            <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
              Explore Energy-Saving Options
            </button>
          </div>
        </div>
      </div>

      <div className="trade-perks-grid section">
        <div className="trade-perk-card">
          <ThermometerSnowflake size={32} color="#1e429f" style={{ marginBottom: '8px' }} />
          <h3>Winter Warmth Retention</h3>
          <p>Traps radiant heat indoors, keeping rooms cozy during Maryland freezes.</p>
        </div>
        <div className="trade-perk-card">
          <Sun size={32} color="#d97706" style={{ marginBottom: '8px' }} />
          <h3>Summer Solar Heat Block</h3>
          <p>Rejects up to 80% of unwanted solar heat gain during intense July heatwaves.</p>
        </div>
        <div className="trade-perk-card">
          <DollarSign size={32} color="#2e7d32" style={{ marginBottom: '8px' }} />
          <h3>Real Utility Bill Savings</h3>
          <p>Earn measurable returns on investment year-round through reduced energy consumption.</p>
        </div>
      </div>
    </div>
  );
};

export default EnergySaving;
