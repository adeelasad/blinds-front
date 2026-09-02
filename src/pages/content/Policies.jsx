import React from 'react';
import { ShieldCheck, Ruler, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

const Policies = ({ onOpenQuote }) => {
  return (
    <div className="content-page animate-fade-in container section">
      <div className="catalog-header">
        <span className="trade-badge">Trust & Customer Commitments</span>
        <h1>Warranty, Guarantees & Service Policies</h1>
        <p className="catalog-subtitle">
          Transparent, customer-first warranties backing our custom products and in-home services across the DMV.
        </p>
      </div>

      <div className="profile-grid" style={{ marginBottom: 'var(--spacing-16)' }}>
        <div className="profile-card">
          <ShieldCheck size={28} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>Limited Lifetime Craftsmanship Warranty</h3>
          <p style={{ color: 'var(--color-secondary-text)', marginTop: '8px', lineHeight: 1.6 }}>
            All internal springs, brackets, headrails, and cordless mechanisms are covered by our Limited Lifetime Warranty against mechanical defects for as long as you own your home. Smart home motors (Hunter Douglas PowerView & Somfy) include a 5-year manufacturer replacement warranty.
          </p>
        </div>

        <div className="profile-card">
          <Ruler size={28} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>The 100% Perfect Fit Guarantee</h3>
          <p style={{ color: 'var(--color-secondary-text)', marginTop: '8px', lineHeight: 1.6 }}>
            When our certified technician measures your windows, you are 100% protected against fit errors. If any treatment is fabricated improperly, we remake and reinstall the unit at zero cost.
          </p>
        </div>

        <div className="profile-card">
          <Clock size={28} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>48-Hour Consultation Rescheduling Policy</h3>
          <p style={{ color: 'var(--color-secondary-text)', marginTop: '8px', lineHeight: 1.6 }}>
            We understand life gets busy. You can reschedule or adjust your in-home design consultation at any time up to 48 hours before your appointment directly from your customer account or by calling dispatch at (800) 555-0199.
          </p>
        </div>

        <div className="profile-card">
          <RefreshCw size={28} color="var(--color-accent-premium)" style={{ marginBottom: '8px' }} />
          <h3>Custom Orders & 50% Deposit Terms</h3>
          <p style={{ color: 'var(--color-secondary-text)', marginTop: '8px', lineHeight: 1.6 }}>
            Because every treatment is made-to-order based on laser measurements, custom fabrication begins immediately after the 50% project deposit is received. The remaining 50% balance is due only upon final master installation and your 100% satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policies;
