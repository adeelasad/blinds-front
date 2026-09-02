import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Business from './pages/Business';
import ProductDetail from './pages/ProductDetail';
import Catalog from './pages/Catalog';
import Trade from './pages/Trade';
import Services from './pages/Services';
import Inspiration from './pages/Inspiration';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AccountDashboard from './pages/account/AccountDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstallerPortal from './pages/installer/InstallerPortal';
import FacebookOffer from './pages/campaigns/FacebookOffer';
import GoogleOffer from './pages/campaigns/GoogleOffer';
import CraigslistOffer from './pages/campaigns/CraigslistOffer';
import ProfessionalInstallation from './pages/content/ProfessionalInstallation';
import HowToMeasure from './pages/content/HowToMeasure';
import ChildSafety from './pages/content/ChildSafety';
import EnergySaving from './pages/content/EnergySaving';
import OutdoorShades from './pages/content/OutdoorShades';
import CleaningAndCare from './pages/content/CleaningAndCare';
import Policies from './pages/content/Policies';
import RoomPage from './pages/rooms/RoomPage';
import Blog from './pages/blog/Blog';
import BlogPost from './pages/blog/BlogPost';
import CityPage from './pages/city/CityPage';
import QuoteWizard from './components/quote/QuoteWizard';

function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const openQuote = () => setIsQuoteOpen(true);
  const closeQuote = () => setIsQuoteOpen(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header onOpenQuote={openQuote} />
          <main className="main-content">
            <Routes>
              {/* Core Store & Info Routes */}
              <Route path="/" element={<Home onOpenQuote={openQuote} />} />
              <Route path="/blinds" element={<Catalog onOpenQuote={openQuote} defaultCategory="blinds" />} />
              <Route path="/shades" element={<Catalog onOpenQuote={openQuote} defaultCategory="shades" />} />
              <Route path="/drapery" element={<Catalog onOpenQuote={openQuote} defaultCategory="drapery" />} />
              <Route path="/shutters" element={<Catalog onOpenQuote={openQuote} defaultCategory="shutters" />} />
              <Route path="/motorized" element={<Catalog onOpenQuote={openQuote} defaultCategory="motorized" />} />
              <Route path="/solutions" element={<Catalog onOpenQuote={openQuote} />} />
              <Route path="/business" element={<Business onOpenQuote={openQuote} />} />
              <Route path="/trade" element={<Trade onOpenQuote={openQuote} />} />
              <Route path="/services" element={<Services onOpenQuote={openQuote} />} />
              <Route path="/inspiration" element={<Inspiration onOpenQuote={openQuote} />} />
              <Route path="/about" element={<About onOpenQuote={openQuote} />} />
              <Route path="/contact" element={<Contact onOpenQuote={openQuote} />} />
              <Route path="/products/:productId" element={<ProductDetail onOpenQuote={openQuote} />} />

              {/* Education & Feature Content Routes */}
              <Route path="/professional-installation" element={<ProfessionalInstallation onOpenQuote={openQuote} />} />
              <Route path="/how-to-measure" element={<HowToMeasure onOpenQuote={openQuote} />} />
              <Route path="/child-safety" element={<ChildSafety onOpenQuote={openQuote} />} />
              <Route path="/energy-saving" element={<EnergySaving onOpenQuote={openQuote} />} />
              <Route path="/outdoor-shades" element={<OutdoorShades onOpenQuote={openQuote} />} />
              <Route path="/cleaning-and-care" element={<CleaningAndCare />} />
              <Route path="/policies" element={<Policies onOpenQuote={openQuote} />} />

              {/* Room-by-Room Shopping Guides */}
              <Route path="/rooms/:roomSlug" element={<RoomPage onOpenQuote={openQuote} />} />

              {/* SEO Blog & Guides */}
              <Route path="/blog" element={<Blog onOpenQuote={openQuote} />} />
              <Route path="/blog/:slug" element={<BlogPost onOpenQuote={openQuote} />} />

              {/* 12 DMV City SEO Landing Pages */}
              <Route path="/locations/:citySlug" element={<CityPage onOpenQuote={openQuote} />} />

              {/* Customer Auth & Account Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<Login />} />
              <Route path="/account" element={<AccountDashboard onOpenQuote={openQuote} />} />

              {/* Admin & Installer Portals */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/installer" element={<InstallerPortal />} />

              {/* High-Converting Paid Campaign Offer Pages */}
              <Route path="/fb-offer" element={<FacebookOffer onOpenQuote={openQuote} />} />
              <Route path="/google-offer" element={<GoogleOffer onOpenQuote={openQuote} />} />
              <Route path="/cl-offer" element={<CraigslistOffer onOpenQuote={openQuote} />} />

              {/* Fallback */}
              <Route path="*" element={<Home onOpenQuote={openQuote} />} />
            </Routes>
          </main>
          <Footer onOpenQuote={openQuote} />
          <QuoteWizard isOpen={isQuoteOpen} onClose={closeQuote} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
