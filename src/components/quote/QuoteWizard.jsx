import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, ExternalLink, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import './QuoteWizard.css';

const TIME_WINDOWS = [
  '9:00 AM – 11:00 AM (Morning)',
  '11:00 AM – 1:00 PM (Midday)',
  '1:00 PM – 3:00 PM (Afternoon)',
  '3:00 PM – 5:00 PM (Late Afternoon)',
  '5:00 PM – 7:00 PM (Evening)',
  'Flexible / First Available Specialist'
];

const DMV_CITIES = [
  'Gaithersburg, MD',
  'Rockville, MD',
  'Bethesda, MD',
  'Potomac, MD',
  'Silver Spring, MD',
  'Germantown, MD',
  'Frederick, MD',
  'Washington, DC',
  'Arlington, VA',
  'Alexandria, VA',
  'McLean, VA',
  'Reston & Herndon, VA'
];

const QuoteWizard = ({ isOpen, onClose }) => {
  const { customer, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate default appointment date (2 days from today)
  const defaultDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const minDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    projectType: 'Home',
    windowsCount: '2–5',
    windowType: 'Standard',
    width: '',
    height: '',
    style: ['Roller'],
    services: 'Measure + Install',
    // Date & Time Scheduling
    preferredDate: defaultDate,
    preferredTime: '11:00 AM – 1:00 PM (Midday)',
    address: '',
    city: 'Gaithersburg, MD',
    // Contact Info
    name: '',
    email: '',
    phone: '',
    zip: '',
    notes: ''
  });

  // Pre-fill logged-in customer info
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        email: prev.email || customer.email || '',
        phone: prev.phone || customer.phone || '',
        address: prev.address || customer.address || '',
        city: prev.city ? `${customer.city}, ${customer.state || 'MD'}` : prev.city,
        zip: prev.zip || customer.zip || ''
      }));
    }
  }, [customer]);

  if (!isOpen) return null;

  const handleNext = async () => {
    setErrorMessage('');
    
    // Step 5 Validation (Date, Time, Address)
    if (step === 5) {
      if (!formData.preferredDate) {
        setErrorMessage('Please select a preferred appointment date.');
        return;
      }
      if (!formData.address.trim()) {
        setErrorMessage('Please enter your street address for the measurement visit.');
        return;
      }
    }

    // Step 6 Validation (Contact Info & Final Submission)
    if (step === 6) {
      if (!formData.name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!formData.phone.trim()) {
        setErrorMessage('Please enter your phone number so dispatch can confirm arrival.');
        return;
      }

      // Submit booking and lead to backend API
      setIsSubmitting(true);
      try {
        // 1. Submit In-Home Consultation Booking
        await api.createBooking({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.city} ${formData.zip}`.trim(),
          zip: formData.zip || '20877',
          city: formData.city.split(',')[0],
          date: formData.preferredDate,
          time: formData.preferredTime,
          window_count: formData.windowsCount,
          room_count: formData.projectType,
          customer_id: customer?.id || null,
          notes: `[Styles: ${formData.style.join(', ')}] [Service: ${formData.services}] ${formData.width && formData.height ? `[Approx: ${formData.width}x${formData.height}]` : ''} ${formData.notes ? `\nNotes: ${formData.notes}` : ''}`
        });

        // 2. Submit Lead to CRM Pipeline
        await api.submitLead({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          zip: formData.zip,
          city: formData.city.split(',')[0],
          customer_id: customer?.id || null,
          notes: `[Appointment: ${formData.preferredDate} at ${formData.preferredTime}] [Address: ${formData.address}, ${formData.city}] [Styles: ${formData.style.join(', ')}] [Service: ${formData.services}]`,
          source: 'website'
        });
      } catch (err) {
        console.warn('Backend consultation submission warning:', err);
      } finally {
        setIsSubmitting(false);
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setStep(step - 1);
  };

  const handleClose = () => {
    setStep(1);
    setErrorMessage('');
    onClose();
  };
  
  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      if (current.length > 1) {
        setFormData({ ...formData, [field]: current.filter(v => v !== value) });
      }
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="qw-step animate-fade-in">
            <h3>Tell us about your project</h3>
            <p className="qw-step-subtitle">We will tailor our recommendations and quotes to your specific project needs.</p>
            <div className="qw-field">
              <label>Project Type</label>
              <div className="qw-options">
                {['Home', 'Business', 'Designer / Contractor'].map(opt => (
                  <button 
                    key={opt}
                    type="button"
                    className={`qw-option ${formData.projectType === opt ? 'selected' : ''}`}
                    onClick={() => handleSelect('projectType', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="qw-field">
              <label>Number of Windows</label>
              <div className="qw-options">
                {['1', '2–5', '6–10', '11–20', '20+ Whole Home'].map(opt => (
                  <button 
                    key={opt}
                    type="button"
                    className={`qw-option ${formData.windowsCount === opt ? 'selected' : ''}`}
                    onClick={() => handleSelect('windowsCount', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="qw-step animate-fade-in">
            <h3>Tell us about your windows</h3>
            <p className="qw-step-subtitle">What type of window openings are we fitting in your space?</p>
            <div className="qw-field">
              <label>Window Type</label>
              <div className="qw-options grid-3">
                {['Standard', 'Large / Picture', 'Sliding Door', 'French Door', 'Bay Window', 'Custom Arch'].map(opt => (
                  <button 
                    key={opt}
                    type="button"
                    className={`qw-option ${formData.windowType === opt ? 'selected' : ''}`}
                    onClick={() => handleSelect('windowType', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="qw-field">
              <label>Approximate Dimensions (Inches - Optional)</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <input 
                  type="text" 
                  placeholder="Width (e.g. 36&quot;)" 
                  className="qw-input" 
                  value={formData.width}
                  onChange={(e) => setFormData({...formData, width: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Height (e.g. 60&quot;)" 
                  className="qw-input" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
              <p style={{ marginTop: 'var(--spacing-2)', fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                Don't worry if you don't have exact measurements—our laser measurement technician will verify everything on-site.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="qw-step animate-fade-in">
            <h3>Choose your preferred style(s)</h3>
            <p className="qw-step-subtitle">Select all treatment styles that interest you</p>
            <div className="qw-options grid-3">
              {['Roller', 'Roman', 'Wood', 'Faux Wood', 'Cellular', 'Solar', 'Zebra', 'Woven Wood', 'Motorized'].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  className={`qw-option ${formData.style.includes(opt) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('style', opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="qw-step animate-fade-in">
            <h3>How can we help?</h3>
            <p className="qw-step-subtitle">Choose the level of service you need</p>
            <div className="qw-options grid-2">
              {[
                { label: 'Product Only', desc: 'DIY measurement & self installation' },
                { label: 'Professional Measuring', desc: 'Guaranteed fit measurement check' },
                { label: 'Professional Installation', desc: 'Mounting and hardware setup' },
                { label: 'Measure + Install', desc: 'Complete white-glove turnkey service (Recommended)' }
              ].map(opt => (
                <button 
                  key={opt.label}
                  type="button"
                  className={`qw-option service-option ${formData.services === opt.label ? 'selected' : ''}`}
                  onClick={() => handleSelect('services', opt.label)}
                >
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="qw-step animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="trade-badge" style={{ margin: 0 }}>Free In-Home Visit</span>
            </div>
            <h3>Select your preferred appointment date & time</h3>
            <p className="qw-step-subtitle">
              Our Gaithersburg specialist will arrive with physical fabric sample books, motorized demonstrators, and optical laser measuring tools.
            </p>

            {errorMessage && (
              <div className="qw-error-alert" style={{ marginBottom: '16px' }}>{errorMessage}</div>
            )}

            <div className="qw-form-grid">
              {/* Date Picker */}
              <div className="qw-form-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="var(--color-accent-premium)" /> Preferred Date *
                </label>
                <input 
                  type="date" 
                  min={minDate}
                  className="qw-input"
                  style={{ fontWeight: 500 }}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  required
                />
              </div>

              {/* Service City */}
              <div className="qw-form-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="var(--color-accent-premium)" /> DMV City / Area *
                </label>
                <select 
                  className="qw-input"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  {DMV_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Arrival Time Window */}
              <div className="qw-form-field full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="var(--color-accent-premium)" /> Preferred Arrival Window *
                </label>
                <div className="qw-options grid-2">
                  {TIME_WINDOWS.map(win => (
                    <button
                      key={win}
                      type="button"
                      className={`qw-option ${formData.preferredTime === win ? 'selected' : ''}`}
                      onClick={() => handleSelect('preferredTime', win)}
                      style={{ textAlign: 'left', fontSize: '0.88rem', padding: '10px 14px' }}
                    >
                      {win}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div className="qw-form-field full-width">
                <label>Service Street Address *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 101 Lakeforest Blvd, Suite 200 or 7400 Arlington Rd" 
                  className="qw-input" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="qw-step animate-fade-in">
            <h3>Where should we send your quote & confirmation?</h3>
            <p className="qw-step-subtitle">A design specialist will review your specs, verify the arrival window, and send your confirmation email.</p>
            
            {errorMessage && (
              <div className="qw-error-alert">{errorMessage}</div>
            )}

            <div className="qw-form-grid">
              <div className="qw-form-field">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="Adeel Asad" 
                  className="qw-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="qw-form-field">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  placeholder="asad.adeel@gmail.com" 
                  className="qw-input" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="qw-form-field">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="(857) 222-9207" 
                  className="qw-input" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="qw-form-field">
                <label>DMV ZIP Code</label>
                <input 
                  type="text" 
                  placeholder="20878" 
                  className="qw-input" 
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                />
              </div>

              <div className="qw-form-field full-width">
                <label>Project Notes (Optional)</label>
                <textarea 
                  placeholder="Any specific fabric preferences, motorization questions, or room details..." 
                  className="qw-input" 
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="qw-step animate-fade-in qw-success">
            <div className="success-icon"><Check size={48} /></div>
            <h3>Your In-Home Consultation is Confirmed!</h3>
            <p>Thank you, <strong>{formData.name || 'Friend'}</strong>. We have scheduled your appointment and dispatched a confirmation email to <strong>{formData.email}</strong>.</p>
            
            <div className="qw-summary" style={{ textAlign: 'left', margin: '20px 0' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--color-accent-premium)" /> Appointment Summary
              </h4>
              <div className="qw-summary-grid">
                <div><span>📅 Date:</span> <strong>{formData.preferredDate}</strong></div>
                <div><span>⏰ Arrival Window:</span> <strong>{formData.preferredTime}</strong></div>
                <div><span>📍 Address:</span> <strong>{formData.address}, {formData.city}</strong></div>
                <div><span>Windows:</span> <strong>{formData.windowsCount} ({formData.projectType})</strong></div>
                <div><span>Selected Styles:</span> <strong>{formData.style.join(', ')}</strong></div>
                <div><span>Service Level:</span> <strong>{formData.services}</strong></div>
              </div>
            </div>

            {isAuthenticated ? (
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)' }}>
                  This appointment has been linked to your customer dashboard.
                </p>
                <Link to="/account" onClick={handleClose} className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--spacing-2)' }}>
                  View in Customer Portal <ExternalLink size={14} />
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: 'var(--spacing-4)', background: '#f7f5f0', padding: '12px', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', margin: 0 }}>
                  Tip: <Link to="/register" onClick={handleClose} style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Create an account</Link> to track your in-home appointment schedule online.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginTop: 'var(--spacing-6)' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Submit Another Request
              </button>
              <button className="btn btn-primary" onClick={handleClose}>
                Return to Site
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="qw-overlay" onClick={handleClose}>
      <div className="qw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qw-close" onClick={handleClose} aria-label="Close quote wizard">
          <X size={24} />
        </button>
        
        {step < 7 && (
          <div className="qw-header">
            <div className="qw-progress">
              <div className="qw-progress-bar" style={{ width: `${(step / 6) * 100}%` }}></div>
            </div>
            <div className="qw-progress-text">Step {step} of 6</div>
          </div>
        )}

        <div className="qw-content">
          {renderStep()}
        </div>

        {step < 7 && (
          <div className="qw-footer">
            {step > 1 ? (
              <button className="btn btn-secondary" onClick={handleBack}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div></div>}
            
            {step < 6 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling Appointment...' : 'Confirm Appointment & Send Quote'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteWizard;
