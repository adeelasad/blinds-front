import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, 
  Calendar, 
  FileText, 
  CheckSquare, 
  ShoppingBag, 
  Image, 
  Layers, 
  BarChart3, 
  LogOut, 
  Phone, 
  Mail, 
  Plus, 
  Download, 
  Eye, 
  CheckCircle2, 
  X,
  Search,
  ArrowUpRight,
  RefreshCw,
  Activity,
  Send,
  AlertTriangle,
  ShieldCheck,
  Info,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Power,
  Tag,
  Sliders,
  FolderPlus,
  Sparkles,
  Check
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState(() => 
    sessionStorage.getItem('lumina_admin_key') || 
    localStorage.getItem('lumina_admin_key') || 
    'admin123!'
  );
  const [activeTab, setActiveTab] = useState('leads');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data States
  const [reports, setReports] = useState(null);
  const [leads, setLeads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [samples, setSamples] = useState([]);
  const [emailHealth, setEmailHealth] = useState(null);

  // Product & Category View Sub-tabs
  const [productSubTab, setProductSubTab] = useState('products'); // 'products' | 'categories' | 'matrix'
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');

  // Matrix Pricing & Options State
  const [matrices, setMatrices] = useState(null);
  const [matrixCategory, setMatrixCategory] = useState('shades');
  const [upcharges, setUpcharges] = useState(null);
  const [isSavingMatrix, setIsSavingMatrix] = useState(false);
  const [isSavingUpcharges, setIsSavingUpcharges] = useState(false);
  const [matrixToast, setMatrixToast] = useState('');
  const [bulkAdjustmentPct, setBulkAdjustmentPct] = useState(10);

  // Email Health Diagnostic State
  const [testEmailAddress, setTestEmailAddress] = useState('asad.adeel@gmail.com');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  // Filters & Search for Leads
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [leadSearch, setLeadSearch] = useState('');

  // Quote Builder State
  const [quoteForm, setQuoteForm] = useState({
    customer_name: '',
    customer_email: '',
    product_type: 'Roller Shades',
    window_count: 5,
    width: 36,
    height: 60,
    unit_price: 185.00,
    margin_percent: 35.00
  });
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState('');

  // New Product Modal State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'shades',
    price_min: 99,
    price_max: 280,
    description: '',
    is_featured: false,
    is_bestseller: false,
    is_active: true
  });

  // Edit Product Modal State
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Category Modals State
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    tagline: '',
    description: '',
    icon: '🪟',
    image: '/images/category-tiles/faux-wood.jpg',
    is_active: true
  });

  // Verify auth on mount
  useEffect(() => {
    if (!adminKey) {
      navigate('/admin/login');
    }
  }, [adminKey, navigate]);

  // Fetch all admin data
  const loadAdminData = useCallback(async (silent = false) => {
    if (!adminKey) return;
    if (!silent) setIsRefreshing(true);
    try {
      const [repRes, leadsRes, booksRes, quotesRes, jobsRes, prodsRes, catsRes, galRes, sampsRes, emailHealthRes, matrixRes, upchargesRes] = await Promise.all([
        api.getAdminReports(adminKey).catch(() => ({ reports: null })),
        api.getAdminLeads(adminKey).catch(() => ({ leads: [] })),
        api.getAdminBookings(adminKey).catch(() => ({ bookings: [] })),
        api.getAdminQuotes(adminKey).catch(() => ({ quotes: [] })),
        api.getAdminJobs(adminKey).catch(() => ({ jobs: [] })),
        api.getAdminProducts(adminKey).catch(() => ({ products: [] })),
        api.getAdminCategories(adminKey).catch(() => ({ categories: [] })),
        api.getAdminGallery(adminKey).catch(() => ({ gallery: [] })),
        api.getAdminSamples(adminKey).catch(() => ({ samples: [] })),
        api.getAdminEmailHealth(adminKey).catch(() => ({ health: null })),
        api.getAdminPricingMatrix(adminKey).catch(() => ({ matrices: null })),
        api.getAdminOptionUpcharges(adminKey).catch(() => ({ upcharges: null }))
      ]);

      if (repRes.reports) setReports(repRes.reports);
      if (leadsRes.leads) setLeads(leadsRes.leads);
      if (booksRes.bookings) setBookings(booksRes.bookings);
      if (quotesRes.quotes) setQuotes(quotesRes.quotes);
      if (jobsRes.jobs) setJobs(jobsRes.jobs);
      if (prodsRes.products) setProducts(prodsRes.products);
      if (catsRes.categories) setCategories(catsRes.categories);
      if (galRes.gallery) setGallery(galRes.gallery);
      if (sampsRes.samples) setSamples(sampsRes.samples);
      if (emailHealthRes.health) setEmailHealth(emailHealthRes.health);
      if (matrixRes && matrixRes.matrices) setMatrices(matrixRes.matrices);
      if (upchargesRes && upchargesRes.upcharges) setUpcharges(upchargesRes.upcharges);
    } catch (e) {
      console.warn('Failed to load admin data:', e);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, [adminKey]);

  // Handler to dispatch test email
  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddress) return;
    setTestEmailSending(true);
    setTestEmailResult(null);
    try {
      const res = await api.sendAdminTestEmail(adminKey, testEmailAddress);
      setTestEmailResult(res);
      const updated = await api.getAdminEmailHealth(adminKey);
      if (updated.health) setEmailHealth(updated.health);
    } catch (err) {
      setTestEmailResult({ success: false, error: err.message });
    } finally {
      setTestEmailSending(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    // Auto-refresh every 6 seconds to capture live customer registrations in real time
    const interval = setInterval(() => {
      loadAdminData(true);
    }, 6000);
    return () => clearInterval(interval);
  }, [loadAdminData]);

  // Lead status update handler
  const handleUpdateLeadStatus = async (id, status) => {
    await api.updateAdminLead(adminKey, id, { status });
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  // Booking status update handler
  const handleUpdateBookingStatus = async (id, status) => {
    await api.updateAdminBooking(adminKey, id, { status });
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  // Job status update handler
  const handleUpdateJobStatus = async (id, status) => {
    await api.updateAdminJob(adminKey, id, { status });
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  };

  // Create Quote Handler
  const handleCreateQuote = async (e) => {
    e.preventDefault();
    setQuoteSuccessMsg('');
    const res = await api.createAdminQuote(adminKey, quoteForm);
    if (res.success && res.quote) {
      setQuotes([res.quote, ...quotes]);
      setQuoteSuccessMsg(`Quote #${res.quote.id.slice(-6)} created and emailed to ${quoteForm.customer_email}!`);
      setQuoteForm({
        customer_name: '',
        customer_email: '',
        product_type: 'Roller Shades',
        window_count: 5,
        width: 36,
        height: 60,
        unit_price: 185.00,
        margin_percent: 35.00
      });
    }
  };

  // -------------------------------------------------------------
  // Product Catalog Handlers
  // -------------------------------------------------------------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAdminProduct(adminKey, newProductForm);
      if (res.success && res.product) {
        setProducts([res.product, ...products]);
        setIsNewProductOpen(false);
        setNewProductForm({
          name: '',
          category: 'shades',
          price_min: 99,
          price_max: 280,
          description: '',
          is_featured: false,
          is_bestseller: false,
          is_active: true
        });
      }
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const handleToggleProductStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistic update
    setProducts(products.map(p => p.id === id ? { ...p, is_active: newStatus } : p));
    try {
      await api.toggleAdminProductStatus(adminKey, id, newStatus);
    } catch (err) {
      console.error('Failed to toggle product status:', err);
      // Rollback
      setProducts(products.map(p => p.id === id ? { ...p, is_active: currentStatus } : p));
    }
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct({
      ...product,
      price_min: product.price_min || 0,
      price_max: product.price_max || 0,
      description: product.description || '',
      category: product.category || 'shades',
      is_featured: !!product.is_featured,
      is_bestseller: !!product.is_bestseller,
      is_active: product.is_active !== false
    });
    setIsEditProductOpen(true);
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await api.updateAdminProduct(adminKey, editingProduct.id, editingProduct);
      if (res.success && res.product) {
        setProducts(products.map(p => p.id === editingProduct.id ? res.product : p));
        setIsEditProductOpen(false);
        setEditingProduct(null);
      }
    } catch (err) {
      alert('Failed to save product edits: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the product catalog?`)) return;
    try {
      await api.deleteAdminProduct(adminKey, id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Category Management Handlers
  // -------------------------------------------------------------
  const handleToggleCategoryStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistic update
    setCategories(categories.map(c => c.id === id ? { ...c, is_active: newStatus } : c));
    try {
      await api.toggleAdminCategoryStatus(adminKey, id, newStatus);
    } catch (err) {
      console.error('Failed to toggle category status:', err);
      setCategories(categories.map(c => c.id === id ? { ...c, is_active: currentStatus } : c));
    }
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      tagline: cat.tagline || '',
      description: cat.description || '',
      icon: cat.icon || '🪟',
      image: cat.image || '/images/category-tiles/faux-wood.jpg',
      is_active: cat.is_active !== false
    });
    setIsEditCategoryOpen(true);
  };

  const handleSaveNewCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAdminCategory(adminKey, categoryForm);
      if (res.success && res.category) {
        setCategories([...categories, res.category]);
        setIsNewCategoryOpen(false);
        setCategoryForm({
          name: '',
          tagline: '',
          description: '',
          icon: '🪟',
          image: '/images/category-tiles/faux-wood.jpg',
          is_active: true
        });
      }
    } catch (err) {
      alert('Failed to create category: ' + err.message);
    }
  };

  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await api.updateAdminCategory(adminKey, editingCategory.id, categoryForm);
      if (res.success && res.category) {
        setCategories(categories.map(c => c.id === editingCategory.id ? res.category : c));
        setIsEditCategoryOpen(false);
        setEditingCategory(null);
      }
    } catch (err) {
      alert('Failed to update category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Existing products in this category will remain.`)) return;
    try {
      await api.deleteAdminCategory(adminKey, id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Matrix Pricing & Upcharge Handlers
  // -------------------------------------------------------------
  const handleMatrixCellChange = (width, height, value) => {
    if (!matrices || !matrices[matrixCategory]) return;
    const numVal = parseFloat(value) || 0;
    const updated = JSON.parse(JSON.stringify(matrices));
    if (!updated[matrixCategory][width]) updated[matrixCategory][width] = {};
    updated[matrixCategory][width][height] = numVal;
    setMatrices(updated);
  };

  const handleBulkMatrixAdjust = (multiplierPct) => {
    if (!matrices || !matrices[matrixCategory]) return;
    const factor = 1 + (multiplierPct / 100);
    const updated = JSON.parse(JSON.stringify(matrices));
    const currentGrid = updated[matrixCategory];
    Object.keys(currentGrid).forEach(w => {
      Object.keys(currentGrid[w]).forEach(h => {
        currentGrid[w][h] = Math.round(currentGrid[w][h] * factor);
      });
    });
    setMatrices(updated);
  };

  const handleSaveMatrix = async () => {
    if (!matrices || !matrices[matrixCategory]) return;
    setIsSavingMatrix(true);
    try {
      const res = await api.updateAdminPricingMatrix(adminKey, matrixCategory, matrices[matrixCategory]);
      if (res.success) {
        setMatrixToast(`Pricing matrix for ${matrixCategory.toUpperCase()} saved successfully!`);
        setTimeout(() => setMatrixToast(''), 3000);
      }
    } catch (err) {
      alert('Failed to save matrix: ' + err.message);
    } finally {
      setIsSavingMatrix(false);
    }
  };

  const handleUpchargeChange = (sectionKey, index, field, value) => {
    if (!upcharges || !upcharges[sectionKey]) return;
    const updated = JSON.parse(JSON.stringify(upcharges));
    updated[sectionKey][index][field] = field === 'upcharge' ? parseFloat(value) || 0 : value;
    setUpcharges(updated);
  };

  const handleSaveUpcharges = async () => {
    if (!upcharges) return;
    setIsSavingUpcharges(true);
    try {
      const res = await api.updateAdminOptionUpcharges(adminKey, upcharges);
      if (res.success) {
        setMatrixToast('Option Upcharges saved successfully!');
        setTimeout(() => setMatrixToast(''), 3000);
      }
    } catch (err) {
      alert('Failed to save upcharges: ' + err.message);
    } finally {
      setIsSavingUpcharges(false);
    }
  };

  // Gallery toggle handler
  const handleToggleGallery = async (id, currentPublished) => {
    const published = !currentPublished;
    await api.updateAdminGallery(adminKey, id, { published });
    setGallery(gallery.map(g => g.id === id ? { ...g, published } : g));
  };

  // Sample status update handler
  const handleUpdateSampleStatus = async (id, status) => {
    await api.updateAdminSample(adminKey, id, { status });
    setSamples(samples.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lumina_admin_key');
    localStorage.removeItem('lumina_admin_key');
    setAdminKey('');
    navigate('/admin/login');
  };

  // Filtered Leads (with full null safety)
  const filteredLeads = leads.filter(l => {
    const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
    const matchesSource = leadSourceFilter === 'all' || l.source === leadSourceFilter;
    const searchLower = (leadSearch || '').toLowerCase();
    const matchesSearch = !leadSearch || 
      (l.name && l.name.toLowerCase().includes(searchLower)) ||
      (l.email && l.email.toLowerCase().includes(searchLower)) ||
      (l.phone && l.phone.includes(leadSearch)) ||
      (l.city && l.city.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSource && matchesSearch;
  });

  return (
    <div className="admin-app-layout animate-fade-in">
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-icon">🪟</span>
          <div>
            <h3>Lumina Admin</h3>
            <span className="admin-brand-status">🟢 DMV Operations Hub</span>
          </div>
        </div>

        {/* Sidebar Nav Tabs */}
        <nav className="admin-sidebar-nav">
          <div className="sidebar-section-label">Core Operations</div>
          <button 
            className={`sidebar-tab ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <Users size={18} />
            <span>Leads CRM</span>
            {leads.length > 0 && <span className="sidebar-badge">{leads.length}</span>}
          </button>

          <button 
            className={`sidebar-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={18} />
            <span>In-Home Bookings</span>
            {bookings.length > 0 && <span className="sidebar-badge">{bookings.length}</span>}
          </button>

          <button 
            className={`sidebar-tab ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            <FileText size={18} />
            <span>Quote Builder</span>
            {quotes.length > 0 && <span className="sidebar-badge">{quotes.length}</span>}
          </button>

          <button 
            className={`sidebar-tab ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <CheckSquare size={18} />
            <span>Installation Jobs</span>
            {jobs.length > 0 && <span className="sidebar-badge">{jobs.length}</span>}
          </button>

          <div className="sidebar-section-label">Catalog & Samples</div>
          <button 
            className={`sidebar-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={18} />
            <span>Products Catalog</span>
            <span className="sidebar-badge">{products.length}</span>
          </button>

          <button 
            className={`sidebar-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Image size={18} />
            <span>Portfolio Gallery</span>
            <span className="sidebar-badge">{gallery.length}</span>
          </button>

          <button 
            className={`sidebar-tab ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            <Layers size={18} />
            <span>Fabric Swatches</span>
            <span className="sidebar-badge">{samples.length}</span>
          </button>

          <div className="sidebar-section-label">System & Insights</div>
          <button 
            className={`sidebar-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 size={18} />
            <span>Analytics & Reports</span>
          </button>

          <button 
            className={`sidebar-tab ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <Activity size={18} />
            <span>Email & System Health</span>
            {emailHealth && emailHealth.failed_count > 0 ? (
              <span className="sidebar-badge danger">!</span>
            ) : (
              <span className="sidebar-badge">OK</span>
            )}
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button className="sidebar-footer-btn" onClick={() => window.open('/installer', '_blank')}>
            <Eye size={16} /> Open Installer View
          </button>
          <button className="sidebar-footer-btn danger" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out Admin
          </button>
          <div className="sidebar-hq-note">
            <span>📍 Gaithersburg HQ</span>
            <span>v2.4</span>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT MAIN WORKSPACE AREA */}
      <main className="admin-main-area">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div>
            <span className="trade-badge" style={{ marginBottom: '6px', display: 'inline-block' }}>
              Gaithersburg HQ • DMV Operations Dispatch
            </span>
            <h1 className="admin-page-title">
              {activeTab === 'leads' && 'Leads Management CRM'}
              {activeTab === 'bookings' && 'In-Home Consultations & Measurement Schedule'}
              {activeTab === 'quotes' && 'Custom Window Treatment Quote Builder'}
              {activeTab === 'jobs' && 'Installation Job Tracker & Dispatch'}
              {activeTab === 'products' && 'Product Lines & Catalog Management'}
              {activeTab === 'gallery' && 'Portfolio & Completed Projects Gallery'}
              {activeTab === 'samples' && 'Customer Fabric Swatch Orders'}
              {activeTab === 'reports' && 'DMV Business Analytics & Revenue Reports'}
              {activeTab === 'health' && 'Email Dispatch Diagnostics & System Health'}
            </h1>
            <p className="admin-page-subtitle">
              Serving Gaithersburg, Bethesda, Potomac, DC & Northern Virginia
            </p>
          </div>

          <div className="admin-topbar-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => loadAdminData(false)}
              disabled={isRefreshing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh CRM'}
            </button>
          </div>
        </header>

        {/* KPI Metric Cards */}
        <div className="admin-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Revenue This Month</span>
            <span className="kpi-val">{reports ? reports.revenue_formatted : '$24,750'}</span>
            <span className="kpi-sub">Across DC, MD & Northern VA</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">New Leads</span>
            <span className="kpi-val" style={{ color: 'var(--color-accent-primary)' }}>
              {leads.filter(l => l.status === 'new').length}
            </span>
            <span className="kpi-sub">Awaiting initial outreach</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Active Installation Jobs</span>
            <span className="kpi-val">{jobs.filter(j => j.status !== 'completed').length}</span>
            <span className="kpi-sub">In measurement or fabrication</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Close Rate</span>
            <span className="kpi-val" style={{ color: '#2e7d32' }}>
              {reports ? `${reports.close_rate_percent}%` : '42%'}
            </span>
            <span className="kpi-sub">Consultation to deposit paid</span>
          </div>
        </div>

        {/* Workspace Tab Contents Loaded on the Right */}
        <div className="admin-workspace-body">
        {/* ==================================================================
            TAB 1: LEADS CRM
            ================================================================== */}
        {activeTab === 'leads' && (
          <div className="admin-section animate-fade-in">
            <div className="admin-toolbar">
              <div className="search-wrap">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search name, email, phone, city..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />
              </div>

              <div className="filters-wrap">
                <select value={leadStatusFilter} onChange={(e) => setLeadStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="new">New (Uncontacted)</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="won">Won (Deposit Paid)</option>
                  <option value="lost">Lost</option>
                </select>

                <select value={leadSourceFilter} onChange={(e) => setLeadSourceFilter(e.target.value)}>
                  <option value="all">All Channels</option>
                  <option value="google">Google Ads</option>
                  <option value="facebook">Facebook / Meta</option>
                  <option value="craigslist">Craigslist</option>
                  <option value="website">Organic Website</option>
                  <option value="website-contact">Contact Page</option>
                  <option value="trade">Trade Portal</option>
                </select>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Contact Info</th>
                    <th>City / Address</th>
                    <th>Source / UTM</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <a href={`tel:${lead.phone}`} style={{ color: 'var(--color-primary-text)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} /> {lead.phone}
                          </a>
                          <a href={`mailto:${lead.email}`} style={{ color: 'var(--color-secondary-text)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} /> {lead.email}
                          </a>
                        </div>
                      </td>
                      <td>
                        <span>{lead.city || 'Gaithersburg'}</span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>{lead.address || 'DMV area'}</div>
                      </td>
                      <td>
                        <span className="source-badge">{lead.source}</span>
                        {lead.utm_campaign && lead.utm_campaign !== 'none' && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                            {lead.utm_campaign}
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          className={`status-select ${lead.status}`}
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setQuoteForm({
                              ...quoteForm,
                              customer_name: lead.name,
                              customer_email: lead.email
                            });
                            setActiveTab('quotes');
                          }}
                          title="Generate Quote for this Lead"
                        >
                          Create Quote <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 2: BOOKINGS CALENDAR
            ================================================================== */}
        {activeTab === 'bookings' && (
          <div className="admin-section animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>In-Home Consultation Schedule</h2>
                <p>Appointments scheduled across Montgomery County, DC, and Northern Virginia.</p>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date & Time</th>
                    <th>Service Location</th>
                    <th>Scope</th>
                    <th>Assigned Tech</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                          <a href={`tel:${b.phone}`}>{b.phone}</a>
                        </div>
                      </td>
                      <td>
                        <strong>{b.date}</strong>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-accent-premium)' }}>{b.time}</div>
                      </td>
                      <td>
                        <span>{b.address}</span>
                      </td>
                      <td>
                        <span>{b.window_count || '1-5 windows'}</span>
                      </td>
                      <td>
                        <span>Marcus Taylor (DMV Lead)</span>
                      </td>
                      <td>
                        <select
                          className={`status-select ${b.status}`}
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 3: QUOTE BUILDER & PDF GENERATOR
            ================================================================== */}
        {activeTab === 'quotes' && (
          <div className="admin-section animate-fade-in">
            <div className="profile-grid">
              {/* Form */}
              <div className="profile-card">
                <h3>Build Custom Window Quote</h3>
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', marginBottom: 'var(--spacing-6)' }}>
                  Generates an itemized PDF estimate and emails a Stripe deposit link to the client.
                </p>

                {quoteSuccessMsg && (
                  <div className="auth-alert success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} />
                    <span>{quoteSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateQuote} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Customer Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Sarah Jenkins"
                        value={quoteForm.customer_name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, customer_name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Customer Email *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="sarah@example.com"
                        value={quoteForm.customer_email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, customer_email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Treatment</label>
                      <select 
                        value={quoteForm.product_type}
                        onChange={(e) => setQuoteForm({ ...quoteForm, product_type: e.target.value })}
                      >
                        <option value="Roller Shades (Solar & Blackout)">Roller Shades (Solar & Blackout)</option>
                        <option value="Tailored Linen Roman Shades">Tailored Linen Roman Shades</option>
                        <option value="Natural Hardwood Blinds">Natural Hardwood Blinds</option>
                        <option value="Cellular Honeycomb Thermal Shades">Cellular Honeycomb Thermal Shades</option>
                        <option value="Hunter Douglas Silhouette Sheer Vanes">Hunter Douglas Silhouette Sheer Vanes</option>
                        <option value="Plantation Shutters (Custom Wood)">Plantation Shutters (Custom Wood)</option>
                        <option value="Hunter Douglas PowerView Motorized">Hunter Douglas PowerView Motorized</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Window Count</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={quoteForm.window_count}
                        onChange={(e) => setQuoteForm({ ...quoteForm, window_count: parseInt(e.target.value, 10) || 1 })}
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="form-group">
                      <label>Unit Price ($)</label>
                      <input 
                        type="number" 
                        step="5"
                        value={quoteForm.unit_price}
                        onChange={(e) => setQuoteForm({ ...quoteForm, unit_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Margin %</label>
                      <input 
                        type="number" 
                        value={quoteForm.margin_percent}
                        onChange={(e) => setQuoteForm({ ...quoteForm, margin_percent: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Calculated Total</label>
                      <input 
                        type="text" 
                        disabled
                        value={`$${(quoteForm.window_count * quoteForm.unit_price).toFixed(2)}`}
                        style={{ fontWeight: 'bold', background: 'var(--color-secondary-bg)' }}
                      />
                    </div>
                  </div>

                  <div style={{ background: '#f7f5f0', padding: '12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>Financial Breakdown:</strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span>50% Required Deposit:</span>
                      <strong>${((quoteForm.window_count * quoteForm.unit_price) * 0.5).toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Balance on Completion:</span>
                      <strong>${((quoteForm.window_count * quoteForm.unit_price) * 0.5).toFixed(2)}</strong>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-large full-width">
                    Generate PDF Estimate & Email Customer
                  </button>
                </form>
              </div>

              {/* Recent Quotes List */}
              <div className="profile-card">
                <h3>Recent Sent Quotes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                  {quotes.map(q => (
                    <div key={q.id} style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{q.customer_name}</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-primary-text)' }}>
                          ${Number(q.total_price).toFixed(2)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
                        {q.product_type} • {q.window_count} units
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                        <span className={`status-pill ${q.status}`}>{q.status}</span>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            const w = window.open();
                            w.document.write(`<html><body style="font-family: sans-serif; padding: 40px;"><h2>Lumina Official Estimate #${q.id}</h2><p>Customer: ${q.customer_name}</p><p>Product: ${q.product_type}</p><p>Total: $${q.total_price}</p><p>Deposit (50%): $${q.deposit_amount}</p></body></html>`);
                          }}
                        >
                          <Download size={14} /> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 4: INSTALLATION JOBS
            ================================================================== */}
        {activeTab === 'jobs' && (
          <div className="admin-section animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Field Installation Jobs</h2>
                <p>Track checklists and verify on-site job completion for Maryland, DC, and Virginia projects.</p>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer & Address</th>
                    <th>Product Specs</th>
                    <th>Installer Checklist Status</th>
                    <th>Assigned Tech</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td>
                        <strong>{j.customer_name}</strong>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>{j.address}</div>
                      </td>
                      <td>
                        <span>{j.product_type}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.8rem' }}>
                          <span title="Arrived" style={{ color: j.checklist_arrived ? '#2e7d32' : '#999' }}>📍 Arrived</span>
                          <span title="Measured" style={{ color: j.checklist_measured ? '#2e7d32' : '#999' }}>📏 Measured</span>
                          <span title="Installed" style={{ color: j.checklist_installed ? '#2e7d32' : '#999' }}>🔨 Installed</span>
                          <span title="Cleaned" style={{ color: j.checklist_cleaned ? '#2e7d32' : '#999' }}>✨ Cleaned</span>
                        </div>
                      </td>
                      <td>
                        <span>Marcus Taylor</span>
                      </td>
                      <td>
                        <select
                          className={`status-select ${j.status}`}
                          value={j.status}
                          onChange={(e) => handleUpdateJobStatus(j.id, e.target.value)}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 5: PRODUCT CATALOG & CATEGORY MANAGEMENT
            ================================================================== */}
        {activeTab === 'products' && (
          <div className="admin-section animate-fade-in">
            {/* Top Sub-navigation & Add Button */}
            <div className="tab-header-row" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2>Product Catalog & Category Hub</h2>
                <p>Manage product lines, live store pricing, category collections, and active/inactive visibility.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="admin-subnav-pills">
                  <button 
                    type="button"
                    className={`subnav-pill ${productSubTab === 'products' ? 'active' : ''}`}
                    onClick={() => setProductSubTab('products')}
                  >
                    <ShoppingBag size={16} /> Products ({products.length})
                  </button>
                  <button 
                    type="button"
                    className={`subnav-pill ${productSubTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setProductSubTab('categories')}
                  >
                    <Tag size={16} /> Categories ({categories.length})
                  </button>
                  <button 
                    type="button"
                    className={`subnav-pill ${productSubTab === 'matrix' ? 'active' : ''}`}
                    onClick={() => setProductSubTab('matrix')}
                  >
                    <Sliders size={16} /> 📊 Matrix Pricing & Upcharges
                  </button>
                </div>

                {productSubTab === 'products' && (
                  <button className="btn btn-primary btn-sm" onClick={() => setIsNewProductOpen(true)}>
                    <Plus size={16} /> Add New Product
                  </button>
                )}

                {productSubTab === 'categories' && (
                  <button className="btn btn-primary btn-sm" onClick={() => setIsNewCategoryOpen(true)}>
                    <FolderPlus size={16} /> Add New Category
                  </button>
                )}

                {productSubTab === 'matrix' && (
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={handleSaveMatrix}
                    disabled={isSavingMatrix}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Check size={16} /> {isSavingMatrix ? 'Saving Matrix...' : 'Save Current Matrix'}
                  </button>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------
                SUB-VIEW 1: PRODUCTS LIST
                ------------------------------------------------------------- */}
            {productSubTab === 'products' && (
              <>
                {/* Product Filters Toolbar */}
                <div className="admin-filters-row" style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <div className="search-box" style={{ flex: '1 1 240px' }}>
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search products by title, feature, or brand..." 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select 
                      className="admin-select"
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories ({products.length})</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>
                          {c.icon || '🪟'} {c.name}
                        </option>
                      ))}
                    </select>

                    <select 
                      className="admin-select"
                      value={productStatusFilter}
                      onChange={(e) => setProductStatusFilter(e.target.value)}
                    >
                      <option value="all">All Visibility Statuses</option>
                      <option value="active">🟢 Active Only ({products.filter(p => p.is_active !== false).length})</option>
                      <option value="inactive">🔴 Inactive / Hidden ({products.filter(p => p.is_active === false).length})</option>
                    </select>
                  </div>
                </div>

                {/* Products Table */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product & Details</th>
                        <th>Category</th>
                        <th>Base Price Range</th>
                        <th>Badges</th>
                        <th>Store Status (1-Click Toggle)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(p => {
                          const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
                          const matchesStatus = productStatusFilter === 'all' || 
                            (productStatusFilter === 'active' && p.is_active !== false) ||
                            (productStatusFilter === 'inactive' && p.is_active === false);
                          const searchLower = (productSearch || '').toLowerCase();
                          const matchesSearch = !productSearch || 
                            (p.name && p.name.toLowerCase().includes(searchLower)) ||
                            (p.category && p.category.toLowerCase().includes(searchLower)) ||
                            (p.subcategory && p.subcategory.toLowerCase().includes(searchLower)) ||
                            (p.description && p.description.toLowerCase().includes(searchLower));
                          return matchesCat && matchesStatus && matchesSearch;
                        })
                        .map(p => {
                          const isActive = p.is_active !== false;
                          const matchedCategory = categories.find(c => c.slug === p.category);
                          return (
                            <tr key={p.id} style={{ opacity: isActive ? 1 : 0.75 }}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#eee',
                                    flexShrink: 0,
                                    border: '1px solid #ddd'
                                  }}>
                                    <img 
                                      src={p.images?.[0] || '/images/cat-roller.jpg'} 
                                      alt={p.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div>
                                    <strong style={{ color: 'var(--color-primary-text)', fontSize: '0.95rem' }}>{p.name}</strong>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', display: 'flex', gap: '6px' }}>
                                      <span>{p.brand || 'Lumina Custom'}</span>
                                      {p.subcategory && <span>• {p.subcategory}</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="source-badge">
                                  {matchedCategory?.icon || '🪟'} {matchedCategory?.name || p.category}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: '#252525' }}>${p.price_min || 0} – ${p.price_max || p.price_min * 2}</strong>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  {p.is_featured && <span className="status-pill in-production">Featured</span>}
                                  {p.is_bestseller && <span className="status-pill deposit-paid">Bestseller</span>}
                                  {!p.is_featured && !p.is_bestseller && <span style={{ color: '#999', fontSize: '0.8rem' }}>—</span>}
                                </div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={`admin-toggle-btn ${isActive ? 'active' : 'inactive'}`}
                                  onClick={() => handleToggleProductStatus(p.id, isActive)}
                                  title={`Click to set ${isActive ? 'Inactive (hide from customer site)' : 'Active (show on customer site)'}`}
                                >
                                  {isActive ? (
                                    <>
                                      <ToggleRight size={18} color="#2e7d32" />
                                      <span>🟢 Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft size={18} color="#c62828" />
                                      <span>🔴 Inactive</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleOpenEditProduct(p)}
                                    style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button 
                                    className="btn btn-secondary btn-sm danger"
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    style={{ padding: '4px 8px', color: '#c62828' }}
                                    title="Delete product"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* -------------------------------------------------------------
                SUB-VIEW 2: CATEGORY & COLLECTION MANAGEMENT
                ------------------------------------------------------------- */}
            {productSubTab === 'categories' && (
              <div style={{ marginTop: '16px' }}>
                <div className="admin-categories-grid">
                  {categories.map(cat => {
                    const assignedProductsCount = products.filter(p => p.category === cat.slug).length;
                    const isCatActive = cat.is_active !== false;

                    return (
                      <div key={cat.id} className="admin-category-card" style={{ opacity: isCatActive ? 1 : 0.75 }}>
                        <div className="cat-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.6rem' }}>{cat.icon || '🪟'}</span>
                            <div>
                              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{cat.name}</h3>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Slug: /{cat.slug}</span>
                            </div>
                          </div>
                          <span className="source-badge">
                            {assignedProductsCount} Products
                          </span>
                        </div>

                        {cat.tagline && (
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent-primary)', marginTop: '8px' }}>
                            {cat.tagline}
                          </div>
                        )}

                        <p style={{ fontSize: '0.82rem', color: '#555', margin: '8px 0 14px', lineHeight: 1.4 }}>
                          {cat.description || 'No description provided.'}
                        </p>

                        <div className="cat-card-footer">
                          {/* 1-Click Category Active/Inactive Toggle */}
                          <button
                            type="button"
                            className={`admin-toggle-btn ${isCatActive ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleCategoryStatus(cat.id, isCatActive)}
                            title={`Toggle category visibility`}
                          >
                            {isCatActive ? (
                              <>
                                <ToggleRight size={18} color="#2e7d32" />
                                <span>🟢 Active</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={18} color="#c62828" />
                                <span>🔴 Inactive</span>
                              </>
                            )}
                          </button>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditCategory(cat)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm danger"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              style={{ color: '#c62828' }}
                              title="Delete category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                SUB-VIEW 3: 2D MATRIX PRICING GRID & OPTION UPCHARGES
                ------------------------------------------------------------- */}
            {productSubTab === 'matrix' && (
              <div style={{ marginTop: '16px' }}>
                {matrixToast && (
                  <div className="added-toast animate-fade-in" style={{ marginBottom: '16px' }}>
                    <Check size={18} color="#2e7d32" />
                    <span>{matrixToast}</span>
                  </div>
                )}

                {/* Category Switcher Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'shades', label: '🪟 Window Shades Matrix' },
                    { key: 'blinds', label: '🪵 Custom Blinds Matrix' },
                    { key: 'drapery', label: '✨ Custom Drapery Matrix' },
                    { key: 'shutters', label: '🏛️ Plantation Shutters Matrix' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      className={`btn btn-sm ${matrixCategory === tab.key ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setMatrixCategory(tab.key)}
                      style={{ padding: '8px 16px', fontWeight: 600 }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Bulk Matrix Actions */}
                <div className="admin-filters-row" style={{ marginBottom: '16px', backgroundColor: '#f5f4ef', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.9rem' }}>⚡ Quick Batch Price Adjuster:</strong>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleBulkMatrixAdjust(5)}
                    >
                      +5% Increase
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleBulkMatrixAdjust(10)}
                    >
                      +10% Increase
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleBulkMatrixAdjust(-5)}
                    >
                      -5% Discount
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleBulkMatrixAdjust(-10)}
                    >
                      -10% Discount
                    </button>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveMatrix}
                    disabled={isSavingMatrix}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Check size={16} /> {isSavingMatrix ? 'Saving Grid...' : `Save ${matrixCategory.toUpperCase()} Matrix`}
                  </button>
                </div>

                {/* 2D Matrix Table Grid */}
                {matrices && matrices[matrixCategory] ? (
                  <div className="admin-table-container" style={{ overflowX: 'auto', marginBottom: '32px' }}>
                    <table className="admin-table matrix-table" style={{ textAlign: 'center', minWidth: '850px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#252525', color: '#fff' }}>
                          <th style={{ color: '#fff', textAlign: 'left', minWidth: '110px' }}>Height \ Width</th>
                          {[24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96].map(w => (
                            <th key={w} style={{ color: '#fff', textAlign: 'center', padding: '8px 4px' }}>
                              {w}" W
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[36, 48, 60, 72, 84, 96, 108].map(h => (
                          <tr key={h}>
                            <td style={{ fontWeight: 700, textAlign: 'left', backgroundColor: '#faf9f6' }}>
                              {h}" H
                            </td>
                            {[24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96].map(w => {
                              const cellValue = matrices[matrixCategory]?.[w]?.[h] ?? 0;
                              return (
                                <td key={w} style={{ padding: '4px' }}>
                                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                    <span style={{ position: 'absolute', left: '6px', top: '7px', fontSize: '0.75rem', color: '#888' }}>$</span>
                                    <input 
                                      type="number"
                                      value={cellValue}
                                      onChange={(e) => handleMatrixCellChange(w, h, e.target.value)}
                                      style={{
                                        width: '100%',
                                        padding: '6px 4px 6px 16px',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        fontSize: '0.86rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                      }}
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="skeleton-line" style={{ height: '200px', width: '100%', marginBottom: '30px' }}></div>
                )}

                {/* Option Upcharges Manager */}
                <div style={{ borderTop: '2px solid #eee', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>⚙️ Customization Option Upcharges</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
                        Control fixed upcharges for lift motors, cassette valances, bottom rails, and warranty protection.
                      </p>
                    </div>

                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveUpcharges}
                      disabled={isSavingUpcharges}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={16} /> {isSavingUpcharges ? 'Saving Upcharges...' : 'Save Option Upcharges'}
                    </button>
                  </div>

                  {upcharges && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                      {/* Lift Systems */}
                      <div className="admin-category-card">
                        <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                          🎛️ Lift & Control Systems
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {upcharges.lift_systems?.map((item, idx) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: '0.85rem' }}>{item.name}</strong>
                                {item.tag && <span className="option-badge" style={{ marginLeft: '6px', fontSize: '0.68rem' }}>{item.tag}</span>}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '90px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>+$</span>
                                <input 
                                  type="number"
                                  className="admin-input"
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', textAlign: 'right' }}
                                  value={item.upcharge}
                                  onChange={(e) => handleUpchargeChange('lift_systems', idx, 'upcharge', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cassettes & Headrails */}
                      <div className="admin-category-card">
                        <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                          👑 Headrails & Cassettes
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {upcharges.cassettes?.map((item, idx) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: '0.85rem' }}>{item.name}</strong>
                                <p style={{ fontSize: '0.75rem', color: '#666', margin: '2px 0 0' }}>{item.desc}</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '90px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>+$</span>
                                <input 
                                  type="number"
                                  className="admin-input"
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', textAlign: 'right' }}
                                  value={item.upcharge}
                                  onChange={(e) => handleUpchargeChange('cassettes', idx, 'upcharge', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Rails & Hem Bars */}
                      <div className="admin-category-card">
                        <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                          📏 Bottom Hem Bars
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {upcharges.bottom_rails?.map((item, idx) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: '0.85rem' }}>{item.name}</strong>
                                <p style={{ fontSize: '0.75rem', color: '#666', margin: '2px 0 0' }}>{item.desc}</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '90px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>+$</span>
                                <input 
                                  type="number"
                                  className="admin-input"
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', textAlign: 'right' }}
                                  value={item.upcharge}
                                  onChange={(e) => handleUpchargeChange('bottom_rails', idx, 'upcharge', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Warranties */}
                      <div className="admin-category-card">
                        <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                          🛡️ Protection Plans
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {upcharges.warranties?.map((item, idx) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: '0.85rem' }}>{item.name}</strong>
                                <p style={{ fontSize: '0.75rem', color: '#666', margin: '2px 0 0' }}>{item.desc}</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '90px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>+$</span>
                                <input 
                                  type="number"
                                  step="0.01"
                                  className="admin-input"
                                  style={{ padding: '4px 8px', fontSize: '0.85rem', textAlign: 'right' }}
                                  value={item.upcharge}
                                  onChange={(e) => handleUpchargeChange('warranties', idx, 'upcharge', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 6: GALLERY & SAMPLES
            ================================================================== */}
        {activeTab === 'gallery' && (
          <div className="admin-section animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Photo Gallery Moderation</h2>
                <p>Approve and publish before/after project photos from field technicians.</p>
              </div>
            </div>

            <div className="lookbook-grid">
              {gallery.map(g => (
                <div key={g.id} className="lookbook-card">
                  <div className="lookbook-image-wrap">
                    <img src={g.after_image_url} alt={g.product_used} className="lookbook-image" />
                    <span className="lookbook-room-tag">{g.room_type} • {g.city}</span>
                  </div>
                  <div className="lookbook-info">
                    <h3>{g.product_used}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-4)' }}>
                      <span className={`status-pill ${g.published ? 'completed' : 'quote-sent'}`}>
                        {g.published ? 'Published Live' : 'Hidden'}
                      </span>
                      <button 
                        className={`btn btn-sm ${g.published ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleGallery(g.id, g.published)}
                      >
                        {g.published ? 'Hide Photo' : 'Approve & Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 7: SWATCH SAMPLES FULFILLMENT
            ================================================================== */}
        {activeTab === 'samples' && (
          <div className="admin-section animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Fabric Swatch Fulfillment</h2>
                <p>Customer requested sample kits awaiting postal dispatch.</p>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Requested Fabric</th>
                    <th>Mailing Address</th>
                    <th>Date Requested</th>
                    <th>Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map(s => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>{s.email}</div>
                      </td>
                      <td>
                        <strong>{s.product_name}</strong>
                      </td>
                      <td>
                        <span>{s.address}, {s.zip}</span>
                      </td>
                      <td>
                        <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      </td>
                      <td>
                        <select
                          className={`status-select ${s.status}`}
                          value={s.status}
                          onChange={(e) => handleUpdateSampleStatus(s.id, e.target.value)}
                        >
                          <option value="requested">Requested</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 8: ANALYTICS & REPORTS
            ================================================================== */}
        {activeTab === 'reports' && reports && (
          <div className="admin-section animate-fade-in">
            <div className="tab-header-row">
              <div>
                <h2>Business Analytics & Growth</h2>
                <p>Performance metrics across DC, Maryland, and Northern Virginia sales channels.</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-card">
                <h3>Leads by Advertising Source</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                  {Object.entries(reports.leads_by_source || {}).map(([source, count]) => (
                    <div key={source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span className="source-badge" style={{ textTransform: 'capitalize' }}>{source}</span>
                      <strong>{count} Leads</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-card">
                <h3>Top Treatment Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                  {(reports.top_products || []).map(p => (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span>{p.name}</span>
                      <strong style={{ color: 'var(--color-accent-premium)' }}>{p.share} of sales</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 9: EMAIL & SYSTEM HEALTH DIAGNOSTICS
            ================================================================== */}
        {activeTab === 'health' && (
          <div className="admin-section animate-fade-in">
            <div className="admin-toolbar" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Email Pipeline & System Health</h2>
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                  Live diagnostics and delivery audit logs for automated customer & team notifications.
                </p>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => loadAdminData(false)}
                disabled={isRefreshing}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh Logs
              </button>
            </div>

            {/* Health Overview Grid */}
            <div className="admin-kpi-grid" style={{ marginBottom: '24px' }}>
              <div className="kpi-card" style={{ borderLeft: '4px solid #2e7d32' }}>
                <span className="kpi-label">Resend API Provider</span>
                <span className="kpi-val" style={{ fontSize: '1.4rem', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={22} /> Connected
                </span>
                <span className="kpi-sub">Lumina Window Treatments &lt;onboarding@resend.dev&gt;</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Total Outbound Dispatches</span>
                <span className="kpi-val">{emailHealth ? emailHealth.total_dispatches : 0}</span>
                <span className="kpi-sub">Quotes, Bookings & Swatches</span>
              </div>
              <div className="kpi-card" style={{ borderLeft: '4px solid #2e7d32' }}>
                <span className="kpi-label">Delivered Successfully</span>
                <span className="kpi-val" style={{ color: '#2e7d32' }}>
                  {emailHealth ? emailHealth.delivered_count : 0}
                </span>
                <span className="kpi-sub">Delivered via Resend inbox</span>
              </div>
              <div className="kpi-card" style={{ borderLeft: '4px solid #d32f2f' }}>
                <span className="kpi-label">Sandbox Blocked / Failed</span>
                <span className="kpi-val" style={{ color: (emailHealth && emailHealth.failed_count > 0) ? '#d32f2f' : '#777' }}>
                  {emailHealth ? emailHealth.failed_count : 0}
                </span>
                <span className="kpi-sub">Unverified test recipient</span>
              </div>
            </div>

            {/* Sandbox Domain Alert */}
            <div style={{
              background: '#FFF8E1',
              border: '1px solid #FFE082',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <AlertTriangle size={24} color="#F57F17" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#E65100', fontSize: '0.98rem' }}>
                  Resend Free Sandbox Restriction Notice
                </strong>
                <p style={{ color: '#5D4037', fontSize: '0.88rem', margin: '6px 0 0', lineHeight: 1.5 }}>
                  Because this application is currently configured with Resend's default free test identity (<code>onboarding@resend.dev</code>), Resend <strong>only allows delivery to the account owner email: <code>asad.adeel@gmail.com</code></strong>.
                  <br />
                  Attempts to dispatch to other unverified emails (like <code>mohsinsgillani@gmail.com</code>) will be rejected by Resend with a 403 status. To send to all customers, verify a custom domain at <a href="https://resend.com/domains" target="_blank" rel="noreferrer" style={{ color: '#E65100', textDecoration: 'underline', fontWeight: 600 }}>resend.com/domains</a>.
                </p>
              </div>
            </div>

            {/* Live Interactive Test Email Dispatcher */}
            <div className="profile-card" style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Send size={20} color="var(--color-accent-premium)" />
                <h3 style={{ margin: 0 }}>Send Instant Health Check Test Email</h3>
              </div>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem', margin: '0 0 16px' }}>
                Dispatch a live test email directly from this console to verify your Resend connection and diagnose delivery in real-time.
              </p>

              <form onSubmit={handleSendTestEmail} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter recipient email (e.g. asad.adeel@gmail.com)"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  style={{
                    flex: '1',
                    minWidth: '280px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={testEmailSending}
                  className="btn btn-primary btn-md"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {testEmailSending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Sending Test...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Diagnostic Test
                    </>
                  )}
                </button>
              </form>

              {/* Test Result Feedback Banner */}
              {testEmailResult && (
                <div style={{
                  marginTop: '16px',
                  padding: '14px 18px',
                  borderRadius: '6px',
                  background: testEmailResult.success ? '#E8F5E9' : '#FFEBEE',
                  border: `1px solid ${testEmailResult.success ? '#A5D6A7' : '#FFCDD2'}`,
                  color: testEmailResult.success ? '#2E7D32' : '#C62828',
                  fontSize: '0.88rem'
                }}>
                  {testEmailResult.success ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={20} />
                      <div>
                        <strong>✅ Success:</strong> {testEmailResult.message}
                        {testEmailResult.dispatch_id && (
                          <span style={{ marginLeft: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
                            (Resend Message ID: <code>{testEmailResult.dispatch_id}</code>)
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>❌ Dispatch Rejected:</strong> {testEmailResult.error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Real-Time Delivery Audit Trail Table */}
            <div className="admin-table-wrap">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Live Delivery Activity & Audit Logs</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)' }}>
                  Showing latest {emailHealth ? emailHealth.recent_logs?.length : 0} events
                </span>
              </div>

              {(!emailHealth || !emailHealth.recent_logs || emailHealth.recent_logs.length === 0) ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-secondary-text)' }}>
                  No emails dispatched yet in this session. Use the test tool above or submit a quote on the website to generate logs.
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Time (EST)</th>
                      <th>Recipient</th>
                      <th>Subject / Type</th>
                      <th>Status</th>
                      <th>Diagnostic Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailHealth.recent_logs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          <br />
                          <small>{new Date(log.timestamp).toLocaleDateString()}</small>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--color-primary-text)' }}>{log.to}</strong>
                        </td>
                        <td style={{ maxWidth: '280px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#444' }}>{log.subject}</span>
                        </td>
                        <td>
                          {log.status === 'delivered' ? (
                            <span style={{
                              background: '#E8F5E9',
                              color: '#2E7D32',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <CheckCircle2 size={12} /> Delivered
                            </span>
                          ) : (
                            <span style={{
                              background: '#FFEBEE',
                              color: '#C62828',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <AlertTriangle size={12} /> {log.is_sandbox_restricted ? 'Sandbox Blocked' : 'Failed'}
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: log.status === 'delivered' ? '#666' : '#C62828' }}>
                          {log.status === 'delivered' ? (
                            <span>ID: <code>{log.resend_id || 'ok'}</code></span>
                          ) : (
                            <span title={log.error_message}>
                              {log.is_sandbox_restricted ? 'Sandbox domain only allows delivery to asad.adeel@gmail.com' : (log.error_message || 'API error')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        </div>
      </main>

      {/* ====================================================================
          MODAL 1: ADD NEW PRODUCT
          ==================================================================== */}
      {isNewProductOpen && (
        <div className="qw-overlay" onClick={() => setIsNewProductOpen(false)}>
          <div className="qw-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setIsNewProductOpen(false)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Add New Treatment to Catalog</h3>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem' }}>
                Create a new custom window treatment with price ranges and category assignment.
              </p>
              
              <form onSubmit={handleAddProduct} className="auth-form" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architectural Roman Shades"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>
                          {c.icon || '🪟'} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand / Collection</label>
                    <input
                      type="text"
                      placeholder="e.g. Lumina Custom"
                      value={newProductForm.brand || 'Lumina Custom'}
                      onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Min Price ($) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={newProductForm.price_min}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price_min: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Price ($)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={newProductForm.price_max}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price_max: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Key benefits, light control, and material details..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', margin: '12px 0', flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input 
                      type="checkbox" 
                      checked={newProductForm.is_featured} 
                      onChange={(e) => setNewProductForm({ ...newProductForm, is_featured: e.target.checked })} 
                    />
                    <span>⭐ Featured on Homepage</span>
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input 
                      type="checkbox" 
                      checked={newProductForm.is_bestseller} 
                      onChange={(e) => setNewProductForm({ ...newProductForm, is_bestseller: e.target.checked })} 
                    />
                    <span>🔥 Bestseller Badge</span>
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input 
                      type="checkbox" 
                      checked={newProductForm.is_active !== false} 
                      onChange={(e) => setNewProductForm({ ...newProductForm, is_active: e.target.checked })} 
                    />
                    <span>🟢 Active (Publish Live)</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-large full-width">
                  Save Product to Catalog
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: EDIT PRODUCT
          ==================================================================== */}
      {isEditProductOpen && editingProduct && (
        <div className="qw-overlay" onClick={() => setIsEditProductOpen(false)}>
          <div className="qw-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setIsEditProductOpen(false)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Edit Treatment: {editingProduct.name}</h3>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem' }}>
                Update pricing, category, description, and website visibility.
              </p>

              <form onSubmit={handleSaveEditProduct} className="auth-form" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>
                          {c.icon || '🪟'} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subcategory / Style</label>
                    <input
                      type="text"
                      placeholder="e.g. Modern Roller, Flat Fold"
                      value={editingProduct.subcategory || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Min Price ($) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={editingProduct.price_min}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price_min: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Price ($)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={editingProduct.price_max}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price_max: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Lead Time</label>
                    <input
                      type="text"
                      value={editingProduct.lead_time || '10-14 business days'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, lead_time: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Warranty</label>
                    <input
                      type="text"
                      value={editingProduct.warranty || 'Limited Lifetime Warranty'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    />
                  </div>
                </div>

                {/* Status and Badges */}
                <div style={{
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-secondary-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  margin: '10px 0'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Visibility & Store Badges</div>
                  
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input 
                        type="checkbox" 
                        checked={editingProduct.is_active !== false} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} 
                      />
                      <strong style={{ color: editingProduct.is_active !== false ? '#2e7d32' : '#c62828' }}>
                        {editingProduct.is_active !== false ? '🟢 Active (Live on website)' : '🔴 Inactive (Hidden from customers)'}
                      </strong>
                    </label>

                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input 
                        type="checkbox" 
                        checked={editingProduct.is_featured} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })} 
                      />
                      <span>⭐ Featured</span>
                    </label>

                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                      <input 
                        type="checkbox" 
                        checked={editingProduct.is_bestseller} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })} 
                      />
                      <span>🔥 Bestseller</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary btn-large" style={{ flex: 1 }}>
                    Save Product Changes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditProductOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: ADD NEW CATEGORY
          ==================================================================== */}
      {isNewCategoryOpen && (
        <div className="qw-overlay" onClick={() => setIsNewCategoryOpen(false)}>
          <div className="qw-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setIsNewCategoryOpen(false)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Add New Product Category</h3>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem' }}>
                Create a new main category collection for your window treatments store.
              </p>

              <form onSubmit={handleSaveNewCategory} className="auth-form" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Skylights, Exterior Screens"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Icon Emoji</label>
                    <input
                      type="text"
                      placeholder="e.g. 🪟, ☀️, ✨"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tagline / Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Motorized Overhead Glass Treatments"
                      value={categoryForm.tagline}
                      onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="2"
                    placeholder="Detailed category summary for catalog header..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  />
                </div>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', margin: '8px 0' }}>
                  <input 
                    type="checkbox" 
                    checked={categoryForm.is_active !== false} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })} 
                  />
                  <span>🟢 Set Category Active on Store</span>
                </label>

                <button type="submit" className="btn btn-primary btn-large full-width" style={{ marginTop: '12px' }}>
                  Create Category
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: EDIT CATEGORY
          ==================================================================== */}
      {isEditCategoryOpen && editingCategory && (
        <div className="qw-overlay" onClick={() => setIsEditCategoryOpen(false)}>
          <div className="qw-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => setIsEditCategoryOpen(false)}><X size={24} /></button>
            <div className="qw-content">
              <h3>Edit Category: {editingCategory.name}</h3>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem' }}>
                Update category display name, icon, description, and status.
              </p>

              <form onSubmit={handleSaveEditCategory} className="auth-form" style={{ marginTop: 'var(--spacing-4)' }}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Icon Emoji</label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={categoryForm.tagline}
                      onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  />
                </div>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', margin: '8px 0' }}>
                  <input 
                    type="checkbox" 
                    checked={categoryForm.is_active !== false} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })} 
                  />
                  <strong style={{ color: categoryForm.is_active !== false ? '#2e7d32' : '#c62828' }}>
                    {categoryForm.is_active !== false ? '🟢 Active (Visible in Store navigation)' : '🔴 Inactive (Hidden)'}
                  </strong>
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary btn-large" style={{ flex: 1 }}>
                    Save Category
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditCategoryOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
