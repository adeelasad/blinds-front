import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle2, ShieldCheck, ArrowRight, Check } from 'lucide-react';

const ROOM_CONFIGS = {
  'living-room': {
    title: 'Custom Window Treatments for Living Rooms',
    subtitle: 'Elevate your main gathering space with glare-free daylight diffusion, privacy, and architectural warmth.',
    image: '/images/hero-living-room.jpg',
    recommendations: [
      { name: 'Roller Shades (Solar & Light Filtering)', slug: 'roller-shades', price: 89, desc: 'Cuts afternoon television glare without losing exterior tree views.' },
      { name: 'Hunter Douglas Silhouette', slug: 'hunter-douglas-silhouette', price: 280, desc: 'Transforms harsh sunlight into ambient glow with floating sheer vanes.' },
      { name: 'Natural Hardwood Blinds', slug: 'wood-blinds', price: 95, desc: 'Rich organic wood texture for classic colonial and modern living rooms.' }
    ],
    tips: [
      'Choose light-filtering fabrics to preserve natural illumination while protecting furniture from UV fading.',
      'Consider motorized control for wide picture windows or hard-to-reach openings.',
      'Layer with custom drapery side panels for acoustic softening and added luxury.'
    ]
  },
  'bedroom': {
    title: 'Custom Window Treatments for Bedrooms & Nurseries',
    subtitle: 'Achieve total room darkening, thermal insulation, and peaceful sleep with 100% blackout treatments.',
    image: '/images/cat-roman.jpg',
    recommendations: [
      { name: 'Honeycomb Cellular Blackout Shades', slug: 'cellular-honeycomb-shades', price: 110, desc: 'Side-channel blackout design traps heat while blocking 99% of morning light.' },
      { name: 'Tailored Linen Roman Shades', slug: 'roman-shades', price: 120, desc: 'Blackout-lined drapery folds for soft, cozy bedroom aesthetics.' },
      { name: 'Smart PowerView Motorized Shades', slug: 'hunter-douglas-powerview-motorized', price: 350, desc: 'Set automated sunrise routines to wake up gently with natural light.' }
    ],
    tips: [
      'Always select a blackout thermal lining to block streetlamps and sunrise light.',
      'Cordless or motorized operation is essential in children\'s bedrooms for certified safety.',
      'Top-Down / Bottom-Up configuration gives privacy from street level while letting daylight in from above.'
    ]
  },
  'kitchen': {
    title: 'Custom Window Treatments for Kitchens',
    subtitle: 'Durable, easy-to-clean window coverings designed to handle steam, cooking grease, and humidity.',
    image: '/images/cat-roller.jpg',
    recommendations: [
      { name: 'Waterproof Faux Wood Blinds', slug: 'faux-wood-blinds', price: 75, desc: 'Resists steam and splatters—easily wipes clean with warm soapy water.' },
      { name: 'Solar Screen Roller Shades', slug: 'roller-shades', price: 89, desc: 'Antimicrobial wipeable fabric that blocks harsh sink-window sun glare.' }
    ],
    tips: [
      'Avoid untreated real wood or delicate silk fabrics directly behind sinks or stovetops.',
      'Faux wood composite slats never warp or mildew under kitchen humidity.',
      'Motorized control prevents touching shades with wet or food-covered hands.'
    ]
  },
  'bathroom': {
    title: 'Custom Window Treatments for Bathrooms',
    subtitle: 'Maximum privacy and 100% moisture resistance for shower, tub, and vanity window openings.',
    image: '/images/cat-wood.jpg',
    recommendations: [
      { name: 'Moisture-Resistant Faux Wood Blinds', slug: 'faux-wood-blinds', price: 75, desc: 'Engineered polymer composite that never cracks, peels, or mildews.' },
      { name: 'Composite Plantation Shutters', slug: 'plantation-shutters', price: 250, desc: 'Permanent architectural privacy with adjustable waterproof louvers.' }
    ],
    tips: [
      'Look for rust-resistant stainless steel mounting hardware in humid shower zones.',
      'Top-down bottom-up shades allow natural light while keeping the lower half obscured for total privacy.'
    ]
  },
  'home-office': {
    title: 'Custom Window Treatments for Home Offices',
    subtitle: 'Eliminate screen glare on Zoom calls and maintain comfortable focus throughout your workday.',
    image: '/images/business-meeting.jpg',
    recommendations: [
      { name: 'Solar Glare Reduction Shades', slug: 'roller-shades', price: 89, desc: 'High-tech weave cuts computer monitor glare while keeping daytime views.' },
      { name: 'Motorized Smart PowerView', slug: 'hunter-douglas-powerview-motorized', price: 350, desc: 'Adjust light levels via Apple HomeKit or Alexa without leaving your desk.' }
    ],
    tips: [
      'Solar 3%–5% openness fabrics offer the best balance of glare control and view-through.',
      'Motorization allows you to quickly adjust lighting before starting video meetings.'
    ]
  }
};

const RoomPage = ({ onOpenQuote }) => {
  const { roomSlug } = useParams();
  const room = ROOM_CONFIGS[roomSlug] || ROOM_CONFIGS['living-room'];

  return (
    <div className="content-page animate-fade-in container section">
      {/* Header */}
      <div className="catalog-header">
        <span className="trade-badge">Room-by-Room Guide</span>
        <h1>{room.title}</h1>
        <p className="catalog-subtitle">{room.subtitle}</p>
        <div className="catalog-perks">
          <span><Check size={16} /> Laser In-Home Measurement</span>
          <span><Check size={16} /> Tailored to Room Lighting</span>
          <span><Check size={16} /> 100% Perfect Fit</span>
        </div>
      </div>

      {/* Hero Visual */}
      <div className="about-story-grid" style={{ marginBottom: 'var(--spacing-16)' }}>
        <div className="about-story-image">
          <img src={room.image} alt={room.title} />
        </div>
        <div className="about-story-content">
          <h2>Design Considerations for This Room</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none', margin: '16px 0' }}>
            {room.tips.map((tip, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', color: 'var(--color-secondary-text)' }}>
                <CheckCircle2 size={18} color="var(--color-accent-premium)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--spacing-6)' }}>
            <button className="btn btn-primary btn-large" onClick={onOpenQuote}>
              Get Free Quote for This Room
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products Grid */}
      <section className="section">
        <h2 style={{ marginBottom: 'var(--spacing-8)', textAlign: 'center' }}>Top Recommended Treatments</h2>
        <div className="catalog-grid">
          {room.recommendations.map(rec => (
            <div key={rec.slug} className="product-card">
              <div className="product-card-body">
                <h3 className="product-card-title">
                  <Link to={`/products/${rec.slug}`}>{rec.name}</Link>
                </h3>
                <p className="product-card-desc">{rec.desc}</p>
                <div className="product-card-footer">
                  <span className="price-value">${rec.price}</span>
                  <Link to={`/products/${rec.slug}`} className="btn btn-secondary btn-sm">
                    Customize <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoomPage;
