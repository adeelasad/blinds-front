import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { store } from '../database/inMemoryStore.js';
import { authenticateCustomer } from '../middleware/auth.js';
import { sendBookingConfirmation, sendSampleConfirmationEmail } from '../services/emailService.js';

const router = express.Router();

// Apply customer JWT auth middleware to all routes
router.use(authenticateCustomer);

// ==============================================================================
// 1. PROFILE MANAGEMENT
// ==============================================================================

// GET /api/customer/profile
router.get('/profile', async (req, res) => {
  try {
    const customer = store.customers.find(c => c.id === req.customer.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer profile not found.' });
    }

    res.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        is_verified: customer.is_verified,
        created_at: customer.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile.' });
  }
});

// PUT /api/customer/profile
router.put('/profile', async (req, res) => {
  try {
    const { first_name, last_name, phone, address, city, state, zip } = req.body;
    const customer = store.customers.find(c => c.id === req.customer.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer profile not found.' });
    }

    if (first_name) customer.first_name = first_name;
    if (last_name) customer.last_name = last_name;
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (city !== undefined) customer.city = city;
    if (state !== undefined) customer.state = state;
    if (zip !== undefined) customer.zip = zip;

    if (supabase) {
      await supabase.from('customers').update({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip
      }).eq('id', customer.id);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

// PUT /api/customer/password
router.put('/password', async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password || new_password.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    }

    const customer = store.customers.find(c => c.id === req.customer.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer profile not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    customer.password_hash = await bcrypt.hash(new_password, salt);

    if (supabase) {
      await supabase.from('customers').update({ password_hash: customer.password_hash }).eq('id', customer.id);
    }

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update password.' });
  }
});

// ==============================================================================
// 2. ORDERS & PROJECT TIMELINES
// ==============================================================================

// GET /api/customer/orders - Orders list with status timeline
router.get('/orders', async (req, res) => {
  try {
    const customerId = req.customer.id;
    let orders = store.customer_orders.filter(o => o.customer_id === customerId);

    // If no orders yet, populate sample order for rich dashboard visualization
    if (orders.length === 0) {
      orders = [
        {
          id: `ord-${Date.now()}`,
          customer_id: customerId,
          product_name: 'Custom Motorized Roller Shades',
          window_count: 5,
          total_amount: 1450.00,
          deposit_amount: 725.00,
          balance_due: 725.00,
          status: 'in-production',
          timeline: [
            { step: 'Consultation Scheduled', date: '2026-08-15', done: true },
            { step: 'Quote Sent', date: '2026-08-18', done: true },
            { step: 'Deposit Paid', date: '2026-08-20', done: true },
            { step: 'In Production', date: '2026-08-22', done: true, current: true },
            { step: 'Installation Scheduled', date: '2026-09-08', done: false },
            { step: 'Completed', date: 'Pending', done: false }
          ],
          created_at: new Date().toISOString()
        }
      ];
      store.customer_orders.push(...orders);
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve orders.' });
  }
});

// GET /api/customer/orders/:id
router.get('/orders/:id', (req, res) => {
  const order = store.customer_orders.find(o => o.id === req.params.id && o.customer_id === req.customer.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }
  res.json({ success: true, order });
});

// ==============================================================================
// 3. CONSULTATIONS & APPOINTMENTS
// ==============================================================================

// GET /api/customer/consultations
router.get('/consultations', (req, res) => {
  try {
    const customerId = req.customer.id;
    let consultations = store.customer_consultations.filter(c => c.customer_id === customerId);

    // Fallback sample consultation
    if (consultations.length === 0) {
      consultations = [
        {
          id: `cons-${Date.now()}`,
          customer_id: customerId,
          booking_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          booking_time: '11:00 AM',
          address: req.customer.address || 'Gaithersburg, MD',
          status: 'scheduled',
          installer_name: 'Marcus Taylor (Lead DMV Specialist)',
          installer_phone: '(240) 555-0142',
          created_at: new Date().toISOString()
        }
      ];
      store.customer_consultations.push(...consultations);
    }

    res.json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch consultations.' });
  }
});

// POST /api/customer/consultations - Book new consultation
router.post('/consultations', async (req, res) => {
  try {
    const { date, time, address, notes, window_count } = req.body;
    const customer = store.customers.find(c => c.id === req.customer.id) || req.customer;

    if (!date || !time || !address) {
      return res.status(400).json({ success: false, error: 'Date, time, and address are required.' });
    }

    const newConsultation = {
      id: `cons-${Date.now()}`,
      customer_id: customer.id,
      booking_date: date,
      booking_time: time,
      address,
      status: 'scheduled',
      installer_name: 'Marcus Taylor',
      installer_phone: '(240) 555-0142',
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    store.customer_consultations.unshift(newConsultation);

    // Send confirmation
    sendBookingConfirmation({
      name: `${customer.first_name} ${customer.last_name || ''}`,
      email: customer.email,
      phone: customer.phone,
      date,
      time,
      address,
      window_count: window_count || '1-5 windows',
      notes
    }, customer.email).catch(e => console.error('Booking email err:', e.message));

    res.status(201).json({
      success: true,
      message: 'Consultation appointment scheduled successfully!',
      consultation: newConsultation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to schedule consultation.' });
  }
});

// ==============================================================================
// 4. QUOTES & SAMPLES
// ==============================================================================

// GET /api/customer/quotes - Review itemized quotes & pay deposit link
router.get('/quotes', (req, res) => {
  try {
    const customerId = req.customer.id;
    let quotes = store.quotes.filter(q => q.customer_id === customerId);

    if (quotes.length === 0) {
      quotes = [
        {
          id: `quote-${Date.now().toString().slice(-6)}`,
          customer_id: customerId,
          product_type: 'Tailored Roman Shades & Wood Blinds',
          window_count: 6,
          unit_price: 215.00,
          total_price: 1290.00,
          deposit_amount: 645.00,
          deposit_paid: false,
          balance_due: 645.00,
          status: 'sent',
          stripe_pay_url: `https://checkout.stripe.com/pay/cs_test_mock_deposit`,
          created_at: new Date().toISOString()
        }
      ];
      store.quotes.push(...quotes);
    }

    res.json({ success: true, count: quotes.length, quotes });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch quotes.' });
  }
});

// GET /api/customer/samples
router.get('/samples', (req, res) => {
  const customerId = req.customer.id;
  const samples = store.sample_requests.filter(s => s.customer_id === customerId || s.email === req.customer.email);
  res.json({ success: true, count: samples.length, samples });
});

// POST /api/customer/samples - Request new sample from logged-in account
router.post('/samples', (req, res) => {
  const { product_name, address, zip } = req.body;
  const customer = store.customers.find(c => c.id === req.customer.id) || req.customer;

  if (!product_name) {
    return res.status(400).json({ success: false, error: 'Product name is required.' });
  }

  const sampleRecord = {
    id: `sample-${Date.now()}`,
    customer_id: customer.id,
    name: `${customer.first_name} ${customer.last_name || ''}`,
    email: customer.email,
    address: address || customer.address || 'Address On File',
    zip: zip || customer.zip || '20850',
    product_name,
    status: 'requested',
    created_at: new Date().toISOString()
  };

  store.sample_requests.unshift(sampleRecord);
  sendSampleConfirmationEmail(sampleRecord).catch(e => console.error('Sample email err:', e.message));

  res.status(201).json({
    success: true,
    message: `Sample request submitted for ${product_name}.`,
    sample: sampleRecord
  });
});

export default router;
