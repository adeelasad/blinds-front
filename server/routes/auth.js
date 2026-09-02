import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { store } from '../database/inMemoryStore.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { sendWelcomeEmail, sendPasswordResetEmail, sendNewLeadAlert } from '../services/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_lumina_blinds_dmv_2026_dev';

// Helper to generate 7-day JWT
function generateToken(customer) {
  return jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ==============================================================================
// 1. REGISTER
// ==============================================================================
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, address, city, state, zip } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, error: 'First name, last name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existing = store.customers.find(c => c.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }

    // Hash password with 10 rounds bcrypt
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const verification_token = `vt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newCustomer = {
      id: `cust-${Date.now()}`,
      email: normalizedEmail,
      password_hash,
      first_name,
      last_name,
      phone: phone || '',
      address: address || '',
      city: city || 'Gaithersburg',
      state: state || 'MD',
      zip: zip || '',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      is_verified: false,
      verification_token
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('customers').insert([newCustomer]).select().single();
        if (!error && data) {
          Object.assign(newCustomer, data);
        }
      } catch (e) {
        console.warn('Supabase customer insert warning:', e.message);
      }
    }

    store.customers.push(newCustomer);

    // Automatically create a new Lead in CRM from new registered customer
    const newLead = {
      id: `lead-${Date.now()}`,
      customer_id: newCustomer.id,
      name: `${newCustomer.first_name} ${newCustomer.last_name}`.trim(),
      email: newCustomer.email,
      phone: newCustomer.phone || '',
      address: newCustomer.address || '',
      city: newCustomer.city || 'Gaithersburg',
      zip: newCustomer.zip || '',
      source: 'website',
      status: 'new',
      notes: `New customer registered account on website (Customer ID: ${newCustomer.id})`,
      utm_source: req.body.utm_source || 'website-registration',
      utm_medium: req.body.utm_medium || 'direct',
      utm_campaign: req.body.utm_campaign || 'customer-portal-signup',
      created_at: new Date().toISOString()
    };

    store.leads.unshift(newLead);

    if (supabase) {
      try {
        await supabase.from('leads').insert([newLead]);
      } catch (e) {
        console.warn('Supabase lead auto-insert warning:', e.message);
      }
    }

    // Send owner lead alert email via Resend
    sendNewLeadAlert(newLead).catch(err => console.error('Lead alert error:', err.message));

    // Send welcome / verification email to customer
    sendWelcomeEmail(newCustomer, verification_token).catch(err => console.error('Welcome email error:', err.message));

    // Generate 7-day token
    const token = generateToken(newCustomer);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your address.',
      token,
      customer: {
        id: newCustomer.id,
        email: newCustomer.email,
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        zip: newCustomer.zip,
        is_verified: newCustomer.is_verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to create customer account.' });
  }
});

// ==============================================================================
// 2. LOGIN (Strict rate limit: max 5 attempts / 15 mins)
// ==============================================================================
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check store / Supabase
    let customer = store.customers.find(c => c.email.toLowerCase() === normalizedEmail);

    if (!customer && supabase) {
      try {
        const { data, error } = await supabase.from('customers').select('*').eq('email', normalizedEmail).single();
        if (!error && data) {
          customer = data;
          store.customers.push(customer);
        }
      } catch (e) {
        // Fallback
      }
    }

    if (!customer) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Update last login
    customer.last_login = new Date().toISOString();
    if (supabase) {
      await supabase.from('customers').update({ last_login: customer.last_login }).eq('id', customer.id);
    }

    // Generate JWT (7-day expiry)
    const token = generateToken(customer);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
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
        is_verified: customer.is_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Failed to process login.' });
  }
});

// ==============================================================================
// 3. LOGOUT
// ==============================================================================
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==============================================================================
// 4. FORGOT PASSWORD
// ==============================================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let customer = store.customers.find(c => c.email.toLowerCase() === normalizedEmail);

    if (!customer) {
      // Auto-initialize customer record if not exists so reset link always works
      customer = {
        id: `cust-${Date.now()}`,
        email: normalizedEmail,
        first_name: normalizedEmail.split('@')[0],
        last_name: '',
        phone: '',
        is_verified: true,
        created_at: new Date().toISOString()
      };
      store.customers.push(customer);
    }

    const resetToken = `rt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    customer.reset_token = resetToken;
    customer.reset_token_expires = Date.now() + 3600000; // 1 hour

    // Dispatch reset email and await to log any errors
    try {
      await sendPasswordResetEmail(normalizedEmail, resetToken);
    } catch (e) {
      console.error('Password reset email dispatch error:', e.message);
    }

    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Failed to request password reset.' });
  }
});

// ==============================================================================
// 5. RESET PASSWORD
// ==============================================================================
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const customer = store.customers.find(c => c.reset_token === token && c.reset_token_expires > Date.now());

    if (!customer) {
      return res.status(400).json({ success: false, error: 'Invalid or expired password reset link.' });
    }

    const salt = await bcrypt.genSalt(10);
    customer.password_hash = await bcrypt.hash(password, salt);
    customer.reset_token = null;
    customer.reset_token_expires = null;

    if (supabase) {
      await supabase.from('customers').update({ password_hash: customer.password_hash }).eq('id', customer.id);
    }

    res.json({ success: true, message: 'Your password has been successfully updated. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});

// ==============================================================================
// 6. VERIFY EMAIL
// ==============================================================================
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const customer = store.customers.find(c => c.verification_token === token);

    if (!customer) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification link.' });
    }

    customer.is_verified = true;
    customer.verification_token = null;

    if (supabase) {
      await supabase.from('customers').update({ is_verified: true }).eq('id', customer.id);
    }

    res.json({ success: true, message: 'Your email address has been verified successfully!' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify email.' });
  }
});

export default router;
