import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the free measurement and consultation work?',
    a: 'A certified Lumina window specialist visits your space with fabric sample books and precision laser measuring tools. We record exact dimensions, discuss light and privacy goals, and provide an upfront itemized estimate with zero pressure.'
  },
  {
    q: 'What is the standard lead time for custom blinds and shades?',
    a: 'Because every treatment is custom-built to your exact dimensions, standard fabrication takes 10 to 14 business days. Priority rush options (5–7 business days) are also available for trade accounts.'
  },
  {
    q: 'Are motorized shades compatible with Alexa, Google Home, and Apple HomeKit?',
    a: 'Yes! Our smart motorized shades connect via WiFi bridge or Matter-enabled smart hubs, allowing voice control, automated time-of-day sunrise/sunset routines, and control from your smartphone.'
  },
  {
    q: 'What warranty is included with my window treatments?',
    a: 'All Lumina blinds and shades come with a Limited Lifetime Warranty covering hardware, mechanisms, and motor assemblies, plus a 5-year warranty on premium fabrics.'
  }
];

const Contact = ({ onOpenQuote }) => {
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="contact-page animate-fade-in container section">
      <div className="contact-header text-center">
        <span className="trade-badge">Get in Touch</span>
        <h1>We're here to help with your space.</h1>
        <p className="contact-subtitle">
          Have questions about measurements, custom fabrics, motorization, or trade accounts? Reach our team directly.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact Information & Channels */}
        <div className="contact-info-col">
          <div className="contact-info-card">
            <h3>Direct Contacts</h3>
            <div className="contact-info-item">
              <Phone className="contact-icon" size={24} />
              <div>
                <h4>Call or Text</h4>
                <p><a href="tel:18005550199">(800) 555-0199</a></p>
                <span>Mon–Fri: 8am – 7pm EST | Sat: 9am – 5pm EST</span>
              </div>
            </div>

            <div className="contact-info-item">
              <Mail className="contact-icon" size={24} />
              <div>
                <h4>Email Support</h4>
                <p><a href="mailto:hello@luminablinds.com">hello@luminablinds.com</a></p>
                <span>Response within 2 hours during business hours</span>
              </div>
            </div>

            <div className="contact-info-item">
              <MapPin className="contact-icon" size={24} />
              <div>
                <h4>Design Studio & Showrooms</h4>
                <p>1200 Avenue of the Americas, Suite 400</p>
                <span>New York, NY 10036</span>
              </div>
            </div>

            <div className="contact-cta-box">
              <h4>Need a quick estimate?</h4>
              <p>Skip the wait and generate a customized pricing quote online.</p>
              <button className="btn btn-primary full-width" onClick={onOpenQuote}>
                Launch Quote Wizard
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-col">
          <div className="contact-form-card">
            {submitted ? (
              <div className="trade-success animate-fade-in">
                <CheckCircle2 size={48} color="#2e7d32" />
                <h3>Message Sent Successfully!</h3>
                <p>
                  Thank you for reaching out, <strong>{contactForm.name}</strong>. A design specialist will respond to <strong>{contactForm.email}</strong> within 1 business day.
                </p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Send Us a Message</h3>
                
                <div className="form-group">
                  <label>Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jane Smith"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="jane@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="(555) 000-0000"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Inquiry Topic</label>
                  <select 
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  >
                    <option value="General Question">General Question</option>
                    <option value="Schedule Measuring">Schedule In-Home Measuring</option>
                    <option value="Commercial / Large Volume">Commercial / Large Volume Project</option>
                    <option value="Trade Account Inquiry">Trade Account Inquiry</option>
                    <option value="Order Status">Order Status or Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea 
                    rows="5" 
                    required 
                    placeholder="Tell us about your window treatment project, questions, or dimensions..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-large full-width">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="contact-faqs-section">
        <h2 className="text-center">Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`faq-item ${activeFaq === idx ? 'open' : ''}`} onClick={() => toggleFaq(idx)}>
              <div className="faq-question">
                <h4>{faq.q}</h4>
                {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {activeFaq === idx && (
                <div className="faq-answer animate-fade-in">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
