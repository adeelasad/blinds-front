import { STARTER_PRODUCTS } from './starterProducts.js';
import { DEFAULT_SHADES_MATRIX, DEFAULT_OPTION_UPCHARGES } from '../services/pricingMatrix.js';

// In-Memory Data Store with initial data for development
export const store = {
  categories: [
    {
      id: 'cat-1',
      slug: 'blinds',
      name: 'Custom Blinds',
      tagline: 'Faux Wood, Wood, Mini & Vertical Blinds',
      description: 'Handcrafted durable hardwood, faux wood, and modern aluminum blinds engineered for precise light and privacy control.',
      icon: '🪟',
      image: '/images/category-tiles/faux-wood.jpg',
      is_active: true,
      display_order: 1
    },
    {
      id: 'cat-2',
      slug: 'shades',
      name: 'Window Shades',
      tagline: 'Roller, Cellular, Roman, Solar & Zebra Shades',
      description: 'Elegant fabric shades offering energy-efficient insulation, UV solar shielding, and designer light diffusion.',
      icon: '☀️',
      image: '/images/category-tiles/roller.jpg',
      is_active: true,
      display_order: 2
    },
    {
      id: 'cat-3',
      slug: 'drapery',
      name: 'Custom Drapery',
      tagline: 'Tailored French Pleat, Ripplefold & Acoustic Panels',
      description: 'Floor-to-ceiling handcrafted drapery in Belgian linen, silk, velvet, and acoustic blackout thermal linings.',
      icon: '✨',
      image: '/images/product-main.jpg',
      is_active: true,
      display_order: 3
    },
    {
      id: 'cat-4',
      slug: 'shutters',
      name: 'Plantation Shutters',
      tagline: 'Hardwood & Polywood Interior Shutters',
      description: 'Timeless architectural plantation shutters crafted from premium North American hardwoods and composite polywood.',
      icon: '🏡',
      image: '/images/category-tiles/wood-blinds.jpg',
      is_active: true,
      display_order: 4
    },
    {
      id: 'cat-5',
      slug: 'motorized',
      name: 'Smart Motorized',
      tagline: 'Somfy & Smart Home Automated Shades',
      description: 'Whisper-quiet motorized window treatments with voice, remote, app scheduling, and smart home automation.',
      icon: '⚡',
      image: '/images/hero-business.jpg',
      is_active: true,
      display_order: 5
    },
    {
      id: 'cat-6',
      slug: 'outdoor',
      name: 'Outdoor & Patio',
      tagline: 'Exterior Solar Screens & Patio Shades',
      description: 'Heavy-duty weather-resistant outdoor shades and patio solar screens engineered to block heat, glare, and insects.',
      icon: '🌿',
      image: '/images/category-tiles/outdoor-solar.jpg',
      is_active: true,
      display_order: 6
    }
  ],

  products: STARTER_PRODUCTS.map((p, idx) => ({
    id: `prod-${idx + 1}`,
    is_active: true,
    ...p,
    created_at: new Date().toISOString()
  })),

  customers: [
    {
      id: 'cust-adeel',
      email: 'asad.adeel@gmail.com',
      password_hash: '$2a$10$wE977gZqV7k9m1cQq3/Aexy7Q7x9F8e3K1v4O0q0v5a7c9b1d3e5',
      first_name: 'Adeel',
      last_name: 'Asad',
      phone: '(301) 555-0199',
      address: 'Gaithersburg Operations Hub',
      city: 'Gaithersburg',
      state: 'MD',
      zip: '20877',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      is_verified: true,
      reset_token: null,
      reset_token_expires: null
    }
  ],

  leads: [
    {
      id: 'lead-1',
      customer_id: null,
      name: 'Sarah Jenkins',
      phone: '(301) 555-0192',
      email: 'sarah.j@example.com',
      address: '450 North Washington St',
      city: 'Rockville',
      zip: '20850',
      source: 'google',
      status: 'new',
      notes: 'Interested in motorized roller shades for 8 south-facing windows.',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'rockville-blinds-2026',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'lead-2',
      customer_id: null,
      name: 'Michael Chen',
      phone: '(240) 555-0144',
      email: 'mchen@example.com',
      address: '11200 Seven Locks Rd',
      city: 'Potomac',
      zip: '20854',
      source: 'facebook',
      status: 'contacted',
      notes: 'Requested wood blinds consultation for master suite and living room.',
      utm_source: 'facebook',
      utm_medium: 'social',
      utm_campaign: 'potomac-luxury-shades',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'lead-3',
      customer_id: null,
      name: 'David Miller (Architect)',
      phone: '(703) 555-0178',
      email: 'dmiller@designstudio.com',
      address: '2200 Clarendon Blvd',
      city: 'Arlington',
      zip: '22201',
      source: 'website',
      status: 'quoted',
      notes: 'Commercial spec for office building conference room.',
      utm_source: 'direct',
      utm_medium: 'organic',
      utm_campaign: 'trade-program',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ],

  bookings: [
    {
      id: 'book-1',
      lead_id: 'lead-1',
      customer_id: null,
      name: 'Sarah Jenkins',
      phone: '(301) 555-0192',
      email: 'sarah.j@example.com',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '10:00 AM',
      address: '450 North Washington St, Rockville, MD 20850',
      room_count: '3 rooms',
      window_count: '8 windows',
      notes: 'Focus on living room and kitchen light control.',
      status: 'scheduled',
      installer_id: 'inst-1',
      created_at: new Date().toISOString()
    }
  ],

  quotes: [
    {
      id: 'quote-1',
      lead_id: 'lead-3',
      customer_id: null,
      booking_id: null,
      customer_name: 'David Miller',
      customer_email: 'dmiller@designstudio.com',
      window_count: 6,
      product_type: 'Hunter Douglas PowerView Motorized',
      width: 48,
      height: 72,
      quantity: 6,
      unit_price: 450.00,
      margin_percent: 35.00,
      total_price: 2700.00,
      deposit_amount: 1350.00,
      deposit_paid: false,
      balance_due: 1350.00,
      status: 'sent',
      pdf_url: null,
      created_at: new Date().toISOString()
    }
  ],

  jobs: [
    {
      id: 'job-1',
      booking_id: 'book-1',
      quote_id: 'quote-1',
      installer_id: 'inst-1',
      customer_name: 'Sarah Jenkins',
      address: '450 North Washington St, Rockville, MD',
      product_type: 'Roller Shades (8 Windows)',
      status: 'in-progress',
      checklist_arrived: true,
      checklist_measured: true,
      checklist_installed: false,
      checklist_cleaned: false,
      checklist_photos: [],
      notes: 'Inside mount. Ensure cordless tension is calibrated.',
      completed_at: null
    }
  ],

  sample_requests: [
    {
      id: 'sample-1',
      customer_id: null,
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      address: '8200 Wisconsin Ave, Apt 14B',
      zip: '20814',
      product_name: 'Tailored Roman Shades',
      status: 'requested',
      created_at: new Date().toISOString()
    }
  ],

  gallery: [
    {
      id: 'gal-1',
      job_id: null,
      before_image_url: '/images/hero-living-room.jpg',
      after_image_url: '/images/cat-roller.jpg',
      room_type: 'Living Room',
      product_used: 'Custom Roller Shades in Warm Gray',
      city: 'Bethesda, MD',
      published: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'gal-2',
      job_id: null,
      before_image_url: '/images/hero-business.jpg',
      after_image_url: '/images/product-main.jpg',
      room_type: 'Master Suite',
      product_used: 'Hunter Douglas Silhouette Sheer Vanes',
      city: 'Potomac, MD',
      published: true,
      created_at: new Date().toISOString()
    }
  ],

  installers: [
    { id: 'inst-1', name: 'Marcus Taylor (Lead DMV Installer)', email: 'marcus.t@luminablinds.com', phone: '(240) 555-0142', active: true },
    { id: 'inst-2', name: 'Dave Kowalski (Master Tech - Northern VA)', email: 'dave.k@luminablinds.com', phone: '(703) 555-0188', active: true }
  ],

  customer_orders: [],
  customer_consultations: [],
  email_logs: [],

  // Matrix Pricing Engine
  pricing_matrices: {
    shades: JSON.parse(JSON.stringify(DEFAULT_SHADES_MATRIX)),
    blinds: JSON.parse(JSON.stringify(DEFAULT_SHADES_MATRIX)),
    drapery: JSON.parse(JSON.stringify(DEFAULT_SHADES_MATRIX)),
    shutters: JSON.parse(JSON.stringify(DEFAULT_SHADES_MATRIX))
  },

  option_upcharges: JSON.parse(JSON.stringify(DEFAULT_OPTION_UPCHARGES))
};
