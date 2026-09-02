import React from 'react';
import { Sparkles, Check, Droplet, ShieldCheck } from 'lucide-react';

const CleaningAndCare = () => {
  return (
    <div className="content-page animate-fade-in container section">
      <div className="catalog-header">
        <span className="trade-badge">Maintenance & Longevity</span>
        <h1>Cleaning & Care Guide for Custom Window Treatments</h1>
        <p className="catalog-subtitle">
          Simple, safe maintenance guidelines to keep your custom fabrics, hardwood slats, and motorized shades looking brand new for decades.
        </p>
      </div>

      <div className="profile-grid" style={{ marginBottom: 'var(--spacing-16)' }}>
        <div className="profile-card">
          <h3>Fabric Roller & Roman Shades</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--color-secondary-text)', marginTop: '12px' }}>
            <li><strong>Dusting:</strong> Lightly dust weekly with a soft feather duster or vacuum with an upholstery brush attachment on low suction.</li>
            <li><strong>Spot Cleaning:</strong> Use a clean white microfiber cloth dampened with lukewarm water and mild dish soap. Dab gently—never rub aggressively.</li>
            <li><strong>Drying:</strong> Lower the shade fully and allow to air dry naturally before raising.</li>
          </ul>
        </div>

        <div className="profile-card">
          <h3>Natural Wood & Faux Wood Blinds</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--color-secondary-text)', marginTop: '12px' }}>
            <li><strong>Hardwood Slats:</strong> Wipe with a dry microfiber cloth or specialized wood cleaner. Avoid soaking in water to prevent grain swelling.</li>
            <li><strong>Faux Wood / Poly Slats:</strong> 100% waterproof—can be wiped with damp soapy water, making them perfect for kitchens and bathrooms.</li>
            <li><strong>Mechanism Care:</strong> Keep cordless bottom rails level when raising and lowering.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CleaningAndCare;
