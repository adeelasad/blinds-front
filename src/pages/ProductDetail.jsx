import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ShieldCheck, Ruler, Check, Truck, ChevronRight, 
  HelpCircle, Eye, RefreshCw, Sparkles, Layers, Info, ShoppingCart, Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SEOHead, { generateProductSchema } from '../components/seo/SEOHead';

const FRACTION_OPTIONS = [
  { label: '0"', value: 0 },
  { label: '1/8"', value: 0.125 },
  { label: '1/4"', value: 0.25 },
  { label: '3/8"', value: 0.375 },
  { label: '1/2"', value: 0.5 },
  { label: '5/8"', value: 0.625 },
  { label: '3/4"', value: 0.75 },
  { label: '7/8"', value: 0.875 }
];

const DEFAULT_LIFT_OPTIONS = [
  { id: 'cordless_spring', name: 'Cordless Spring System (Child Safe)', upcharge: 0, is_default: true, icon: '🪟', tag: 'Standard Included' },
  { id: 'precision_cordless', name: 'Precision Smooth Cordless Glide', upcharge: 18.00, is_default: false, icon: '✨', tag: 'Ultra-Smooth' },
  { id: 'continuous_loop', name: 'Heavy-Duty Stainless Steel Cord Loop', upcharge: 25.00, is_default: false, icon: '🔗', tag: 'High Windows' },
  { id: 'motorized_wand', name: 'Rechargeable Motorized Smart Wand', upcharge: 75.00, is_default: false, icon: '🪄', tag: 'Motorized' },
  { id: 'somfy_motorized', name: 'Somfy / PowerView Smart Motor with Remote', upcharge: 135.00, is_default: false, icon: '⚡', tag: 'Smart Home Alexa/Apple' }
];

const DEFAULT_CASSETTE_OPTIONS = [
  { id: 'exposed_roller', name: 'Standard Exposed Roller Bar', upcharge: 0, is_default: true, desc: 'Clean open-roll minimalist profile' },
  { id: 'fabric_cassette', name: 'Fabric-Wrapped Curved Designer Cassette', upcharge: 35.00, is_default: false, desc: 'Matching fabric insert conceals roller mechanism' },
  { id: 'aluminum_fascia', name: 'Architectural Aluminum Square Fascia', upcharge: 45.00, is_default: false, desc: 'Contemporary crisp aluminum valence' }
];

const DEFAULT_ROLL_DIRECTIONS = [
  { id: 'standard_roll', name: 'Standard Roll', desc: 'Fabric hangs off the back, closer to window glass for tighter light blocking', upcharge: 0 },
  { id: 'waterfall_roll', name: 'Reverse / Waterfall Roll', desc: 'Fabric hangs off the front, gracefully concealing the roll tube', upcharge: 0 }
];

const DEFAULT_BOTTOM_RAILS = [
  { id: 'fabric_pocket', name: 'Sewn-In Fabric Pocket Bar', desc: 'Concealed bottom weight bar wrapped in matching fabric', upcharge: 0 },
  { id: 'aluminum_hem_bar', name: 'Architectural Exposed Aluminum Hem Bar', desc: 'Heavy-duty modern metallic bottom bar', upcharge: 14.00 }
];

const DEFAULT_WARRANTIES = [
  { id: 'standard_warranty', name: 'Lifetime Craftsmanship Guarantee', desc: 'Guaranteed fit & limited lifetime hardware coverage', upcharge: 0 },
  { id: 'accident_protection', name: '5-Year No-Questions-Asked Accident & Remeasure Replacement', desc: 'Includes kid/pet damage & mis-measurement replacement', upcharge: 19.99 }
];

const ProductDetail = ({ onOpenQuote }) => {
  const { productId } = useParams();
  const { customer, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Configurator Selections
  const [selectedColor, setSelectedColor] = useState('Bright White');
  const [mountType, setMountType] = useState('inside');
  const [widthWhole, setWidthWhole] = useState(36);
  const [widthFraction, setWidthFraction] = useState(0);
  const [heightWhole, setHeightWhole] = useState(60);
  const [heightFraction, setHeightFraction] = useState(0);
  const [roomLocation, setRoomLocation] = useState('Living Room');
  const [quantity, setQuantity] = useState(1);

  // Advanced Customizer Upgrades
  const [liftId, setLiftId] = useState('cordless_spring');
  const [cassetteId, setCassetteId] = useState('exposed_roller');
  const [rollDirectionId, setRollDirectionId] = useState('standard_roll');
  const [bottomRailId, setBottomRailId] = useState('fabric_pocket');
  const [warrantyId, setWarrantyId] = useState('standard_warranty');

  // Options & Matrix Data from API
  const [optionsConfig, setOptionsConfig] = useState(null);
  const [pricingResult, setPricingResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // Sample Request Modal / State
  const [sampleOrdered, setSampleOrdered] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [sampleAddress, setSampleAddress] = useState('');
  const [sampleZip, setSampleZip] = useState('');
  const [sampleEmail, setSampleEmail] = useState('');
  const [sampleName, setSampleName] = useState('');
  const [selectedSwatchColors, setSelectedSwatchColors] = useState(['Bright White', 'Warm Oatmeal', 'Slate Gray']);

  // Fetch product detail & options config
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getProductBySlug(productId),
      api.getOptionsConfig()
    ]).then(([prodRes, optRes]) => {
      if (prodRes.success && prodRes.product) {
        setProduct(prodRes.product);
        if (prodRes.related) setRelated(prodRes.related);
        if (prodRes.product.colors && prodRes.product.colors.length > 0) {
          setSelectedColor(prodRes.product.colors[0]);
        }
      }
      if (optRes.success && optRes.options) {
        setOptionsConfig(optRes.options);
      }
    }).catch(err => {
      console.warn('Error loading product or options:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [productId]);

  // Sync customer details for samples
  useEffect(() => {
    if (customer) {
      setSampleName(`${customer.first_name || ''} ${customer.last_name || ''}`.trim());
      setSampleEmail(customer.email || '');
      setSampleAddress(customer.address || '');
      setSampleZip(customer.zip || '');
    }
  }, [customer]);

  // Total calculated width and height
  const exactWidth = useMemo(() => Number(widthWhole) + Number(widthFraction), [widthWhole, widthFraction]);
  const exactHeight = useMemo(() => Number(heightWhole) + Number(heightFraction), [heightWhole, heightFraction]);

  // Calculate live Matrix Price on selection changes
  useEffect(() => {
    let isCurrent = true;
    setCalculating(true);

    api.calculateMatrixPrice({
      category: product?.category || 'shades',
      width: exactWidth,
      height: exactHeight,
      lift_id: liftId,
      cassette_id: cassetteId,
      roll_direction_id: rollDirectionId,
      bottom_rail_id: bottomRailId,
      warranty_id: warrantyId,
      quantity,
      discount_percent: product?.discount_pct || 25
    }).then(res => {
      if (isCurrent && res.success && res.calculation) {
        setPricingResult(res.calculation);
      }
    }).catch(err => {
      console.error('Matrix calculate error:', err);
    }).finally(() => {
      if (isCurrent) setCalculating(false);
    });

    return () => { isCurrent = false; };
  }, [exactWidth, exactHeight, liftId, cassetteId, rollDirectionId, bottomRailId, warrantyId, quantity, product]);

  const liftOptions = optionsConfig?.lift_systems || DEFAULT_LIFT_OPTIONS;
  const cassetteOptions = optionsConfig?.cassettes || DEFAULT_CASSETTE_OPTIONS;
  const rollDirections = optionsConfig?.roll_directions || DEFAULT_ROLL_DIRECTIONS;
  const bottomRails = optionsConfig?.bottom_rails || DEFAULT_BOTTOM_RAILS;
  const warranties = optionsConfig?.warranties || DEFAULT_WARRANTIES;

  const handleOrderSample = async (e) => {
    e.preventDefault();
    try {
      if (token) {
        await api.requestCustomerSample(token, {
          product_name: product?.name || 'Custom Window Treatment',
          colors: selectedSwatchColors,
          opacity: 'Light Filtering & Blackout Swatches',
          address: sampleAddress || 'Address on file',
          zip: sampleZip || '20850'
        });
      } else {
        await api.requestSample({
          name: sampleName || 'Customer',
          email: sampleEmail || 'customer@example.com',
          address: sampleAddress || 'Service Address',
          zip: sampleZip || '20850',
          product_name: product?.name || 'Custom Window Treatment',
          colors: selectedSwatchColors,
          notes: `Swatches requested for ${product?.name || 'Treatment'}`
        });
      }
      setSampleOrdered(true);
      setTimeout(() => {
        setIsSampleModalOpen(false);
        setSampleOrdered(false);
      }, 2500);
    } catch (err) {
      alert('Failed to submit sample request. Please try again.');
    }
  };

  const handleSaveToQuote = () => {
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
    if (onOpenQuote) {
      onOpenQuote();
    }
  };

  if (loading) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton-line" style={{ width: '200px', height: '30px', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section text-center">
        <h2>Product Not Found</h2>
        <p>The requested window treatment could not be located.</p>
        <Link to="/blinds" className="btn btn-primary" style={{ marginTop: '20px' }}>Return to Catalog</Link>
      </div>
    );
  }

  const productImages = (product.images && product.images.length > 0) 
    ? product.images 
    : ['/images/cat-roller.jpg', '/images/hero-living-room.jpg', '/images/product-main.jpg'];

  const productColors = product.colors && product.colors.length > 0 
    ? product.colors 
    : ['Bright White', 'Warm Oatmeal', 'Soft Gray', 'Slate Black', 'Natural Beige'];

  return (
    <div className="product-customizer-page animate-fade-in">
      <SEOHead 
        title={`${product.name} | Custom Matrix Sizing & Pricing | Lumina Blinds`}
        description={`Customize your ${product.name} with exact fraction measurements, motorization upgrades, cassette valances, and instant matrix pricing.`}
        canonical={`/products/${productId}`}
        schema={generateProductSchema(product)}
      />

      {/* Breadcrumb Navigation */}
      <div className="customizer-breadcrumb container">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/${product.category || 'blinds'}`}>{product.category ? product.category.toUpperCase() : 'CATALOG'}</Link>
        <ChevronRight size={14} />
        <span className="current">{product.name}</span>
      </div>

      <div className="container customizer-main-grid">
        {/* =========================================================================
            LEFT COLUMN: Visual Gallery, Swatch Inspection, Value Badges & Reviews
            ========================================================================= */}
        <div className="customizer-gallery-column">
          <div className="sticky-gallery-wrap">
            {/* Main Product Stage */}
            <div className="customizer-main-image">
              <img 
                src={productImages[activeImageIndex] || productImages[0]} 
                alt={`${product.name} in ${selectedColor}`} 
              />
              <div className="selected-spec-pill">
                <span>🎨 {selectedColor}</span>
                <span>•</span>
                <span>{exactWidth}"W × {exactHeight}"H</span>
              </div>
              {product.discount_pct && (
                <div className="customizer-promo-badge">
                  🔥 {product.discount_pct}% OFF LIMITED-TIME SALE
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Row */}
            <div className="customizer-thumb-row">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`View angle ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Free Samples Banner */}
            <div className="customizer-sample-box">
              <div className="sample-box-text">
                <h4>Not sure about the color?</h4>
                <p>Order up to 5 physical fabric swatches mailed free to your home in 1 business day.</p>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsSampleModalOpen(true)}
              >
                Order Free Samples
              </button>
            </div>

            {/* Guaranteed Fit & Trust Badges */}
            <div className="customizer-trust-grid">
              <div className="trust-card">
                <ShieldCheck size={22} color="#2e7d32" />
                <div>
                  <strong>100% Guaranteed Fit</strong>
                  <p>If you mis-measure, we remake it for free or laser-measure for you.</p>
                </div>
              </div>
              <div className="trust-card">
                <Truck size={22} color="#1565c0" />
                <div>
                  <strong>Fast DMV In-Home Service</strong>
                  <p>Custom fabricated & delivered in {product.lead_time || '10-14 business days'}.</p>
                </div>
              </div>
              <div className="trust-card">
                <Ruler size={22} color="#d4af37" />
                <div>
                  <strong>Laser Opening Verification</strong>
                  <p>Turnkey master installation available across DC, MD & Northern VA.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Step-by-Step SelectBlinds Interactive Configurator
            ========================================================================= */}
        <div className="customizer-form-column">
          {/* Header Title & Rating */}
          <div className="customizer-header">
            <span className="trade-badge">{product.brand || 'Lumina Custom'}</span>
            <h1>{product.name}</h1>
            <div className="rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <span className="rating-score">{product.rating || 4.9}</span>
              <span className="rating-count">({product.reviewCount || 184} verified reviews)</span>
            </div>
            <p className="product-summary-desc">{product.description}</p>
          </div>

          {/* STEP 1: COLOR & FABRIC SWATCH SELECTION */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">1</span>
              <div>
                <h3>Select Color & Fabric Texture</h3>
                <p className="step-sub">Chosen: <strong className="highlight-color">{selectedColor}</strong></p>
              </div>
            </div>

            <div className="swatch-chips-grid">
              {productColors.map((color, idx) => {
                const isSelected = selectedColor === color;
                const bgMap = {
                  'Bright White': '#ffffff',
                  'White': '#fafafa',
                  'Off-White': '#f5f4ef',
                  'Alabaster': '#f0ebe1',
                  'Slate Gray': '#70777d',
                  'Gray': '#9e9e9e',
                  'Soft Gray': '#cfd4d8',
                  'Charcoal': '#374151',
                  'Warm Oatmeal': '#d7c7b2',
                  'Oatmeal Linen': '#d9cebc',
                  'Natural Oak': '#c69d67',
                  'Natural Hardwood': '#b08453',
                  'Rich Walnut': '#5c4033',
                  'Espresso': '#362b28',
                  'Slate Black': '#1f2428',
                  'Natural Beige': '#e6d8c3'
                };
                const chipBg = bgMap[color] || '#e0dcd5';

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`swatch-chip-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <div className="swatch-preview-circle" style={{ backgroundColor: chipBg, border: '1px solid rgba(0,0,0,0.15)' }}>
                      {isSelected && <Check size={14} color={chipBg === '#ffffff' || chipBg === '#fafafa' ? '#000' : '#fff'} />}
                    </div>
                    <span className="swatch-name">{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MOUNT TYPE */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">2</span>
              <div>
                <h3>Choose Mount Type</h3>
                <p className="step-sub">Inside the window casing or outside on the wall/trim</p>
              </div>
            </div>

            <div className="mount-type-grid">
              <button
                type="button"
                className={`mount-option-card ${mountType === 'inside' ? 'selected' : ''}`}
                onClick={() => setMountType('inside')}
              >
                <div className="mount-icon">🪟</div>
                <div className="mount-details">
                  <div className="mount-title-row">
                    <strong>Inside Mount</strong>
                    {mountType === 'inside' && <span className="selected-tag">Selected</span>}
                  </div>
                  <p>Fits inside the window frame for a flush, clean built-in look. Factory automatically applies a 3/8" deduction for smooth operation.</p>
                  <span className="mount-requirement">Requires min. 2" window frame depth</span>
                </div>
              </button>

              <button
                type="button"
                className={`mount-option-card ${mountType === 'outside' ? 'selected' : ''}`}
                onClick={() => setMountType('outside')}
              >
                <div className="mount-icon">📐</div>
                <div className="mount-details">
                  <div className="mount-title-row">
                    <strong>Outside Mount</strong>
                    {mountType === 'outside' && <span className="selected-tag">Selected</span>}
                  </div>
                  <p>Mounted onto the wall surface or outer molding. Great for shallow windows, hiding imperfections, or maximum blackout coverage.</p>
                  <span className="mount-requirement">Fabricated to exact ordered dimensions</span>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 3: EXACT MEASUREMENTS */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">3</span>
              <div>
                <h3>Enter Measurements & Location</h3>
                <p className="step-sub">Precision Matrix Grid calculated in real-time</p>
              </div>
            </div>

            <div className="measurements-inputs-grid">
              <div className="measure-group">
                <label className="measure-label">
                  <span>Width (Inches)</span>
                  <span className="matrix-bracket-hint">Matrix Bracket: {pricingResult?.matched_width_bracket || 36}"</span>
                </label>
                <div className="dual-dropdown-row">
                  <select 
                    className="admin-select whole-inch-select"
                    value={widthWhole}
                    onChange={(e) => setWidthWhole(Number(e.target.value))}
                  >
                    {[...Array(82)].map((_, i) => {
                      const inch = i + 15;
                      return <option key={inch} value={inch}>{inch}"</option>;
                    })}
                  </select>

                  <select 
                    className="admin-select fraction-select"
                    value={widthFraction}
                    onChange={(e) => setWidthFraction(Number(e.target.value))}
                  >
                    {FRACTION_OPTIONS.map(f => (
                      <option key={f.label} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="measure-group">
                <label className="measure-label">
                  <span>Height / Drop (Inches)</span>
                  <span className="matrix-bracket-hint">Matrix Bracket: {pricingResult?.matched_height_bracket || 60}"</span>
                </label>
                <div className="dual-dropdown-row">
                  <select 
                    className="admin-select whole-inch-select"
                    value={heightWhole}
                    onChange={(e) => setHeightWhole(Number(e.target.value))}
                  >
                    {[...Array(85)].map((_, i) => {
                      const inch = i + 24;
                      return <option key={inch} value={inch}>{inch}"</option>;
                    })}
                  </select>

                  <select 
                    className="admin-select fraction-select"
                    value={heightFraction}
                    onChange={(e) => setHeightFraction(Number(e.target.value))}
                  >
                    {FRACTION_OPTIONS.map(f => (
                      <option key={f.label} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="measure-group full-width-group">
                <label className="measure-label">
                  <span>Room / Window Location Tag</span>
                  <span className="optional-tag">Helps with installer labeling</span>
                </label>
                <input 
                  type="text"
                  className="room-tag-input"
                  placeholder="e.g., Living Room Center, Master Bedroom Left, Kitchen Sink"
                  value={roomLocation}
                  onChange={(e) => setRoomLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="measure-help-banner">
              <HelpCircle size={16} color="#d4af37" />
              <span>Need help measuring? <Link to="/how-to-measure" target="_blank">View our 1/16" Laser Measuring Guide</Link> or let our technician laser-measure during your free consultation.</span>
            </div>
          </div>

          {/* STEP 4: LIFT & MOTORIZATION SYSTEM */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">4</span>
              <div>
                <h3>Select Lift & Control System</h3>
                <p className="step-sub">100% Certified Child-Safe cordless & smart motorization</p>
              </div>
            </div>

            <div className="options-stack-list">
              {liftOptions.map((lift) => {
                const isSelected = liftId === lift.id;
                return (
                  <button
                    key={lift.id}
                    type="button"
                    className={`option-choice-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setLiftId(lift.id)}
                  >
                    <div className="choice-left">
                      <div className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                      <span className="choice-icon">{lift.icon || '🪟'}</span>
                      <div className="choice-text">
                        <div className="choice-title-row">
                          <strong>{lift.name}</strong>
                          {lift.tag && <span className="option-badge">{lift.tag}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="choice-right">
                      {lift.upcharge === 0 ? (
                        <span className="included-price">Included</span>
                      ) : (
                        <span className="upgrade-price">+${Number(lift.upcharge).toFixed(2)}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: HEADRAIL & CASSETTE */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">5</span>
              <div>
                <h3>Choose Headrail & Cassette Style</h3>
                <p className="step-sub">Conceal hardware for an upscale designer finish</p>
              </div>
            </div>

            <div className="options-stack-list">
              {cassetteOptions.map((cas) => {
                const isSelected = cassetteId === cas.id;
                return (
                  <button
                    key={cas.id}
                    type="button"
                    className={`option-choice-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCassetteId(cas.id)}
                  >
                    <div className="choice-left">
                      <div className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                      <div className="choice-text">
                        <strong>{cas.name}</strong>
                        <p className="choice-desc">{cas.desc}</p>
                      </div>
                    </div>
                    <div className="choice-right">
                      {cas.upcharge === 0 ? (
                        <span className="included-price">Included</span>
                      ) : (
                        <span className="upgrade-price">+${Number(cas.upcharge).toFixed(2)}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 6: ROLL DIRECTION & BOTTOM HEM BAR */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">6</span>
              <div>
                <h3>Roll Direction & Bottom Hem Bar</h3>
                <p className="step-sub">Tailor fabric drop orientation and bottom weighting</p>
              </div>
            </div>

            <div className="sub-section-title">Roll Orientation</div>
            <div className="options-stack-list" style={{ marginBottom: '16px' }}>
              {rollDirections.map((r) => {
                const isSelected = rollDirectionId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`option-choice-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setRollDirectionId(r.id)}
                  >
                    <div className="choice-left">
                      <div className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                      <div className="choice-text">
                        <strong>{r.name}</strong>
                        <p className="choice-desc">{r.desc}</p>
                      </div>
                    </div>
                    <div className="choice-right">
                      <span className="included-price">Included</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="sub-section-title">Bottom Weight Bar</div>
            <div className="options-stack-list">
              {bottomRails.map((b) => {
                const isSelected = bottomRailId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={`option-choice-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setBottomRailId(b.id)}
                  >
                    <div className="choice-left">
                      <div className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                      <div className="choice-text">
                        <strong>{b.name}</strong>
                        <p className="choice-desc">{b.desc}</p>
                      </div>
                    </div>
                    <div className="choice-right">
                      {b.upcharge === 0 ? (
                        <span className="included-price">Included</span>
                      ) : (
                        <span className="upgrade-price">+${Number(b.upcharge).toFixed(2)}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 7: WARRANTY */}
          <div className="config-step-card">
            <div className="step-header">
              <span className="step-number">7</span>
              <div>
                <h3>Warranty & Protection Plan</h3>
                <p className="step-sub">Protect your custom window treatment against accidents</p>
              </div>
            </div>

            <div className="options-stack-list">
              {warranties.map((w) => {
                const isSelected = warrantyId === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    className={`option-choice-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setWarrantyId(w.id)}
                  >
                    <div className="choice-left">
                      <div className={`radio-circle ${isSelected ? 'checked' : ''}`} />
                      <div className="choice-text">
                        <strong>{w.name}</strong>
                        <p className="choice-desc">{w.desc}</p>
                      </div>
                    </div>
                    <div className="choice-right">
                      {w.upcharge === 0 ? (
                        <span className="included-price">Included</span>
                      ) : (
                        <span className="upgrade-price">+${Number(w.upcharge).toFixed(2)}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ITEMIZED SUMMARY */}
          <div className="customizer-summary-card">
            <div className="summary-card-header">
              <h3>Itemized Configuration Breakdown</h3>
              <div className="qty-stepper">
                <span className="qty-label">Quantity:</span>
                <button 
                  type="button" 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="qty-value">{quantity}</span>
                <button 
                  type="button" 
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
            </div>

            <div className="itemized-lines-list">
              <div className="summary-line">
                <span>Base Matrix Price ({pricingResult?.matched_width_bracket}" × {pricingResult?.matched_height_bracket}" bracket):</span>
                <strong>${Number(pricingResult?.base_matrix_price || 119).toFixed(2)}</strong>
              </div>

              {pricingResult?.itemized_upcharges?.lift?.upcharge > 0 && (
                <div className="summary-line upgrade-line">
                  <span>Lift Upgrade ({pricingResult.itemized_upcharges.lift.name}):</span>
                  <span>+${Number(pricingResult.itemized_upcharges.lift.upcharge).toFixed(2)}</span>
                </div>
              )}

              {pricingResult?.itemized_upcharges?.cassette?.upcharge > 0 && (
                <div className="summary-line upgrade-line">
                  <span>Cassette ({pricingResult.itemized_upcharges.cassette.name}):</span>
                  <span>+${Number(pricingResult.itemized_upcharges.cassette.upcharge).toFixed(2)}</span>
                </div>
              )}

              {pricingResult?.itemized_upcharges?.bottom_rail?.upcharge > 0 && (
                <div className="summary-line upgrade-line">
                  <span>Bottom Hem Bar:</span>
                  <span>+${Number(pricingResult.itemized_upcharges.bottom_rail.upcharge).toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-line regular-line">
                <span>Regular Unit Price:</span>
                <span className="strikethrough-price">${Number(pricingResult?.regular_unit_price || 140).toFixed(2)}</span>
              </div>

              <div className="summary-line sale-line">
                <span>Limited-Time Promo ({pricingResult?.discount_percent || 25}% Off):</span>
                <strong className="sale-unit-price">${Number(pricingResult?.sale_unit_price || 105).toFixed(2)} / unit</strong>
              </div>

              {pricingResult?.warranty_total > 0 && (
                <div className="summary-line upgrade-line">
                  <span>Protection Plan ({quantity} × ${Number(warranties[1]?.upcharge || 19.99).toFixed(2)}):</span>
                  <span>+${Number(pricingResult.warranty_total).toFixed(2)}</span>
                </div>
              )}

              <div className="summary-total-box">
                <div className="total-top-row">
                  <div>
                    <span className="final-total-label">Total for {quantity} Custom Window{quantity > 1 ? 's' : ''}:</span>
                    <div className="final-price-display">
                      ${Number(pricingResult?.final_total || 105).toFixed(2)}
                    </div>
                  </div>
                  <div className="deposit-box">
                    <span className="deposit-label">50% Deposit to Start Fabrication:</span>
                    <div className="deposit-amount">${Number(pricingResult?.deposit_50_percent || 52.50).toFixed(2)}</div>
                    <span className="balance-hint">Balance (${Number(pricingResult?.balance_due || 52.50).toFixed(2)}) due upon final installation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="customizer-actions-row">
              <button 
                type="button" 
                className="btn btn-primary btn-large btn-block"
                onClick={handleSaveToQuote}
              >
                <ShoppingCart size={18} />
                Save to Custom Quote & Review (${Number(pricingResult?.final_total || 105).toFixed(2)})
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-large btn-block"
                onClick={onOpenQuote}
              >
                <Calendar size={18} />
                Book In-Home Measure for this Window
              </button>
            </div>

            {addedToCartToast && (
              <div className="added-toast animate-fade-in">
                <Check size={18} color="#2e7d32" />
                <span>Custom {product.name} ({exactWidth}" × {exactHeight}") saved to your consultation quote!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: FREE PHYSICAL FABRIC SWATCH REQUEST */}
      {isSampleModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsSampleModalOpen(false)}>
          <div className="modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎨 Order Free Fabric Swatches</h3>
              <button className="modal-close" onClick={() => setIsSampleModalOpen(false)}>×</button>
            </div>

            {sampleOrdered ? (
              <div className="sample-success text-center" style={{ padding: '30px' }}>
                <Check size={48} color="#2e7d32" style={{ margin: '0 auto 16px' }} />
                <h3>Physical Swatches Dispatched!</h3>
                <p>We've received your request for <strong>{product.name}</strong> fabric samples. They are being mailed to your address via USPS First Class.</p>
              </div>
            ) : (
              <form onSubmit={handleOrderSample} className="sample-form" style={{ padding: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
                  Select up to 5 colors for <strong>{product.name}</strong>. Mailed 100% free with no credit card required.
                </p>

                <div className="swatch-select-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {productColors.map(color => {
                    const isChecked = selectedSwatchColors.includes(color);
                    return (
                      <label key={color} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSwatchColors([...selectedSwatchColors, color]);
                            } else {
                              setSelectedSwatchColors(selectedSwatchColors.filter(c => c !== color));
                            }
                          }}
                        />
                        <span>{color}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-input" 
                    value={sampleName} 
                    onChange={(e) => setSampleName(e.target.value)} 
                    placeholder="Your Name"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="admin-input" 
                    value={sampleEmail} 
                    onChange={(e) => setSampleEmail(e.target.value)} 
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Mailing Address</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-input" 
                    value={sampleAddress} 
                    onChange={(e) => setSampleAddress(e.target.value)} 
                    placeholder="Street Address, City, State"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>ZIP Code</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-input" 
                    value={sampleZip} 
                    onChange={(e) => setSampleZip(e.target.value)} 
                    placeholder="e.g. 20850"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Ship Free Swatch Kit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
