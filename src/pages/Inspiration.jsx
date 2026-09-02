import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const LOOKBOOK_ITEMS = [
  {
    id: 1,
    title: 'Warm Minimalist Living Room',
    room: 'Living Room',
    treatment: 'Tailored Linen Roman Shades',
    productId: 'roman-shades',
    image: '/images/hero-living-room.jpg',
    description: 'Soft textured oatmeal linen folds that gently diffuse morning daylight while preserving total privacy.'
  },
  {
    id: 2,
    title: 'Modern Executive Boardroom',
    room: 'Commercial',
    treatment: 'Motorized Solar Screen Shades',
    productId: 'solar-shades',
    image: '/images/hero-business.jpg',
    description: '1% openness charcoal solar mesh eliminating screen glare while maintaining floor-to-ceiling city views.'
  },
  {
    id: 3,
    title: 'Sunlit Kitchen & Breakfast Nook',
    room: 'Kitchen',
    treatment: 'Precision Natural Wood Blinds',
    productId: 'wood-blinds',
    image: '/images/cat-wood.jpg',
    description: '2-inch white oak slats that allow customizable directional light control with organic wood warmth.'
  },
  {
    id: 4,
    title: 'Serene Master Bedroom',
    room: 'Bedroom',
    treatment: 'Dual-Cell Blackout Cellular Shades',
    productId: 'cellular-shades',
    image: '/images/cat-cellular.jpg',
    description: '100% light-blocking honeycomb shades offering thermal insulation for peaceful, dark sleep.'
  },
  {
    id: 5,
    title: 'Cozy Architectural Dining Space',
    room: 'Dining Room',
    treatment: 'Light Filtering Roller Shades',
    productId: 'roller-shades',
    image: '/images/cat-roller.jpg',
    description: 'Minimal cassette enclosure with smooth cordless glide for an unobtrusive architectural profile.'
  },
  {
    id: 6,
    title: 'Open Concept Creative Studio',
    room: 'Commercial',
    treatment: 'Commercial Smart Motorized Blinds',
    productId: 'motorized-smart-shades',
    image: '/images/business-meeting.jpg',
    description: 'Automated schedules programmed to raise at 8am and lower during afternoon peak solar exposure.'
  }
];

const Inspiration = ({ onOpenQuote }) => {
  const [selectedRoom, setSelectedRoom] = useState('All');

  const filteredLooks = selectedRoom === 'All' 
    ? LOOKBOOK_ITEMS 
    : LOOKBOOK_ITEMS.filter(item => item.room === selectedRoom);

  return (
    <div className="inspiration-page animate-fade-in container section">
      {/* Header */}
      <div className="inspiration-header text-center">
        <span className="trade-badge">Curated Interiors</span>
        <h1>Inspiration & Real Spaces</h1>
        <p className="inspiration-subtitle">
          Explore how custom window treatments transform natural light, comfort, and architectural beauty in real homes and businesses.
        </p>
      </div>

      {/* Room Filters */}
      <div className="inspiration-filters">
        {['All', 'Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Commercial'].map(room => (
          <button
            key={room}
            className={`filter-pill ${selectedRoom === room ? 'active' : ''}`}
            onClick={() => setSelectedRoom(room)}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Lookbook Grid */}
      <div className="lookbook-grid">
        {filteredLooks.map(look => (
          <div key={look.id} className="lookbook-card">
            <div className="lookbook-image-wrap">
              <img src={look.image} alt={look.title} className="lookbook-image" />
              <span className="lookbook-room-tag">{look.room}</span>
            </div>
            <div className="lookbook-info">
              <h3>{look.title}</h3>
              <p className="lookbook-desc">{look.description}</p>
              <div className="lookbook-treatment-box">
                <span className="treatment-label">Featured Treatment:</span>
                <span className="treatment-name">{look.treatment}</span>
              </div>
              <div className="lookbook-actions">
                <Link to={`/products/${look.productId}`} className="btn btn-secondary">
                  Shop This Style <ArrowRight size={16} />
                </Link>
                <button className="btn btn-primary" onClick={onOpenQuote}>
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Consultation Banner */}
      <section className="inspiration-cta">
        <div className="cta-content">
          <Sparkles size={40} color="var(--color-accent-premium)" />
          <h2>Want help bringing your vision to life?</h2>
          <p>Send photos of your windows to our design team for custom recommendations and free fabric swatches.</p>
          <button className="btn btn-accent btn-large" onClick={onOpenQuote}>
            Start Free Design Consultation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Inspiration;
