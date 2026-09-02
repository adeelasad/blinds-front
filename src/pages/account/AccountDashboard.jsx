import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Package, 
  Calendar, 
  FileText, 
  Layers, 
  User, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Download, 
  Plus, 
  X,
  AlertCircle
} from 'lucide-react';

const AccountDashboard = ({ onOpenQuote }) => {
  const { customer, token, logout, updateProfile, changePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [samples, setSamples] = useState([]);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(() => ({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || 'Gaithersburg',
    state: customer?.state || 'MD',
    zip: customer?.zip || ''
  }));
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // New Booking Modal State
  const [newBooking, setNewBooking] = useState(() => ({
    date: '',
    time: '10:00 AM',
    address: customer?.address ? `${customer.address}, ${customer.city || 'Gaithersburg'}, ${customer.state || 'MD'} ${customer.zip || ''}` : '',
    window_count: '1-5 windows',
    notes: ''
  }));

  // New Sample Modal State
  const [newSampleProduct, setNewSampleProduct] = useState('Roller Shades');

  // Protect route
  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  // Load customer records
  useEffect(() => {
    if (token) {
      Promise.all([
        api.getCustomerOrders(token).catch(() => ({ orders: [] })),
        api.getCustomerConsultations(token).catch(() => ({ consultations: [] })),
        api.getCustomerQuotes(token).catch(() => ({ quotes: [] })),
        api.getCustomerSamples(token).catch(() => ({ samples: [] }))
      ]).then(([ordersRes, consultRes, quotesRes, samplesRes]) => {
        if (ordersRes.orders) setOrders(ordersRes.orders);
        if (consultRes.consultations) setConsultations(consultRes.consultations);
        if (quotesRes.quotes) setQuotes(quotesRes.quotes);
        if (samplesRes.samples) setSamples(samplesRes.samples);
      });
    }
  }, [token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    const res = await updateProfile(profileForm);
    if (res.success) {
      setProfileSuccess('Profile updated successfully.');
    } else {
      setProfileError(res.error || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match.');
      return;
    }
    const res = await changePassword(passwordForm.current_password, passwordForm.new_password);
    if (res.success) {
      setPasswordSuccess('Password changed successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } else {
      setPasswordError(res.error || 'Failed to change password.');
    }
  };

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    const res = await api.bookCustomerConsultation(token, newBooking);
    if (res.success && res.consultation) {
      setConsultations([res.consultation, ...consultations]);
      setIsBookModalOpen(false);
    }
  };

  const handleRequestSample = async (e) => {
    e.preventDefault();
    const res = await api.requestCustomerSample(token, {
      product_name: newSampleProduct,
      address: profileForm.address || 'Address On File',
      zip: profileForm.zip || '20850'
    });
    if (res.success && res.sample) {
      setSamples([res.sample, ...samples]);
      setIsSampleModalOpen(false);
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="account-page animate-fade-in container section">
      {/* Account Header */}
      <div className="account-header">
        <div className="account-welcome">
          <span className="trade-badge">Customer Portal</span>
          <h1>Welcome back, {customer.first_name}!</h1>
          <p className="account-email">{customer.email} • {customer.city || 'Gaithersburg'}, {customer.state || 'MD'}</p>
        </div>
        <div className="account-actions">
          <button className="btn btn-secondary" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="account-tabs">
        <button
          className={`account-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={18} /> My Orders ({orders.length})
        </button>
        <button
          className={`account-tab ${activeTab === 'consultations' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultations')}
        >
          <Calendar size={18} /> My Consultations ({consultations.length})
        </button>
        <button
          className={`account-tab ${activeTab === 'quotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          <FileText size={18} /> My Quotes ({quotes.length})
        </button>
        <button
          className={`account-tab ${activeTab === 'samples' ? 'active' : ''}`}
          onClick={() => setActiveTab('samples')}
        >
          <Layers size={18} /> My Samples ({samples.length})
        </button>
        <button
          className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} /> My Profile
        </button>
      </div>

      {/* Tab Content */}
      <div className="account-tab-content">
        {/* ==================================================================
            TAB 1: MY ORDERS & STATUS TIMELINES
            ================================================================== */}
        {activeTab === 'orders' && (
          <div className="orders-tab animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Your Custom Window Orders</h2>
                <p>Track the real-time fabrication and master installation progress of your window treatments.</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-account-state">
                <Package size={48} color="var(--color-secondary-text)" />
                <h3>No active orders yet</h3>
                <p>Ready to upgrade your windows with guaranteed fit precision?</p>
                <button className="btn btn-primary" onClick={onOpenQuote}>
                  Get a Free Custom Quote
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-id">Order #{order.id.slice(-8)}</span>
                        <h3>{order.product_name}</h3>
                        <span className="order-specs">{order.window_count} custom windows</span>
                      </div>
                      <div className="order-pricing text-right">
                        <span className="price-total">${Number(order.total_amount).toFixed(2)}</span>
                        <span className={`status-pill ${order.status}`}>{order.status.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Visual Status Timeline */}
                    <div className="order-timeline-wrap">
                      <h4>Order Progress</h4>
                      <div className="order-timeline">
                        {[
                          { label: 'Consultation Scheduled', key: 'consultation-scheduled' },
                          { label: 'Quote Sent', key: 'quote-sent' },
                          { label: 'Deposit Paid', key: 'deposit-paid' },
                          { label: 'In Production', key: 'in-production' },
                          { label: 'Installation Scheduled', key: 'installation-scheduled' },
                          { label: 'Completed', key: 'completed' }
                        ].map((step, idx) => {
                          const stepsArr = ['consultation-scheduled', 'quote-sent', 'deposit-paid', 'in-production', 'installation-scheduled', 'completed'];
                          const currentIdx = stepsArr.indexOf(order.status);
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={step.key} className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                              <div className="timeline-node">
                                {isDone ? <CheckCircle2 size={16} /> : <span>{idx + 1}</span>}
                              </div>
                              <span className="timeline-label">{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(order)}>
                        View Order Details
                      </button>
                      {order.status === 'completed' && (
                        <button className="btn btn-primary btn-sm" onClick={onOpenQuote}>
                          Reorder for Another Room
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 2: MY CONSULTATIONS
            ================================================================== */}
        {activeTab === 'consultations' && (
          <div className="consultations-tab animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>In-Home Consultations</h2>
                <p>Manage your upcoming laser measuring and design consultation visits.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsBookModalOpen(true)}>
                <Plus size={16} /> Book New Consultation
              </button>
            </div>

            {consultations.length === 0 ? (
              <div className="empty-account-state">
                <Calendar size={48} color="var(--color-secondary-text)" />
                <h3>No scheduled appointments</h3>
                <p>A licensed technician will bring fabric books and laser measurement tools directly to your home.</p>
                <button className="btn btn-primary" onClick={() => setIsBookModalOpen(true)}>
                  Schedule Free Visit
                </button>
              </div>
            ) : (
              <div className="consultations-grid">
                {consultations.map(c => (
                  <div key={c.id} className="consultation-card">
                    <div className="consultation-card-top">
                      <span className={`status-pill ${c.status}`}>{c.status}</span>
                      <span className="consultation-date">{c.booking_date}</span>
                    </div>

                    <h3>In-Home Measurement & Design</h3>
                    
                    <div className="consultation-details">
                      <p><strong>⏰ Time:</strong> {c.booking_time}</p>
                      <p><strong>📍 Location:</strong> {c.address}</p>
                      <p><strong>👨‍🔧 Lead Technician:</strong> {c.installer_name || 'Marcus Taylor (DMV Lead)'}</p>
                      {c.installer_phone && <p><strong>📞 Direct Line:</strong> {c.installer_phone}</p>}
                    </div>

                    <div className="consultation-footer">
                      <div className="consultation-policy">
                        <AlertCircle size={14} /> 48-Hour Cancellation Policy
                      </div>
                      {c.status === 'scheduled' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => alert('Please contact our Gaithersburg dispatch team at (800) 555-0199 to adjust your appointment.')}>
                          Reschedule
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 3: MY QUOTES
            ================================================================== */}
        {activeTab === 'quotes' && (
          <div className="quotes-tab animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Your Project Estimates</h2>
                <p>Review itemized pricing, accept quotes, and pay deposits securely.</p>
              </div>
              <button className="btn btn-primary" onClick={onOpenQuote}>
                <Plus size={16} /> Request New Quote
              </button>
            </div>

            {quotes.length === 0 ? (
              <div className="empty-account-state">
                <FileText size={48} color="var(--color-secondary-text)" />
                <h3>No quotes on file yet</h3>
                <p>Use our Quote Wizard to build a custom estimate for your space.</p>
                <button className="btn btn-primary" onClick={onOpenQuote}>
                  Launch Quote Wizard
                </button>
              </div>
            ) : (
              <div className="quotes-list">
                {quotes.map(q => (
                  <div key={q.id} className="quote-card">
                    <div className="quote-card-header">
                      <div>
                        <span className="order-id">Quote #{q.id.slice(-8)}</span>
                        <h3>{q.product_type}</h3>
                        <p className="quote-scope">{q.window_count} custom units • Guaranteed Perfect Fit</p>
                      </div>
                      <div className="text-right">
                        <span className="price-total">${Number(q.total_price).toFixed(2)}</span>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                          50% Deposit: ${Number(q.deposit_amount).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="quote-card-actions">
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => {
                          const w = window.open();
                          w.document.write(`<html><body style="font-family: sans-serif; padding: 40px;"><h2>Lumina Official Estimate #${q.id}</h2><p>Product: ${q.product_type}</p><p>Total: $${q.total_price}</p><p>Deposit Required: $${q.deposit_amount}</p><p>Includes precision laser measuring and professional master installation.</p></body></html>`);
                        }}
                      >
                        <Download size={16} /> Download PDF
                      </button>

                      {q.status === 'sent' && (
                        <a 
                          href="https://checkout.stripe.com/pay/cs_test_mock_deposit" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-primary btn-sm"
                        >
                          Accept & Pay 50% Deposit <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 4: MY SAMPLES
            ================================================================== */}
        {activeTab === 'samples' && (
          <div className="samples-tab animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Material & Fabric Swatches</h2>
                <p>Track your requested fabric decks delivered directly to your doorstep.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsSampleModalOpen(true)}>
                <Plus size={16} /> Request Free Sample Kit
              </button>
            </div>

            {samples.length === 0 ? (
              <div className="empty-account-state">
                <Layers size={48} color="var(--color-secondary-text)" />
                <h3>No sample requests yet</h3>
                <p>Order complimentary swatches to test fabrics and light filtration in your rooms.</p>
                <button className="btn btn-primary" onClick={() => setIsSampleModalOpen(true)}>
                  Order Free Swatches
                </button>
              </div>
            ) : (
              <div className="samples-grid">
                {samples.map(s => (
                  <div key={s.id} className="sample-card">
                    <div className="sample-card-header">
                      <span className={`status-pill ${s.status}`}>{s.status}</span>
                      <span className="sample-date">{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3>{s.product_name}</h3>
                    <p className="sample-address">
                      Shipping to: {s.address}, {s.zip}
                    </p>
                    <div className="sample-footer">
                      <Clock size={14} /> Estimated 2–4 Business Days
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 5: MY PROFILE & SETTINGS
            ================================================================== */}
        {activeTab === 'profile' && (
          <div className="profile-tab animate-fade-in">
            <div className="profile-grid">
              {/* Profile Details Form */}
              <div className="profile-card">
                <h3>Contact & Address Information</h3>
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: 'var(--spacing-6)' }}>
                  Used to pre-fill your quotes, measuring appointments, and sample shipments.
                </p>

                {profileSuccess && <div className="auth-alert success">{profileSuccess}</div>}
                {profileError && <div className="auth-alert error">{profileError}</div>}

                <form onSubmit={handleProfileSubmit} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={customer.email}
                        disabled
                        style={{ backgroundColor: 'var(--color-secondary-bg)', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      placeholder="123 Main St, Apt 4"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    />
                  </div>

                  <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP</label>
                      <input
                        type="text"
                        value={profileForm.zip}
                        onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Save Profile Changes
                  </button>
                </form>
              </div>

              {/* Password & Security Card */}
              <div className="profile-card">
                <h3>Security & Password</h3>
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: 'var(--spacing-6)' }}>
                  Update your credentials to maintain account security.
                </p>

                {passwordSuccess && <div className="auth-alert success">{passwordSuccess}</div>}
                {passwordError && <div className="auth-alert error">{passwordError}</div>}

                <form onSubmit={handlePasswordSubmit} className="auth-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary">
                    Update Password
                  </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-8)', paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border)' }}>
                  <h4>Account Actions</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', margin: 'var(--spacing-2) 0' }}>
                    Need to remove your data or close your account?
                  </p>
                  <button 
                    className="btn btn-sm" 
                    style={{ color: '#c81e1e', border: '1px solid #c81e1e', background: 'transparent' }}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? All saved quotes and order history will be permanently deleted.')) {
                        logout();
                        navigate('/');
                      }
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL: BOOK CONSULTATION
          ==================================================================== */}
      {isBookModalOpen && (
        <div className="qw-overlay" onClick={() => setIsBookModalOpen(false)}>
          <div className="qw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setIsBookModalOpen(false)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Schedule In-Home Consultation</h3>
              <p style={{ color: 'var(--color-secondary-text)', marginBottom: 'var(--spacing-6)' }}>
                Our certified technician will bring fabric books and laser measurement tools.
              </p>
              <form onSubmit={handleBookConsultation} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input 
                      type="date" 
                      required 
                      value={newBooking.date}
                      onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time *</label>
                    <select
                      value={newBooking.time}
                      onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    >
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Service Address *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="123 Main St, Gaithersburg, MD 20877"
                    value={newBooking.address}
                    onChange={(e) => setNewBooking({ ...newBooking, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Approximate Windows</label>
                  <select
                    value={newBooking.window_count}
                    onChange={(e) => setNewBooking({ ...newBooking, window_count: e.target.value })}
                  >
                    <option value="1-3 windows">1–3 windows</option>
                    <option value="4-8 windows">4–8 windows</option>
                    <option value="9-15 windows">9–15 windows</option>
                    <option value="16+ Whole Home">16+ (Whole Home)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project Notes</label>
                  <textarea
                    rows="2"
                    placeholder="Specific rooms, styles, or questions..."
                    value={newBooking.notes}
                    onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large full-width">
                  Confirm Consultation Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: REQUEST SAMPLES
          ==================================================================== */}
      {isSampleModalOpen && (
        <div className="qw-overlay" onClick={() => setIsSampleModalOpen(false)}>
          <div className="qw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setIsSampleModalOpen(false)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Request Free Fabric Swatches</h3>
              <p style={{ color: 'var(--color-secondary-text)', marginBottom: 'var(--spacing-6)' }}>
                We will package your complimentary swatch deck and mail it to {profileForm.address || 'your address on file'}.
              </p>
              <form onSubmit={handleRequestSample} className="auth-form">
                <div className="form-group">
                  <label>Select Collection</label>
                  <select
                    value={newSampleProduct}
                    onChange={(e) => setNewSampleProduct(e.target.value)}
                  >
                    <option value="Roller Shades (Solar & Blackout)">Roller Shades (Solar & Blackout)</option>
                    <option value="Tailored Linen Roman Shades">Tailored Linen Roman Shades</option>
                    <option value="Natural Hardwood Blinds">Natural Hardwood Blinds</option>
                    <option value="Cellular Honeycomb Thermal Shades">Cellular Honeycomb Thermal Shades</option>
                    <option value="Hunter Douglas Silhouette Sheer Vanes">Hunter Douglas Silhouette Sheer Vanes</option>
                    <option value="Outdoor Weatherproof Patio Shades">Outdoor Weatherproof Patio Shades</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-large full-width">
                  Dispatch Swatch Kit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ORDER DETAILS
          ==================================================================== */}
      {selectedOrder && (
        <div className="qw-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="qw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setSelectedOrder(null)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Order #{selectedOrder.id.slice(-8)}</h3>
              <p style={{ color: 'var(--color-secondary-text)', marginBottom: 'var(--spacing-4)' }}>
                {selectedOrder.product_name}
              </p>

              <div style={{ backgroundColor: 'var(--color-secondary-bg)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-4)' }}>
                <p><strong>Total Project Price:</strong> ${Number(selectedOrder.total_amount).toFixed(2)}</p>
                <p><strong>Deposit Paid:</strong> ${Number(selectedOrder.deposit_amount).toFixed(2)}</p>
                <p><strong>Balance Due on Installation:</strong> ${Number(selectedOrder.balance_due).toFixed(2)}</p>
                <p><strong>Status:</strong> <span className={`status-pill ${selectedOrder.status}`}>{selectedOrder.status}</span></p>
              </div>

              <div className="order-timeline-wrap">
                <h4>Status Steps</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                  <li>✅ In-Home Laser Measurement Verified</li>
                  <li>✅ Custom Fabric Cut & Assembly Started</li>
                  <li>⏳ Master Hardware Installation Inspection</li>
                </ul>
              </div>

              <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', gap: 'var(--spacing-3)' }}>
                <button className="btn btn-primary full-width" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDashboard;
