import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Ruler, 
  Heart, 
  Award, 
  Phone, 
  MapPin, 
  Clock, 
  Lock
} from 'lucide-react';

const Footer = ({ onOpenQuote }) => {
  return (
    <footer className="main-footer">
      {/* Top Trust & Guarantees Bar */}
      <div className="footer-trust-bar">
        <div className="container">
          <div className="footer-trust-grid">
            <div className="footer-trust-item">
              <ShieldCheck size={24} color="var(--color-accent-premium)" />
              <div>
                <strong>100% Perfect Fit Guarantee</strong>
                <span>We measure it, we guarantee it</span>
              </div>
            </div>
            <div className="footer-trust-item">
              <Award size={24} color="var(--color-accent-premium)" />
              <div>
                <strong>Lifetime Warranty</strong>
                <span>On hardware, springs & mechanics</span>
              </div>
            </div>
            <div className="footer-trust-item">
              <Heart size={24} color="var(--color-accent-premium)" />
              <div>
                <strong>Certified Child-Safe</strong>
                <span>100% cordless CPSC compliant</span>
              </div>
            </div>
            <div className="footer-trust-item">
              <Ruler size={24} color="var(--color-accent-premium)" />
              <div>
                <strong>Free In-Home Measure</strong>
                <span>Laser precision at your windows</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="container" style={{ padding: 'var(--spacing-16) 0 var(--spacing-12)' }}>
        <div className="footer-grid-5">
          {/* Column 1: Products */}
          <div className="footer-col">
            <h4>Custom Treatments</h4>
            <ul>
              <li><Link to="/products/roller-shades">Custom Roller Shades</Link></li>
              <li><Link to="/products/roman-shades">Tailored Roman Shades</Link></li>
              <li><Link to="/products/wood-blinds">Natural Hardwood Blinds</Link></li>
              <li><Link to="/products/cellular-honeycomb-shades">Honeycomb Cellular</Link></li>
              <li><Link to="/products/hunter-douglas-powerview-motorized">Smart Motorized PowerView</Link></li>
              <li><Link to="/products/plantation-shutters">Plantation Shutters</Link></li>
              <li><Link to="/outdoor-shades">Outdoor Patio Drop Shades</Link></li>
              <li><Link to="/solutions">Explore Full Catalog &rarr;</Link></li>
            </ul>
          </div>

          {/* Column 2: Rooms */}
          <div className="footer-col">
            <h4>Shop by Room</h4>
            <ul>
              <li><Link to="/rooms/living-room">Living Room Shades</Link></li>
              <li><Link to="/rooms/bedroom">Bedroom & Nursery Blackout</Link></li>
              <li><Link to="/rooms/kitchen">Kitchen Easy-Wipe Blinds</Link></li>
              <li><Link to="/rooms/bathroom">Bathroom Moisture-Resistant</Link></li>
              <li><Link to="/rooms/home-office">Home Office Anti-Glare</Link></li>
              <li><Link to="/inspiration">Lookbook & Gallery</Link></li>
              <li><button onClick={onOpenQuote} className="footer-btn-link">Instant Quote Wizard</button></li>
            </ul>
          </div>

          {/* Column 3: Help & Guides */}
          <div className="footer-col">
            <h4>Guides & Expertise</h4>
            <ul>
              <li><Link to="/professional-installation">Professional Installation</Link></li>
              <li><Link to="/how-to-measure">How to Measure Guide</Link></li>
              <li><Link to="/child-safety">Child & Pet Safety</Link></li>
              <li><Link to="/energy-saving">Energy Saving Insulation</Link></li>
              <li><Link to="/cleaning-and-care">Cleaning & Fabric Care</Link></li>
              <li><Link to="/policies">Warranties & Policies</Link></li>
              <li><Link to="/blog">Window Living Blog</Link></li>
            </ul>
          </div>

          {/* Column 4: DMV Service Cities */}
          <div className="footer-col">
            <h4>DMV Service Areas</h4>
            <ul>
              <li><Link to="/locations/gaithersburg-md">Gaithersburg, MD (HQ)</Link></li>
              <li><Link to="/locations/rockville-md">Rockville, MD</Link></li>
              <li><Link to="/locations/bethesda-md">Bethesda, MD</Link></li>
              <li><Link to="/locations/potomac-md">Potomac, MD</Link></li>
              <li><Link to="/locations/silver-spring-md">Silver Spring, MD</Link></li>
              <li><Link to="/locations/germantown-md">Germantown, MD</Link></li>
              <li><Link to="/locations/frederick-md">Frederick, MD</Link></li>
              <li><Link to="/locations/washington-dc">Washington, DC</Link></li>
              <li><Link to="/locations/arlington-va">Arlington, VA</Link></li>
              <li><Link to="/locations/alexandria-va">Alexandria, VA</Link></li>
              <li><Link to="/locations/mclean-va">McLean, VA</Link></li>
              <li><Link to="/locations/reston-va">Reston & Herndon, VA</Link></li>
            </ul>
          </div>

          {/* Column 5: Company, Contact & Portals */}
          <div className="footer-col">
            <h4>Company & Portals</h4>
            <ul>
              <li><Link to="/about">About Lumina</Link></li>
              <li><Link to="/contact">Contact & Showroom</Link></li>
              <li><Link to="/trade">Trade Program (Designers)</Link></li>
              <li><Link to="/business">Commercial Solutions</Link></li>
              <li><Link to="/account">Customer Account Hub</Link></li>
              <li><Link to="/installer">Field Technician Portal</Link></li>
              <li><Link to="/admin/login">Admin CRM Gateway</Link></li>
            </ul>

            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Phone size={14} color="var(--color-accent-premium)" />
                <a href="tel:18005550199" style={{ color: 'inherit', fontWeight: 'bold' }}>(800) 555-0199</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
                <MapPin size={14} color="var(--color-accent-premium)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>101 Lakeforest Blvd, Suite 200, Gaithersburg, MD 20877</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--color-accent-premium)" />
                <span>Mon–Sat: 8:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods & Security */}
        <div className="footer-payments-wrap">
          <div className="payments-title">
            <Lock size={14} /> Secure Payment & 0% APR Financing Options:
          </div>
          <div className="payments-icons">
            <span className="payment-pill">Visa</span>
            <span className="payment-pill">Mastercard</span>
            <span className="payment-pill">American Express</span>
            <span className="payment-pill">Discover</span>
            <span className="payment-pill">Apple Pay</span>
            <span className="payment-pill">Google Pay</span>
            <span className="payment-pill" style={{ backgroundColor: '#252525', color: '#fff' }}>Affirm 0% APR</span>
            <span className="payment-pill" style={{ backgroundColor: '#596052', color: '#fff' }}>Stripe Verified</span>
          </div>
        </div>
        
        {/* Footer Bottom Legal */}
        <div className="footer-bottom">
          <div className="copyright">
            &copy; 2026 Lumina Window Treatments Inc. All rights reserved. Licensed, Bonded & Insured Home Improvement Contractor in MD (MHIC), DC & VA.
          </div>
          <div className="footer-bottom-links">
            <Link to="/policies">Privacy Policy</Link>
            <Link to="/policies">Terms of Service</Link>
            <Link to="/policies">Lifetime Warranty Terms</Link>
            <Link to="/contact">Accessibility Statement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
