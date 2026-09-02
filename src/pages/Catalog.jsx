import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, Check, Sparkles, SlidersHorizontal, Grid, Palette, Sun, ChevronDown, CheckCircle2, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    slug: 'faux-wood-blinds',
    name: '2" Cordless Faux Wood Blinds',
    category: 'blinds',
    subcategory: 'Moisture Resistant',
    price_min: 75,
    price_max: 220,
    rating: 4.9,
    reviewCount: 238,
    colors: ['Bright White', 'Off-White', 'Alabaster', 'Slate Gray'],
    images: ['/images/cat-wood.jpg'],
    features: ['Cordless', 'Moisture Resistant', 'Child Safe'],
    room_types: ['Living Room', 'Bathroom', 'Kitchen', 'Basement'],
    description: 'High-durability moisture-resistant polymer slats with authentic wood grain texture. Perfect for kitchens and bathrooms.',
    brand: 'Lumina Custom',
    is_bestseller: true,
    discount_pct: 20
  },
  {
    id: 'prod-2',
    slug: 'wood-blinds',
    name: 'Natural Hardwood Blinds',
    category: 'blinds',
    subcategory: 'Natural Hardwood',
    price_min: 95,
    price_max: 290,
    rating: 4.9,
    reviewCount: 164,
    colors: ['Natural Oak', 'Rich Walnut', 'Chestnut', 'Crisp White', 'Espresso'],
    images: ['/images/cat-wood.jpg'],
    features: ['Cordless', 'Motorized Tilt', 'Child Safe'],
    room_types: ['Living Room', 'Dining Room', 'Home Office'],
    description: 'Precision-crafted from 100% North American hardwoods for warmth, texture, and light control.',
    brand: 'Lumina Custom',
    is_bestseller: true,
    discount_pct: 20
  },
  {
    id: 'prod-3',
    slug: 'aluminum-mini-blinds',
    name: '1" Aluminum Mini Blinds',
    category: 'blinds',
    subcategory: 'Durable 1" Aluminum',
    price_min: 55,
    price_max: 160,
    rating: 4.8,
    reviewCount: 92,
    colors: ['Brushed Aluminum', 'Gloss White', 'Matte Black', 'Silver Metallic'],
    images: ['/images/service-install.jpg'],
    features: ['Cordless Wand', 'Heavy 6-Gauge Aluminum', 'Dust Resistant'],
    room_types: ['Home Office', 'Rental Property', 'Basement', 'Commercial'],
    description: 'Heavy 6-gauge spring-tempered aluminum slats that bounce back from bending and rough wear.',
    brand: 'Lumina Custom',
    is_featured: false,
    discount_pct: 25
  },
  {
    id: 'prod-4',
    slug: 'vertical-blinds',
    name: 'Smooth Vertical Blinds',
    category: 'blinds',
    subcategory: 'Sliding Doors & Large Windows',
    price_min: 85,
    price_max: 250,
    rating: 4.8,
    reviewCount: 110,
    colors: ['Arctic White', 'Oyster', 'Textured Cream', 'Charcoal'],
    images: ['/images/service-install.jpg'],
    features: ['Wand Control', 'Motorized Traverse', 'Large Openings'],
    room_types: ['Living Room', 'Patio / Sunroom', 'Dining Room'],
    description: 'Smooth-gliding vertical vanes built specifically for wide patio sliding glass doors and French doors.',
    brand: 'Lumina Custom',
    is_bestseller: false,
    discount_pct: 20
  },
  {
    id: 'prod-5',
    slug: 'panel-track-blinds',
    name: 'Architectural Panel Track Blinds',
    category: 'blinds',
    subcategory: 'Modern Sliding Panels',
    price_min: 120,
    price_max: 350,
    rating: 4.9,
    reviewCount: 78,
    colors: ['Woven Jute', 'Natural Flax', 'Stone Gray', 'Off White'],
    images: ['/images/cat-roller.jpg'],
    features: ['Cordless Wand', 'Room Divider', 'Solar Glare Control'],
    room_types: ['Living Room', 'Open Concept Space', 'Conference Room'],
    description: 'Contemporary sliding fabric panels on a multi-channel track for large vista windows and patio sliders.',
    brand: 'Lumina Custom',
    is_featured: true,
    discount_pct: 20
  },
  {
    id: 'prod-6',
    slug: 'roller-shades',
    name: 'Custom Roller Shades',
    category: 'shades',
    subcategory: 'Modern Roller',
    price_min: 89,
    price_max: 240,
    rating: 4.9,
    reviewCount: 285,
    colors: ['White', 'Ivory', 'Warm Gray', 'Charcoal', 'Midnight Black'],
    images: ['/images/cat-roller.jpg'],
    features: ['Cordless', 'Motorized', 'Blackout', 'Child Safe'],
    room_types: ['Living Room', 'Bedroom', 'Kitchen', 'Home Office'],
    description: 'Clean minimalist lines with smooth roller glide. Available in light-filtering, textured, and 100% blackout.',
    brand: 'Lumina Custom',
    is_bestseller: true,
    discount_pct: 20
  },
  {
    id: 'prod-7',
    slug: 'woven-wood-shades',
    name: 'Natural Woven Wood & Bamboo Shades',
    category: 'shades',
    subcategory: 'Natural Organic Woven',
    price_min: 115,
    price_max: 340,
    rating: 4.9,
    reviewCount: 147,
    colors: ['Natural Bamboo', 'Driftwood Jute', 'Toasted Wheat', 'Honey Cane'],
    images: ['/images/cat-roman.jpg'],
    features: ['Cordless', 'Motorized', 'Natural Organic', 'Optional Blackout Liner'],
    room_types: ['Living Room', 'Sunroom', 'Dining Room', 'Primary Bedroom'],
    description: 'Artisanal organic bamboo, wild reeds, and grasses bringing warm earthy textures indoors.',
    brand: 'Lumina Custom',
    is_bestseller: true,
    discount_pct: 20
  },
  {
    id: 'prod-8',
    slug: 'solar-shades',
    name: 'Solar Screen Shades (1% - 10% UV)',
    category: 'shades',
    subcategory: 'Sun & Glare Protection',
    price_min: 95,
    price_max: 260,
    rating: 4.9,
    reviewCount: 104,
    colors: ['Solar Chalk 3%', 'Solar Ash 5%', 'Solar Bronze 1%', 'Solar Charcoal 3%'],
    images: ['/images/cat-roller.jpg'],
    features: ['UV Heat Rejection', 'Glare Reduction', 'Cordless', 'Motorized'],
    room_types: ['Home Office', 'Living Room', 'Kitchen', 'Commercial Glass Vistas'],
    description: 'Engineered solar screen weaves blocking heat and glare while preserving your scenic outdoor view.',
    brand: 'Lumina Custom',
    is_featured: true,
    discount_pct: 20
  },
  {
    id: 'prod-9',
    slug: 'top-down-bottom-up-shades',
    name: 'Top-Down / Bottom-Up Cellular Shades',
    category: 'shades',
    subcategory: 'Versatile Privacy & Light',
    price_min: 125,
    price_max: 340,
    rating: 4.9,
    reviewCount: 182,
    colors: ['Crisp White', 'Linen Sand', 'Misty Gray', 'Soft Cloud'],
    images: ['/images/cat-cellular.jpg'],
    features: ['Top-Down Bottom-Up', 'Thermal Honeycomb Insulation', 'Cordless'],
    room_types: ['Street-Level Townhome', 'Bathroom', 'Bedroom', 'Home Office'],
    description: 'Lower from the top for blue sky and natural daylight while keeping street-level privacy intact.',
    brand: 'Lumina Custom',
    is_bestseller: true,
    discount_pct: 20
  },
  {
    id: 'prod-10',
    slug: 'custom-drapery',
    name: 'Custom Tailored French Drapery',
    category: 'drapery',
    subcategory: 'Handcrafted Drapery & Curtains',
    price_min: 180,
    price_max: 650,
    rating: 5.0,
    reviewCount: 88,
    colors: ['Belgian Natural Linen', 'Champagne Silk', 'Midnight Velvet', 'Ivory Sheer'],
    images: ['/images/product-main.jpg'],
    features: ['Pinch Pleat', 'Ripplefold', 'Blackout Thermal Lining', 'Acoustic Sound Dampening'],
    room_types: ['Formal Living Room', 'Master Bedroom', 'Formal Dining'],
    description: 'Luxury floor-to-ceiling tailored drapery in Belgian linen, velvet, and acoustic thermal liners.',
    brand: 'Lumina Custom',
    is_featured: true,
    discount_pct: 15
  }
];

// Explore Styles Thumbnails for each section
const BLINDS_STYLES = [
  { name: 'Faux Wood Blinds', image: '/images/category-tiles/faux-wood.jpg', slug: 'faux-wood-blinds' },
  { name: 'Wood Blinds', image: '/images/category-tiles/wood-blinds.jpg', slug: 'wood-blinds' },
  { name: 'Mini Blinds', image: '/images/category-tiles/mini-blinds.jpg', slug: 'aluminum-mini-blinds' },
  { name: 'Vertical Blinds', image: '/images/category-tiles/vertical-blinds.jpg', slug: 'vertical-blinds' },
  { name: 'Panel Track', image: '/images/category-tiles/panel-track.jpg', slug: 'panel-track-blinds' }
];

const SHADES_STYLES = [
  { name: 'Cellular Shades', image: '/images/category-tiles/cellular.jpg', slug: 'cellular-honeycomb-shades' },
  { name: 'Roller Shades', image: '/images/category-tiles/roller.jpg', slug: 'roller-shades' },
  { name: 'Roman Shades', image: '/images/category-tiles/roman.jpg', slug: 'roman-shades' },
  { name: 'Woven Wood', image: '/images/category-tiles/woven-wood.jpg', slug: 'woven-wood-shades' },
  { name: 'Outdoor Solar', image: '/images/category-tiles/outdoor-solar.jpg', slug: 'solar-shades' },
  { name: 'Zebra Shades', image: '/images/category-tiles/zebra.jpg', slug: 'zebra-transitional-shades' },
  { name: 'Solar Shades', image: '/images/category-tiles/solar.jpg', slug: 'solar-shades' },
  { name: 'Sheer Shades', image: '/images/category-tiles/sheer.jpg', slug: 'hunter-douglas-silhouette' },
  { name: 'Skylight Shades', image: '/images/category-tiles/skylights.jpg', slug: 'cellular-honeycomb-shades' }
];

const DRAPERY_STYLES = [
  { name: 'Pinch Pleat Drapery', image: '/images/product-main.jpg', slug: 'custom-drapery' },
  { name: 'Ripplefold Panels', image: '/images/category-tiles/roman.jpg', slug: 'custom-drapery' },
  { name: 'Blackout Velvet', image: '/images/product-main.jpg', slug: 'custom-drapery' },
  { name: 'Sheer Silk Linen', image: '/images/category-tiles/sheer.jpg', slug: 'custom-drapery' }
];

const ALL_STYLES = [
  { name: 'Custom Blinds', image: '/images/category-tiles/faux-wood.jpg', link: '/blinds' },
  { name: 'Custom Shades', image: '/images/category-tiles/roller.jpg', link: '/shades' },
  { name: 'Tailored Drapery', image: '/images/product-main.jpg', link: '/drapery' },
  { name: 'Plantation Shutters', image: '/images/category-tiles/wood-blinds.jpg', link: '/shutters' },
  { name: 'Smart Motorized', image: '/images/hero-business.jpg', link: '/motorized' }
];

const SIZE_PRESETS = [
  { label: '24 × 36 in (Small Window)', w: 24, h: 36, factor: 0.8 },
  { label: '36 × 60 in (Standard Window)', w: 36, h: 60, factor: 1.0 },
  { label: '48 × 72 in (Large Picture Window)', w: 48, h: 72, factor: 1.4 },
  { label: '78 × 82 in (Patio Sliding Door)', w: 78, h: 82, factor: 2.1 }
];

const COLOR_SWATCH_MAP = {
  'Bright White': '#FFFFFF',
  'Off-White': '#F8F6F0',
  'Alabaster': '#F2EDE4',
  'Slate Gray': '#708090',
  'Natural Oak': '#C8A97E',
  'Rich Walnut': '#5C4033',
  'Chestnut': '#80471C',
  'Crisp White': '#FFFFFF',
  'Espresso': '#2B1A13',
  'Brushed Aluminum': '#D8D8D8',
  'Gloss White': '#FFFFFF',
  'Matte Black': '#1C1C1C',
  'Silver Metallic': '#A8A8A8',
  'Arctic White': '#FFFFFF',
  'Oyster': '#E8E4D9',
  'Textured Cream': '#ECE6D8',
  'Charcoal': '#37474F',
  'Woven Jute': '#C4A47C',
  'Natural Flax': '#D5C3A5',
  'Stone Gray': '#8E8D8A',
  'White': '#FFFFFF',
  'Ivory': '#FFFFF0',
  'Warm Gray': '#9E9E9E',
  'Midnight Black': '#121212',
  'Natural Bamboo': '#C2A649',
  'Driftwood Jute': '#8C8275',
  'Toasted Wheat': '#D9B575',
  'Honey Cane': '#E6C280',
  'Solar Chalk 3%': '#EDEBE6',
  'Solar Ash 5%': '#8C9297',
  'Solar Bronze 1%': '#4A3C31',
  'Solar Charcoal 3%': '#2A2E33',
  'Linen Sand': '#DFD3C3',
  'Misty Gray': '#B0BEC5',
  'Soft Cloud': '#EAEAEA',
  'Belgian Natural Linen': '#CBB89D',
  'Champagne Silk': '#EAD8B1',
  'Midnight Velvet': '#1A2A3A',
  'Ivory Sheer': '#FAF9F6'
};

const Catalog = ({ onOpenQuote, defaultCategory }) => {
  const location = useLocation();
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'all');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedLightControl, setSelectedLightControl] = useState('all');
  const [selectedControl, setSelectedControl] = useState('all');
  const [sortBy, setSortBy] = useState('bestsellers');

  // Interactive Size Selector
  const [selectedSize, setSelectedSize] = useState(SIZE_PRESETS[1]); // 36x60 standard
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const sizeDropdownRef = useRef(null);

  // Filter Dropdowns State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const filterToolbarRef = useRef(null);

  // Determine path overrides
  const currentPath = location.pathname;
  const isBlindsPath = currentPath.includes('/blinds');
  const isShadesPath = currentPath.includes('/shades');
  const isMotorizedPath = currentPath.includes('/motorized');
  const isDraperyPath = currentPath.includes('/drapery');
  const isShuttersPath = currentPath.includes('/shutters');

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setIsSizeDropdownOpen(false);
      }
      if (filterToolbarRef.current && !filterToolbarRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live products from backend
  useEffect(() => {
    setLoading(true);
    api.getProducts()
      .then(res => {
        if (res.success && res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      })
      .catch(() => {
        console.warn('Using default catalog dataset');
      })
      .finally(() => setLoading(false));
  }, []);

  // Determine which Explore Styles list to render (auto-filter if all products in a style are inactive)
  const exploreStylesList = useMemo(() => {
    let list = isBlindsPath ? BLINDS_STYLES : (isShadesPath ? SHADES_STYLES : (isDraperyPath ? DRAPERY_STYLES : ALL_STYLES));
    if (!products || products.length === 0) return list;

    return list.filter(item => {
      if (item.link) return true;
      // If there are products in memory, only display styles that have at least one active product
      const hasActive = products.some(p => 
        p.is_active !== false && 
        (p.slug === item.slug || 
         p.name.toLowerCase().includes(item.name.toLowerCase()) || 
         (p.subcategory && p.subcategory.toLowerCase().includes(item.name.toLowerCase())))
      );
      return hasActive;
    });
  }, [isBlindsPath, isShadesPath, isDraperyPath, products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 0. Strict Active Status Check: Inactive products must NEVER be shown to customers
      if (product.is_active === false) return false;

      // Path filter
      if (isBlindsPath && product.category !== 'blinds' && !product.name.toLowerCase().includes('blind')) return false;
      if (isShadesPath && product.category !== 'shades' && !product.name.toLowerCase().includes('shade')) return false;
      if (isMotorizedPath && product.category !== 'motorized' && !product.features?.includes('Motorized')) return false;
      if (isDraperyPath && product.category !== 'drapery' && !product.name.toLowerCase().includes('drapery') && !product.name.toLowerCase().includes('curtain')) return false;
      if (isShuttersPath && product.category !== 'shutters' && !product.name.toLowerCase().includes('shutter')) return false;

      // Style thumbnail pill filter
      if (selectedStyleFilter !== 'all') {
        if (product.slug !== selectedStyleFilter && !product.name.toLowerCase().includes(selectedStyleFilter.toLowerCase())) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

      // Color filter
      if (selectedColor !== 'all') {
        const pColors = product.colors || [];
        if (!pColors.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()))) return false;
      }

      // Light Control filter
      if (selectedLightControl !== 'all') {
        const desc = (product.description + ' ' + (product.features || []).join(' ')).toLowerCase();
        if (!desc.includes(selectedLightControl.toLowerCase())) return false;
      }

      // Control filter (Cordless, Motorized)
      if (selectedControl !== 'all') {
        const features = product.features || [];
        if (!features.some(f => f.toLowerCase().includes(selectedControl.toLowerCase()))) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price_min || 0) - (b.price_min || 0);
      if (sortBy === 'price-high') return (b.price_min || 0) - (a.price_min || 0);
      if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
      return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
    });
  }, [products, selectedCategory, selectedStyleFilter, selectedColor, selectedLightControl, selectedControl, sortBy, isBlindsPath, isShadesPath, isMotorizedPath, isDraperyPath, isShuttersPath]);

  const exploreRowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    const el = exploreRowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const slideExplore = (direction) => {
    const el = exploreRowRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 350);
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [exploreStylesList]);

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) +
    (selectedStyleFilter !== 'all' ? 1 : 0) +
    (selectedColor !== 'all' ? 1 : 0) +
    (selectedLightControl !== 'all' ? 1 : 0) +
    (selectedControl !== 'all' ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedStyleFilter('all');
    setSelectedColor('all');
    setSelectedLightControl('all');
    setSelectedControl('all');
  };

  return (
    <div className="catalog-page animate-fade-in container section">
      {/* 1. Explore Styles Visual Carousel */}
      <section className="explore-styles-section">
        <div className="explore-styles-top">
          <h2 className="explore-styles-title">Explore styles</h2>
          <div className="explore-slide-controls">
            <button
              type="button"
              className={`explore-arrow-btn prev ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => slideExplore('left')}
              disabled={!canScrollLeft}
              aria-label="Previous styles"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className={`explore-arrow-btn next ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => slideExplore('right')}
              disabled={!canScrollRight}
              aria-label="Next styles"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="explore-styles-carousel-wrap">
          {canScrollLeft && (
            <button 
              type="button"
              className="explore-floating-arrow prev"
              onClick={() => slideExplore('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div 
            className="explore-styles-row no-scrollbar"
            ref={exploreRowRef}
            onScroll={checkScrollPosition}
          >
            {exploreStylesList.map(item => {
              const isSelected = selectedStyleFilter === item.slug;
              return (
                <button
                  key={item.name}
                  type="button"
                  className={`explore-style-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (item.link) {
                      window.location.href = item.link;
                    } else {
                      setSelectedStyleFilter(isSelected ? 'all' : item.slug);
                    }
                  }}
                >
                  <div className="explore-style-img-wrap">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {isSelected && (
                      <div className="explore-style-check">
                        <CheckCircle2 size={18} color="#ffffff" fill="#252525" />
                      </div>
                    )}
                  </div>
                  <span className="explore-style-name">{item.name}</span>
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <button 
              type="button"
              className="explore-floating-arrow next"
              onClick={() => slideExplore('right')}
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </section>

      {/* 2. Products Count & Dimensions / Sort Meta Bar */}
      <div className="catalog-meta-bar">
        <div className="catalog-count-label">
          <strong>{filteredProducts.length} Products</strong>
          {activeFilterCount > 0 && (
            <span className="active-filter-badge" onClick={resetAllFilters}>
              ({activeFilterCount} filter applied — Clear)
            </span>
          )}
        </div>

        <div className="catalog-meta-actions">
          {/* Price For Size Dropdown */}
          <div className="size-selector-wrap" ref={sizeDropdownRef}>
            <button 
              type="button" 
              className="size-selector-btn"
              onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
            >
              <Ruler size={15} color="var(--color-accent-premium)" />
              <span>Price for: <strong>{selectedSize.w} × {selectedSize.h} inches</strong></span>
              <ChevronDown size={14} />
            </button>

            {isSizeDropdownOpen && (
              <div className="size-dropdown-menu animate-fade-in">
                <div className="size-dropdown-header">
                  <strong>Select Window Dimensions:</strong>
                  <p>All prices below update dynamically for your chosen size.</p>
                </div>
                {SIZE_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`size-dropdown-item ${selectedSize.w === preset.w && selectedSize.h === preset.h ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(preset);
                      setIsSizeDropdownOpen(false);
                    }}
                  >
                    <span>{preset.label}</span>
                    {selectedSize.w === preset.w && selectedSize.h === preset.h && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="sort-dropdown-wrap">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select-pill">
              <option value="bestsellers">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Modern Pill Filter Toolbar */}
      <div className="filter-pills-toolbar" ref={filterToolbarRef}>
        {/* All Filters Pill */}
        <button 
          type="button" 
          className={`filter-pill ${activeFilterCount > 0 ? 'active' : ''}`}
          onClick={resetAllFilters}
        >
          <SlidersHorizontal size={14} />
          <span>{activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'All Filters'}</span>
        </button>

        {/* Category Pill */}
        <div className="filter-pill-dropdown-wrap">
          <button 
            type="button" 
            className={`filter-pill ${selectedCategory !== 'all' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
          >
            <Grid size={14} />
            <span>Category {selectedCategory !== 'all' ? `(${selectedCategory})` : ''}</span>
            <ChevronDown size={13} />
          </button>
          {activeDropdown === 'category' && (
            <div className="filter-dropdown-menu animate-fade-in">
              {['all', 'blinds', 'shades', 'drapery', 'shutters', 'motorized'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-dropdown-opt ${selectedCategory === cat ? 'selected' : ''}`}
                  onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                >
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Pill */}
        <div className="filter-pill-dropdown-wrap">
          <button 
            type="button" 
            className={`filter-pill ${selectedColor !== 'all' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
          >
            <Palette size={14} />
            <span>Color {selectedColor !== 'all' ? `(${selectedColor})` : ''}</span>
            <ChevronDown size={13} />
          </button>
          {activeDropdown === 'color' && (
            <div className="filter-dropdown-menu animate-fade-in">
              {[
                { name: 'All Colors', val: 'all' },
                { name: 'White & Off-White', val: 'white' },
                { name: 'Beige & Linen', val: 'sand' },
                { name: 'Natural Hardwood', val: 'oak' },
                { name: 'Gray & Slate', val: 'gray' },
                { name: 'Charcoal & Black', val: 'black' }
              ].map(c => (
                <button
                  key={c.val}
                  type="button"
                  className={`filter-dropdown-opt ${selectedColor === c.val ? 'selected' : ''}`}
                  onClick={() => { setSelectedColor(c.val); setActiveDropdown(null); }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Light Control Pill */}
        <div className="filter-pill-dropdown-wrap">
          <button 
            type="button" 
            className={`filter-pill ${selectedLightControl !== 'all' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'light' ? null : 'light')}
          >
            <Sun size={14} />
            <span>Light Control {selectedLightControl !== 'all' ? `(${selectedLightControl})` : ''}</span>
            <ChevronDown size={13} />
          </button>
          {activeDropdown === 'light' && (
            <div className="filter-dropdown-menu animate-fade-in">
              {[
                { name: 'All Light Levels', val: 'all' },
                { name: 'Light Filtering (Soft Ambient)', val: 'light-filtering' },
                { name: '100% Blackout / Room Darkening', val: 'blackout' },
                { name: 'Solar UV Glare Rejection', val: 'uv' },
                { name: 'Top-Down Bottom-Up Daylight', val: 'top-down' }
              ].map(l => (
                <button
                  key={l.val}
                  type="button"
                  className={`filter-dropdown-opt ${selectedLightControl === l.val ? 'selected' : ''}`}
                  onClick={() => { setSelectedLightControl(l.val); setActiveDropdown(null); }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Product Card Grid with SelectBlinds-style Clean Aesthetics */}
      {loading ? (
        <div className="catalog-grid" style={{ marginTop: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="product-card skeleton-card">
              <div className="skeleton-image"></div>
              <div className="product-card-body">
                <div className="skeleton-line" style={{ width: '40%' }}></div>
                <div className="skeleton-line" style={{ width: '80%', height: '24px' }}></div>
                <div className="skeleton-line" style={{ width: '100%' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="catalog-empty">
          <h3>No matching window treatments found</h3>
          <p>Try resetting your filter criteria to view all styles.</p>
          <button className="btn btn-primary" onClick={resetAllFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="catalog-grid" style={{ marginTop: '20px' }}>
          {filteredProducts.map(product => {
            const productSlug = product.slug || product.id;
            const primaryImage = (product.images && product.images[0]) || '/images/cat-wood.jpg';
            const baseMin = product.price_min || 89;
            
            // Dynamic price scaled to selected window size
            const calculatedPrice = Math.round(baseMin * selectedSize.factor);
            const originalMSRP = Math.round(calculatedPrice * 1.35); // 25-35% strikethrough comparison

            const productColors = product.colors || ['Bright White', 'Natural Oak', 'Slate Gray', 'Charcoal'];

            return (
              <div key={product.id} className="product-card">
                <div className="product-card-image-wrap">
                  <img src={primaryImage} alt={product.name} className="product-card-image" />
                  
                  {/* SelectBlinds-Style Discount Tag */}
                  <div className="product-card-badge-pill">
                    🏷️ 20% Off Spring Sale
                  </div>

                  {product.is_bestseller && (
                    <span className="product-card-corner-badge">Best Seller</span>
                  )}
                </div>

                <div className="product-card-body">
                  <div className="product-card-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="#D4AF37" color="#D4AF37" />
                      ))}
                    </div>
                    <span>{product.rating || '4.9'} ({product.reviewCount || '118'})</span>
                  </div>

                  <h3 className="product-card-title">
                    <Link to={`/products/${productSlug}`}>{product.name}</Link>
                  </h3>

                  <p className="product-card-desc">
                    {product.short_description || product.description}
                  </p>

                  {/* Swatches Visual Circles */}
                  <div className="product-card-swatches">
                    {productColors.slice(0, 5).map((colorName, idx) => {
                      const hex = COLOR_SWATCH_MAP[colorName] || '#E0DDD4';
                      return (
                        <span 
                          key={idx} 
                          className="swatch-dot" 
                          style={{ backgroundColor: hex, border: hex === '#FFFFFF' ? '1px solid #ccc' : '1px solid rgba(0,0,0,0.1)' }} 
                          title={colorName} 
                        />
                      );
                    })}
                    {productColors.length > 5 && (
                      <span className="swatches-more">+{productColors.length - 5} More</span>
                    )}
                  </div>

                  <div className="product-card-footer">
                    <div className="product-price">
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span className="price-value">${calculatedPrice}</span>
                        <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#999' }}>
                          ${originalMSRP}
                        </span>
                      </div>
                      <span className="price-size-note">for {selectedSize.w}" × {selectedSize.h}"</span>
                    </div>

                    <div className="product-card-actions">
                      <Link to={`/products/${productSlug}`} className="btn btn-secondary btn-sm">
                        Customize
                      </Link>
                      <button className="btn btn-primary btn-sm" onClick={onOpenQuote}>
                        Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Reassurance Banner */}
      <section className="catalog-cta-banner" style={{ marginTop: '48px' }}>
        <div className="cta-banner-content">
          <Sparkles className="cta-icon" size={36} />
          <div>
            <h3>Guaranteed Fit Promise across Montgomery County & DMV</h3>
            <p>Our Gaithersburg laser specialists measure your exact window frames with zero error risk.</p>
          </div>
        </div>
        <button className="btn btn-accent btn-large" onClick={onOpenQuote}>
          Schedule Free In-Home Measure
        </button>
      </section>
    </div>
  );
};

export default Catalog;
