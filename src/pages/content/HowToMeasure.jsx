import React, { useState } from 'react';
import { Ruler, Check, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const HowToMeasure = ({ onOpenQuote }) => {
  const [activeMount, setActiveMount] = useState('inside');

  return (
    <div className="content-page animate-fade-in container section">
      {/* Header */}
      <div className="catalog-header">
        <span className="trade-badge">Measurement Guide & Specifications</span>
        <h1>How to Measure for Custom Blinds & Shades</h1>
        <p className="catalog-subtitle">
          Everything you need to know about Inside Mount vs. Outside Mount, window depth, and avoiding common measuring pitfalls.
        </p>
        <div className="catalog-perks">
          <span><Check size={16} /> Free Professional In-Home Measuring Available</span>
          <span><Check size={16} /> Laser Accuracy to 1/16"</span>
          <span><Check size={16} /> 100% Fit Guarantee</span>
        </div>
      </div>

      {/* Free Measure Teaser Callout */}
      <div style={{ backgroundColor: '#f7f5f0', border: '1px solid #e5e2da', padding: '20px', borderRadius: '12px', marginBottom: 'var(--spacing-12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Sparkles size={18} color="var(--color-accent-premium)" /> Prefer to have an expert measure for free?
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', margin: '4px 0 0 0' }}>
            Lumina offers complimentary in-home laser measurement across Gaithersburg, Bethesda, Rockville, and the DMV.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenQuote}>
          Book Free Measure Visit
        </button>
      </div>

      {/* Inside vs Outside Mount Interactive Tab */}
      <div className="account-tabs" style={{ justifyContent: 'center' }}>
        <button 
          className={`account-tab ${activeMount === 'inside' ? 'active' : ''}`}
          onClick={() => setActiveMount('inside')}
        >
          Inside Mount (Most Popular)
        </button>
        <button 
          className={`account-tab ${activeMount === 'outside' ? 'active' : ''}`}
          onClick={() => setActiveMount('outside')}
        >
          Outside Mount (Trim / Wall Mounted)
        </button>
      </div>

      {/* Mount Details Card */}
      <div className="profile-grid" style={{ marginBottom: 'var(--spacing-16)' }}>
        {activeMount === 'inside' ? (
          <>
            <div className="profile-card">
              <h3>Inside Mount Guidelines</h3>
              <p style={{ color: 'var(--color-secondary-text)', margin: '8px 0 16px' }}>
                Mounted inside the window frame casing for a clean, built-in architectural look that highlights decorative woodwork and trim.
              </p>
              
              <h4 style={{ marginTop: '16px' }}>Step-by-Step Measuring:</h4>
              <ol style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                <li><strong>Measure Width (3 points):</strong> Measure exact width at the <em>Top</em>, <em>Middle</em>, and <em>Bottom</em> to the nearest 1/16". Record the <u>narrowest</u> measurement.</li>
                <li><strong>Measure Height (3 points):</strong> Measure exact height at the <em>Left</em>, <em>Center</em>, and <em>Right</em>. Record the <u>longest</u> measurement.</li>
                <li><strong>Check Minimum Depth:</strong> Ensure your frame has at least 1.5" to 2.5" of clear depth (free of crank handles or latches) for flush bracket mounting.</li>
              </ol>
            </div>

            <div className="profile-card" style={{ backgroundColor: 'var(--color-secondary-bg)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color="#854d0e" /> Factory Deductions Note
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', marginTop: '8px', lineHeight: 1.6 }}>
                <strong>Do NOT take your own deductions!</strong> When ordering inside mount custom treatments, provide the exact window opening dimensions. Our custom fabrication facility automatically applies an exact 1/8" to 3/8" operational deduction so the shade moves smoothly without scraping your window frame.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="profile-card">
              <h3>Outside Mount Guidelines</h3>
              <p style={{ color: 'var(--color-secondary-text)', margin: '8px 0 16px' }}>
                Mounted on the window trim or surrounding drywall. Recommended when window frame depth is too shallow or to maximize blackout light coverage.
              </p>
              
              <h4 style={{ marginTop: '16px' }}>Step-by-Step Measuring:</h4>
              <ol style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                <li><strong>Measure Desired Width:</strong> Measure the exact width of the area you want covered. We recommend adding 2" to 3" on each side (4" to 6" total) to minimize side light gaps.</li>
                <li><strong>Measure Desired Height:</strong> Measure from the intended top bracket location down to the window sill or bottom floor base.</li>
                <li><strong>Check Flat Mounting Space:</strong> Ensure you have at least 2" of flat surface on the trim or drywall above the window to secure brackets.</li>
              </ol>
            </div>

            <div className="profile-card" style={{ backgroundColor: 'var(--color-secondary-bg)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#2e7d32" /> Best For Maximum Blackout
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', marginTop: '8px', lineHeight: 1.6 }}>
                Outside mounts are ideal for bedrooms, home theaters, and nurseries where eliminating edge light halos is critical for sleep.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Reassurance Footer */}
      <section className="catalog-cta-banner">
        <div className="cta-banner-content">
          <Ruler className="cta-icon" size={36} />
          <div>
            <h3>Eliminate measurement stress with our 100% Fit Guarantee</h3>
            <p>Our DMV measuring specialists will verify all dimensions on-site with optical lasers.</p>
          </div>
        </div>
        <button className="btn btn-accent btn-large" onClick={onOpenQuote}>
          Schedule Free In-Home Measure
        </button>
      </section>
    </div>
  );
};

export default HowToMeasure;
