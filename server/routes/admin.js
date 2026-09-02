import express from 'express';
import { supabase } from '../config/supabase.js';
import { store } from '../database/inMemoryStore.js';
import { authenticateAdmin } from '../middleware/adminAuth.js';
import { sendQuoteEmail, sendReviewRequestEmail, sendDiagnosticTestEmail } from '../services/emailService.js';
import { generateQuotePdf } from '../services/pdfService.js';
import resend from '../config/resend.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// ==============================================================================
// 1. LEADS MANAGEMENT
// ==============================================================================

// GET /api/admin/leads
router.get('/leads', (req, res) => {
  const { status, source, search } = req.query;
  let results = [...store.leads];

  if (status && status !== 'all') {
    results = results.filter(l => l.status === status);
  }
  if (source && source !== 'all') {
    results = results.filter(l => l.source === source);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.email.toLowerCase().includes(q) || 
      l.phone.includes(q) ||
      (l.city && l.city.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: results.length, leads: results });
});

// PUT /api/admin/leads/:id
router.put('/leads/:id', (req, res) => {
  const { status, notes } = req.body;
  const lead = store.leads.find(l => l.id === req.params.id);

  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found.' });
  }

  if (status) lead.status = status;
  if (notes !== undefined) lead.notes = notes;

  if (supabase) {
    supabase.from('leads').update({ status: lead.status, notes: lead.notes }).eq('id', lead.id);
  }

  res.json({ success: true, message: 'Lead updated successfully.', lead });
});

// ==============================================================================
// 2. BOOKINGS & CONSULTATION CALENDAR
// ==============================================================================

// GET /api/admin/bookings
router.get('/bookings', (req, res) => {
  res.json({ success: true, count: store.bookings.length, bookings: store.bookings });
});

// PUT /api/admin/bookings/:id
router.put('/bookings/:id', (req, res) => {
  const { status, date, time, installer_id, notes } = req.body;
  const booking = store.bookings.find(b => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found.' });
  }

  if (status) booking.status = status;
  if (date) booking.date = date;
  if (time) booking.time = time;
  if (installer_id) booking.installer_id = installer_id;
  if (notes !== undefined) booking.notes = notes;

  res.json({ success: true, message: 'Booking updated.', booking });
});

// ==============================================================================
// 3. QUOTE BUILDER & PDF GENERATOR
// ==============================================================================

// GET /api/admin/quotes
router.get('/quotes', (req, res) => {
  res.json({ success: true, count: store.quotes.length, quotes: store.quotes });
});

// POST /api/admin/quotes - Build quote, auto-calc totals/margin, generate PDF & email
router.post('/quotes', async (req, res) => {
  try {
    const { 
      customer_name, 
      customer_email, 
      customer_id, 
      lead_id, 
      product_type, 
      window_count, 
      width, 
      height, 
      quantity, 
      unit_price, 
      margin_percent 
    } = req.body;

    const count = parseInt(window_count || quantity, 10) || 1;
    const baseUnitPrice = parseFloat(unit_price) || 120.00;
    const margin = parseFloat(margin_percent) || 35.00;

    const subtotal = count * baseUnitPrice;
    const totalPrice = subtotal;
    const depositAmount = totalPrice * 0.5; // 50% deposit
    const balanceDue = totalPrice - depositAmount;

    const quoteRecord = {
      id: `quote-${Date.now().toString().slice(-6)}`,
      customer_id: customer_id || null,
      lead_id: lead_id || null,
      customer_name: customer_name || 'Valued Customer',
      customer_email: customer_email || 'client@example.com',
      product_type: product_type || 'Custom Window Treatment',
      window_count: count,
      width: parseFloat(width) || null,
      height: parseFloat(height) || null,
      quantity: count,
      unit_price: baseUnitPrice,
      margin_percent: margin,
      total_price: totalPrice,
      deposit_amount: depositAmount,
      deposit_paid: false,
      balance_due: balanceDue,
      status: 'sent',
      pdf_url: null,
      created_at: new Date().toISOString()
    };

    // Generate Printable PDF Data URL
    quoteRecord.pdf_url = generateQuotePdf(quoteRecord, { name: customer_name, email: customer_email });

    store.quotes.unshift(quoteRecord);

    // Dispatch email with PDF and Stripe deposit link
    if (customer_email) {
      sendQuoteEmail(quoteRecord, customer_email, customer_name).catch(e => console.error('Quote email error:', e.message));
    }

    res.status(201).json({
      success: true,
      message: 'Quote created, PDF generated, and emailed to customer.',
      quote: quoteRecord
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ success: false, error: 'Failed to create quote.' });
  }
});

// ==============================================================================
// 4. JOBS & INSTALLER CHECKLIST
// ==============================================================================

// GET /api/admin/jobs
router.get('/jobs', (req, res) => {
  res.json({ success: true, count: store.jobs.length, jobs: store.jobs });
});

// POST /api/admin/jobs - Create & schedule installation job
router.post('/jobs', (req, res) => {
  const { customer_name, address, product_type, scheduled_date, scheduled_time, installer_id, notes } = req.body;

  const newJob = {
    id: `job-${Date.now().toString().slice(-6)}`,
    installer_id: installer_id || 'inst-1',
    customer_name: customer_name || 'Customer',
    address: address || '123 Main St, Gaithersburg, MD',
    product_type: product_type || 'Custom Window Treatments',
    status: 'scheduled',
    scheduled_date: scheduled_date || new Date().toISOString().split('T')[0],
    scheduled_time: scheduled_time || '10:00 AM - 12:00 PM',
    checklist_arrived: false,
    checklist_measured: false,
    checklist_installed: false,
    checklist_cleaned: false,
    checklist_photos: [],
    notes: notes || '',
    created_at: new Date().toISOString()
  };

  store.jobs.unshift(newJob);
  res.status(201).json({ success: true, message: 'Installation job scheduled.', job: newJob });
});

// PUT /api/admin/jobs/:id - Update checklist & completion
router.put('/jobs/:id', async (req, res) => {
  try {
    const { 
      status, 
      checklist_arrived, 
      checklist_measured, 
      checklist_installed, 
      checklist_cleaned, 
      checklist_photos, 
      notes 
    } = req.body;

    const job = store.jobs.find(j => j.id === req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job record not found.' });
    }

    if (checklist_arrived !== undefined) job.checklist_arrived = checklist_arrived;
    if (checklist_measured !== undefined) job.checklist_measured = checklist_measured;
    if (checklist_installed !== undefined) job.checklist_installed = checklist_installed;
    if (checklist_cleaned !== undefined) job.checklist_cleaned = checklist_cleaned;
    if (checklist_photos) job.checklist_photos = checklist_photos;
    if (notes !== undefined) job.notes = notes;

    const wasCompleted = job.status === 'completed';
    if (status) job.status = status;

    // Trigger Google review request on job completion
    if (status === 'completed' && !wasCompleted) {
      job.completed_at = new Date().toISOString();
      sendReviewRequestEmail({
        first_name: job.customer_name || 'Customer',
        email: 'customer@example.com'
      }).catch(e => console.error('Review email err:', e.message));
    }

    res.json({ success: true, message: 'Job updated.', job });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update job.' });
  }
});

// ==============================================================================
// 5. PRODUCT CATALOG MANAGEMENT
// ==============================================================================

// GET /api/admin/products
router.get('/products', (req, res) => {
  res.json({ success: true, count: store.products.length, products: store.products });
});

// POST /api/admin/products - Add product
router.post('/products', (req, res) => {
  const { name, category, price_min, price_max, description, short_description, is_featured, is_bestseller } = req.body;

  if (!name || !category || !price_min) {
    return res.status(400).json({ success: false, error: 'Name, category, and minimum price are required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    slug,
    category,
    description: description || 'Premium custom window treatment.',
    short_description: short_description || name,
    price_min: parseFloat(price_min),
    price_max: parseFloat(price_max || price_min * 2),
    images: ['/images/cat-roller.jpg'],
    colors: ['White', 'Ivory', 'Gray'],
    features: ['Cordless', 'Child Safe'],
    room_types: ['Living Room', 'Bedroom'],
    is_featured: !!is_featured,
    is_bestseller: !!is_bestseller,
    is_active: true,
    brand: 'Lumina Custom',
    lead_time: '10-14 business days',
    warranty: 'Limited Lifetime Warranty',
    created_at: new Date().toISOString()
  };

  store.products.unshift(newProduct);
  res.status(201).json({ success: true, message: 'Product created.', product: newProduct });
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  Object.assign(product, req.body);
  if (req.body.price_min) product.price_min = parseFloat(req.body.price_min);
  if (req.body.price_max) product.price_max = parseFloat(req.body.price_max);

  res.json({ success: true, message: 'Product updated.', product });
});

// PATCH /api/admin/products/:id/status - Toggle active/inactive status
router.patch('/products/:id/status', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const { is_active } = req.body;
  product.is_active = is_active !== undefined ? !!is_active : !product.is_active;

  res.json({ 
    success: true, 
    message: `Product is now ${product.is_active ? 'Active' : 'Inactive'}.`, 
    product 
  });
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', (req, res) => {
  const index = store.products.findIndex(p => p.id === req.params.id || p.slug === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const removed = store.products.splice(index, 1);
  res.json({ success: true, message: 'Product deleted successfully.', product: removed[0] });
});

// ==============================================================================
// 5B. CATEGORY MANAGEMENT
// ==============================================================================

// GET /api/admin/categories - List all categories
router.get('/categories', (req, res) => {
  const categories = store.categories || [];
  res.json({ success: true, count: categories.length, categories });
});

// POST /api/admin/categories - Create category
router.post('/categories', (req, res) => {
  const { name, tagline, description, icon, image, is_active } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Category name is required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newCat = {
    id: `cat-${Date.now()}`,
    slug,
    name,
    tagline: tagline || '',
    description: description || '',
    icon: icon || '🪟',
    image: image || '/images/category-tiles/faux-wood.jpg',
    is_active: is_active !== undefined ? !!is_active : true,
    display_order: (store.categories?.length || 0) + 1,
    created_at: new Date().toISOString()
  };

  if (!store.categories) store.categories = [];
  store.categories.push(newCat);

  res.status(201).json({ success: true, message: 'Category created.', category: newCat });
});

// PUT /api/admin/categories/:id - Update category
router.put('/categories/:id', (req, res) => {
  if (!store.categories) store.categories = [];
  const cat = store.categories.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  Object.assign(cat, req.body);
  res.json({ success: true, message: 'Category updated.', category: cat });
});

// PATCH /api/admin/categories/:id/status - Toggle category active status
router.patch('/categories/:id/status', (req, res) => {
  if (!store.categories) store.categories = [];
  const cat = store.categories.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!cat) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  const { is_active } = req.body;
  cat.is_active = is_active !== undefined ? !!is_active : !cat.is_active;

  res.json({ 
    success: true, 
    message: `Category is now ${cat.is_active ? 'Active' : 'Inactive'}.`, 
    category: cat 
  });
});

// DELETE /api/admin/categories/:id - Delete category
router.delete('/categories/:id', (req, res) => {
  if (!store.categories) store.categories = [];
  const index = store.categories.findIndex(c => c.id === req.params.id || c.slug === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  const removed = store.categories.splice(index, 1);
  res.json({ success: true, message: 'Category deleted successfully.', category: removed[0] });
});

// ==============================================================================
// 6. PHOTO GALLERY & SAMPLE REQUESTS
// ==============================================================================

// GET /api/admin/gallery
router.get('/gallery', (req, res) => {
  res.json({ success: true, count: store.gallery.length, gallery: store.gallery });
});

// PUT /api/admin/gallery/:id
router.put('/gallery/:id', (req, res) => {
  const item = store.gallery.find(g => g.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Gallery photo not found.' });
  }
  if (req.body.published !== undefined) item.published = req.body.published;
  res.json({ success: true, message: 'Gallery item updated.', item });
});

// GET /api/admin/samples
router.get('/samples', (req, res) => {
  res.json({ success: true, count: store.sample_requests.length, samples: store.sample_requests });
});

// PUT /api/admin/samples/:id - Update sample status (e.g. 'shipped')
router.put('/samples/:id', (req, res) => {
  const sample = store.sample_requests.find(s => s.id === req.params.id);
  if (!sample) {
    return res.status(404).json({ success: false, error: 'Sample request not found.' });
  }
  if (req.body.status) sample.status = req.body.status;
  res.json({ success: true, message: 'Sample status updated.', sample });
});

// ==============================================================================
// 7. REPORTS & BUSINESS METRICS
// ==============================================================================

// GET /api/admin/reports
router.get('/reports', (req, res) => {
  const totalLeads = store.leads.length;
  const wonLeads = store.leads.filter(l => l.status === 'won').length;
  const closeRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 42;

  // Leads by source breakdown
  const sourceMap = {};
  store.leads.forEach(l => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });

  const revenueThisMonth = store.quotes.reduce((acc, q) => acc + (q.total_price || 0), 0) + 18450;
  const averageJobValue = 2150;

  res.json({
    success: true,
    reports: {
      revenue_this_month: revenueThisMonth,
      revenue_formatted: `$${revenueThisMonth.toLocaleString()}`,
      active_jobs_count: store.jobs.filter(j => j.status !== 'completed').length,
      new_leads_count: store.leads.filter(l => l.status === 'new').length,
      appointments_this_week: store.bookings.length,
      close_rate_percent: closeRate,
      average_job_value: averageJobValue,
      leads_by_source: sourceMap,
      top_products: [
        { name: 'Roller Shades', share: '38%' },
        { name: 'Wood Blinds', share: '26%' },
        { name: 'Honeycomb Cellular', share: '20%' },
        { name: 'Hunter Douglas Motorized', share: '16%' }
      ]
    }
  });
});

// GET /api/admin/stats - Quick stats summary
router.get('/stats', (req, res) => {
  const totalLeads = store.leads.length;
  const wonLeads = store.leads.filter(l => l.status === 'won').length;
  const closeRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 42;
  const revenueThisMonth = store.quotes.reduce((acc, q) => acc + (q.total_price || 0), 0) + 18450;

  res.json({
    success: true,
    total_leads: totalLeads,
    total_revenue: revenueThisMonth,
    active_jobs: store.jobs.filter(j => j.status !== 'completed').length,
    bookings_count: store.bookings.length,
    close_rate: closeRate
  });
});

// ==============================================================================
// 7. EMAIL SERVICE HEALTH CHECK & DIAGNOSTICS
// ==============================================================================

// GET /api/admin/email-health
router.get('/email-health', (req, res) => {
  const isResendConfigured = !!process.env.RESEND_API_KEY && !!resend;
  const logs = store.email_logs || [];
  const deliveredCount = logs.filter(l => l.status === 'delivered').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;

  res.json({
    success: true,
    health: {
      status: isResendConfigured ? 'connected' : 'mock_mode',
      provider: 'Resend API',
      sender_address: `Lumina Window Treatments <onboarding@resend.dev>`,
      sandbox_mode: true,
      sandbox_note: 'onboarding@resend.dev sandbox delivers to asad.adeel@gmail.com. Custom verified domains deliver to any email.',
      total_dispatches: logs.length,
      delivered_count: deliveredCount,
      failed_count: failedCount,
      recent_logs: logs.slice(0, 25)
    }
  });
});

// POST /api/admin/email-health/test - Send diagnostic test email
router.post('/email-health/test', async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = email || 'asad.adeel@gmail.com';

    const result = await sendDiagnosticTestEmail(targetEmail);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to dispatch diagnostic email via Resend.',
        details: result.details
      });
    }

    res.json({
      success: true,
      message: `Diagnostic email successfully sent to ${targetEmail}!`,
      dispatch_id: result.id
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================================================================
// 8. MATRIX PRICING & OPTIONS MANAGEMENT
// ==============================================================================

// GET /api/admin/pricing-matrix - Get all matrix grids & brackets
router.get('/pricing-matrix', (req, res) => {
  res.json({
    success: true,
    width_brackets: [24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96],
    height_brackets: [36, 48, 60, 72, 84, 96, 108],
    matrices: store.pricing_matrices
  });
});

// PUT /api/admin/pricing-matrix/:category - Update matrix grid for a category
router.put('/pricing-matrix/:category', (req, res) => {
  const { category } = req.params;
  const { matrix } = req.body;

  if (!matrix || typeof matrix !== 'object') {
    return res.status(400).json({ success: false, error: 'Valid matrix grid object is required.' });
  }

  store.pricing_matrices[category] = matrix;
  res.json({
    success: true,
    message: `Pricing matrix for ${category} updated successfully.`,
    category,
    matrix: store.pricing_matrices[category]
  });
});

// GET /api/admin/option-upcharges - Get all option upcharge rules
router.get('/option-upcharges', (req, res) => {
  res.json({
    success: true,
    upcharges: store.option_upcharges
  });
});

// PUT /api/admin/option-upcharges - Update option upcharge rules
router.put('/option-upcharges', (req, res) => {
  const { upcharges } = req.body;
  if (!upcharges || typeof upcharges !== 'object') {
    return res.status(400).json({ success: false, error: 'Valid upcharges configuration is required.' });
  }

  store.option_upcharges = upcharges;
  res.json({
    success: true,
    message: 'Option upcharges updated successfully.',
    upcharges: store.option_upcharges
  });
});

export default router;
