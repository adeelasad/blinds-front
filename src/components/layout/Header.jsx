import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Menu, X, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { customer, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-wrapper">
      {/* Top Utility Bar */}
      <div className="utility-bar">
        <span>GAITHERSBURG, MD &bull; SERVING THE ENTIRE DMV &bull; FREE IN-HOME MEASURE & DESIGN</span>
      </div>

      {/* Main Navigation Header */}
      <div className="main-header">
        <div className="logo">
          <Link to="/" onClick={handleNavClick}>Lumina</Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul>
            <li><Link to="/blinds" className={location.pathname === '/blinds' ? 'active-link' : ''}>Blinds</Link></li>
            <li><Link to="/shades" className={location.pathname === '/shades' ? 'active-link' : ''}>Shades</Link></li>
            <li><Link to="/drapery" className={location.pathname === '/drapery' ? 'active-link' : ''}>Drapery</Link></li>
            <li><Link to="/shutters" className={location.pathname === '/shutters' ? 'active-link' : ''}>Shutters</Link></li>
            <li><Link to="/motorized" className={location.pathname === '/motorized' ? 'active-link' : ''}>Motorized</Link></li>
            <li><Link to="/business" className={location.pathname === '/business' ? 'active-link' : ''}>For Business</Link></li>
            <li><Link to="/trade" className={location.pathname === '/trade' ? 'active-link' : ''}>Trade</Link></li>
            <li><Link to="/services" className={location.pathname === '/services' ? 'active-link' : ''}>Services</Link></li>
          </ul>
        </nav>
        
        {/* Actions */}
        <div className="header-actions">
          <button 
            className="icon-btn" 
            aria-label="Search"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="header-icon" size={20} />
          </button>

          <a href="tel:18005550199" className="header-icon desktop-nav-icon" title="Call (800) 555-0199">
            <Phone size={20} />
          </a>

          {/* User Auth Dropdown */}
          <div className="user-menu-wrap" ref={dropdownRef}>
            {isAuthenticated && customer ? (
              <div className="user-dropdown-container">
                <button 
                  className="user-profile-btn" 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User Account Menu"
                >
                  <div className="user-avatar-sm">
                    {customer.first_name ? customer.first_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="user-name-text">{customer.first_name}</span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu animate-fade-in">
                    <div className="user-dropdown-header">
                      <p className="user-full-name">{customer.first_name} {customer.last_name}</p>
                      <p className="user-email-text">{customer.email}</p>
                    </div>
                    <Link to="/account" onClick={handleNavClick} className="user-dropdown-item">
                      <User size={16} /> My Account Dashboard
                    </Link>
                    <Link to="/account" onClick={() => { handleNavClick(); }} className="user-dropdown-item">
                      <Package size={16} /> My Orders
                    </Link>
                    <button 
                      className="user-dropdown-item logout-item" 
                      onClick={() => {
                        logout();
                        handleNavClick();
                        navigate('/');
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-nav-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm auth-signin-btn">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-secondary btn-sm auth-register-btn">
                  Create Account
                </Link>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={onOpenQuote}>
            Get a Quote
          </button>

          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Quick Search Drawer */}
      {searchOpen && (
        <div className="header-search-bar animate-fade-in">
          <div className="container search-bar-inner">
            <Search size={18} color="var(--color-secondary-text)" />
            <input 
              type="text" 
              placeholder="Search roller shades, wood blinds, blackout, motorization in Gaithersburg & DMV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="btn btn-secondary btn-sm" onClick={() => setSearchOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-fade-in">
          <div className="mobile-nav-links">
            {isAuthenticated && customer && (
              <div className="mobile-user-greeting">
                <p>Signed in as <strong>{customer.first_name} {customer.last_name}</strong></p>
                <Link to="/account" onClick={handleNavClick} className="mobile-account-link">
                  Open Customer Portal &rarr;
                </Link>
              </div>
            )}

            <Link to="/blinds" onClick={handleNavClick}>Shop Blinds</Link>
            <Link to="/shades" onClick={handleNavClick}>Shop Shades</Link>
            <Link to="/drapery" onClick={handleNavClick}>Custom Drapery</Link>
            <Link to="/shutters" onClick={handleNavClick}>Plantation Shutters</Link>
            <Link to="/motorized" onClick={handleNavClick}>Smart Motorization</Link>
            <Link to="/business" onClick={handleNavClick}>Commercial & Business</Link>
            <Link to="/trade" onClick={handleNavClick}>Trade & Designers</Link>
            <Link to="/services" onClick={handleNavClick}>Measure & Installation</Link>
            <Link to="/inspiration" onClick={handleNavClick}>Inspiration Lookbook</Link>
            <Link to="/about" onClick={handleNavClick}>About Lumina</Link>
            <Link to="/contact" onClick={handleNavClick}>Contact & Showroom</Link>
            
            {!isAuthenticated ? (
              <div className="mobile-auth-links">
                <Link to="/login" onClick={handleNavClick}>Customer Sign In</Link>
                <Link to="/register" onClick={handleNavClick}>Create Account</Link>
              </div>
            ) : (
              <button 
                className="mobile-logout-btn" 
                onClick={() => {
                  logout();
                  handleNavClick();
                  navigate('/');
                }}
              >
                Sign Out
              </button>
            )}
          </div>
          <div className="mobile-nav-actions">
            <button className="btn btn-primary btn-large full-width" onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}>
              Get a Personalized Quote
            </button>
            <a href="tel:18005550199" className="btn btn-secondary btn-large full-width text-center">
              Call (800) 555-0199
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
