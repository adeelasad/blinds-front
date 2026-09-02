import express from 'express';
import { supabase } from '../config/supabase.js';
import { store } from '../database/inMemoryStore.js';
import { STARTER_PRODUCTS } from '../database/starterProducts.js';
import { calculateMatrixPrice } from '../services/pricingMatrix.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';
import { 
  sendNewLeadAlert, 
  sendBookingConfirmation, 
  sendSampleConfirmationEmail,
  sendLeadConfirmationToCustomer
} from '../services/emailService.js';

const router = express.Router();

// ==============================================================================
// 1. LEADS & CONTACT ENDPOINTS
// ==============================================================================

// POST /api/leads - Create new lead & alert owner + customer
router.post('/leads', submissionLimiter, async (req, res) => {
  try {
    const { name, phone, email, address, zip, city, source, notes, utm_source, utm_medium, utm_campaign } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, error: 'Name, phone, and email are required.' });
    }

    const leadRecord = {
      id: `lead-${Date.now()}`,
      name,
      phone,
      email,
      address: address || '',
      zip: zip || '',
      city: city || 'Gaithersburg',
      source: source || 'website',
      status: 'new',
      notes: notes || '',
      utm_source: utm_source || req.query.utm_source || 'direct',
      utm_medium: utm_medium || req.query.utm_medium || 'none',
      utm_campaign: utm_campaign || req.query.utm_campaign || 'none',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('leads').insert([leadRecord]).select().single();
      if (!error && data) {
        Object.assign(leadRecord, data);
      }
    }

    // Keep in local store
    store.leads.unshift(leadRecord);

    // Send email alert to business owner via Resend
    sendNewLeadAlert(leadRecord).catch(err => console.error('Lead alert email error:', err.message));

    // Send confirmation email directly to the customer via Resend
    sendLeadConfirmationToCustomer(leadRecord).catch(err => console.error('Customer lead confirmation error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been received. Our DMV specialist will contact you shortly.',
      lead: leadRecord
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({ success: false, error: 'Failed to process lead request.' });
  }
});

// POST /api/contact - Save contact form inquiry as lead with source "website-contact"
router.post('/contact', submissionLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const leadRecord = {
      id: `lead-contact-${Date.now()}`,
      name,
      email,
      phone: phone || '(Not provided)',
      source: 'website-contact',
      status: 'new',
      notes: `[Subject: ${subject || 'General Inquiry'}] ${message}`,
      city: 'Gaithersburg',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('leads').insert([leadRecord]);
    }
    store.leads.unshift(leadRecord);

    // Email alert
    sendNewLeadAlert(leadRecord).catch(err => console.error('Contact email error:', err.message));

    res.json({
      success: true,
      message: 'Thank you for reaching out! A Lumina specialist will respond within 2 business hours.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit contact message.' });
  }
});

// ==============================================================================
// 2. BOOKINGS & IN-HOME CONSULTATIONS
// ==============================================================================

// POST /api/bookings - Schedule consultation, send confirmation & alert owner
router.post('/bookings', submissionLimiter, async (req, res) => {
  try {
    const { name, email, phone, date, time, address, room_count, window_count, notes, customer_id } = req.body;

    if (!name || !phone || !date || !time || !address) {
      return res.status(400).json({ success: false, error: 'Name, phone, date, time, and service address are required.' });
    }

    const bookingRecord = {
      id: `book-${Date.now()}`,
      customer_id: customer_id || null,
      name,
      email,
      phone,
      date,
      time,
      address,
      room_count: room_count || '1-3 rooms',
      window_count: window_count || '1-5 windows',
      notes: notes || '',
      status: 'scheduled',
      installer_id: 'inst-1',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('bookings').insert([bookingRecord]).select().single();
      if (!error && data) {
        Object.assign(bookingRecord, data);
      }
    }
    store.bookings.unshift(bookingRecord);

    // Also auto-create a lead record if not existing
    const leadRecord = {
      id: `lead-book-${Date.now()}`,
      name,
      phone,
      email: email || 'consultation@customer.com',
      address,
      source: 'website',
      status: 'contacted',
      notes: `Booked in-home consultation for ${date} at ${time}. Scope: ${window_count || '1-5'} windows.`,
      created_at: new Date().toISOString()
    };
    store.leads.unshift(leadRecord);

    // Trigger emails via Resend
    sendBookingConfirmation(bookingRecord, email).catch(err => console.error('Booking email error:', err.message));

    res.status(201).json({
      success: true,
      message: `Your in-home consultation has been confirmed for ${date} at ${time}!`,
      booking: bookingRecord
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: 'Failed to schedule consultation.' });
  }
});

// ==============================================================================
// 3. SAMPLE REQUESTS
// ==============================================================================

// POST /api/samples - Save sample request & send confirmation
router.post('/samples', submissionLimiter, async (req, res) => {
  try {
    const { name, email, address, zip, product_name, colors, opacity, notes, customer_id } = req.body;

    if (!name || !email || !address || !zip || !product_name) {
      return res.status(400).json({ success: false, error: 'Name, email, shipping address, zip, and product are required.' });
    }

    const sampleRecord = {
      id: `sample-${Date.now()}`,
      customer_id: customer_id || null,
      name,
      email,
      address,
      zip,
      product_name,
      colors: Array.isArray(colors) && colors.length > 0 ? colors : (colors ? [colors] : ['Pure White', 'Oatmeal Linen', 'Warm Gray']),
      opacity: opacity || 'Light Filtering (Soft Ambient Diffusion)',
      notes: notes || '',
      status: 'requested',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('sample_requests').insert([sampleRecord]);
    }
    store.sample_requests.unshift(sampleRecord);

    // Send customer sample confirmation email
    sendSampleConfirmationEmail(sampleRecord).catch(err => console.error('Sample email error:', err.message));

    res.status(201).json({
      success: true,
      message: `Your free swatch kit for ${product_name} is on its way!`,
      sample: sampleRecord
    });
  } catch (error) {
    console.error('Error requesting sample:', error);
    res.status(500).json({ success: false, error: 'Failed to request sample swatches.' });
  }
});

// ==============================================================================
// 4. PRODUCTS & CATEGORIES
// ==============================================================================

// GET /api/categories - List active categories
router.get('/categories', (req, res) => {
  const categories = (store.categories || []).filter(c => c.is_active !== false);
  res.json({ success: true, count: categories.length, categories });
});

// GET /api/products - List active products with rich filtering
router.get('/products', async (req, res) => {
  try {
    const { category, featured, bestseller, room, feature, search } = req.query;

    let productsList = store.products;

    if (supabase) {
      try {
        let query = supabase.from('products').select('*').eq('is_active', true);
        if (category && category !== 'all') query = query.eq('category', category);
        if (featured === 'true') query = query.eq('is_featured', true);
        if (bestseller === 'true') query = query.eq('is_bestseller', true);
        
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          productsList = data;
        }
      } catch (e) {
        console.warn('Supabase query failed, falling back to in-memory starter products.');
      }
    }

    // Apply in-memory filters
    let results = productsList.filter(p => p.is_active !== false);

    if (category && category !== 'all') {
      results = results.filter(p => p.category === category || (category === 'blinds' && p.category === 'blinds'));
    }

    if (featured === 'true') {
      results = results.filter(p => p.is_featured === true);
    }

    if (bestseller === 'true') {
      results = results.filter(p => p.is_bestseller === true);
    }

    if (room && room !== 'all') {
      results = results.filter(p => p.room_types && p.room_types.some(r => r.toLowerCase().includes(room.toLowerCase())));
    }

    if (feature && feature !== 'all') {
      results = results.filter(p => p.features && p.features.some(f => f.toLowerCase().includes(feature.toLowerCase())));
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: results.length,
      products: results
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products.' });
  }
});

// GET /api/products/:slug - Single product detail
router.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    let product = store.products.find(p => p.slug === slug);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (!error && data) {
          product = data;
        }
      } catch (e) {
        // Fall back to memory
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    // Related products (same category)
    const related = store.products
      .filter(p => p.category === product.category && p.slug !== product.slug)
      .slice(0, 3);

    res.json({
      success: true,
      product,
      related
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve product details.' });
  }
});

// ==============================================================================
// 5. ESTIMATE CALCULATOR
// ==============================================================================

// POST /api/estimate - Calculate instant price range based on window count & product type
router.post('/estimate', (req, res) => {
  try {
    const { window_count, product_type } = req.body;

    const count = parseInt(window_count, 10) || 1;
    const targetProduct = store.products.find(p => 
      p.slug === product_type || p.name.toLowerCase().includes(String(product_type).toLowerCase())
    ) || store.products[0];

    const minUnitPrice = targetProduct.price_min || 89;
    const maxUnitPrice = targetProduct.price_max || 240;

    const estimatedMin = Math.round(count * minUnitPrice);
    const estimatedMax = Math.round(count * maxUnitPrice);
    const depositRequired = Math.round(estimatedMin * 0.5);

    res.json({
      success: true,
      window_count: count,
      product: {
        name: targetProduct.name,
        category: targetProduct.category,
        brand: targetProduct.brand
      },
      estimate: {
        low: estimatedMin,
        high: estimatedMax,
        formatted_range: `$${estimatedMin.toLocaleString()} – $${estimatedMax.toLocaleString()}`,
        deposit_required: depositRequired,
        includes: [
          'Precision In-Home Laser Measurement (Guaranteed Fit)',
          'Custom Fabrication to Exact 1/16" Specifications',
          'Professional Master Installation & Hardware Setup',
          'Limited Lifetime Craftsmanship Warranty'
        ]
      }
    });
  } catch (error) {
    console.error('Error calculating estimate:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate estimate.' });
  }
});

// GET /api/options-config - Return active customizer options & upcharges
router.get('/options-config', (req, res) => {
  res.json({
    success: true,
    options: store.option_upcharges
  });
});

// POST /api/estimate/matrix - Calculate dynamic custom window treatment price via matrix engine
router.post('/estimate/matrix', (req, res) => {
  try {
    const {
      category = 'shades',
      width,
      height,
      lift_id,
      cassette_id,
      roll_direction_id,
      bottom_rail_id,
      warranty_id,
      quantity,
      discount_percent
    } = req.body;

    const matrixGrid = store.pricing_matrices[category] || store.pricing_matrices['shades'];
    const upchargesConfig = store.option_upcharges;

    const calculation = calculateMatrixPrice({
      width,
      height,
      lift_id,
      cassette_id,
      roll_direction_id,
      bottom_rail_id,
      warranty_id,
      quantity,
      discount_percent: discount_percent !== undefined ? discount_percent : 25
    }, matrixGrid, upchargesConfig);

    res.json({
      success: true,
      category,
      calculation
    });
  } catch (error) {
    console.error('Error calculating matrix price:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate custom matrix price.' });
  }
});

export default router;
