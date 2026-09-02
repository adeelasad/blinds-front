import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Tag, Search, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from './blogData';

const Blog = ({ onOpenQuote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Design & Living', 'Smart Home Automation', 'Energy Efficiency', 'Guides & Measurement', 'Product Advice'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCat = selectedCat === 'All' || post.category === selectedCat;
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="blog-hub-page animate-fade-in container section">
      {/* Header */}
      <div className="catalog-header">
        <span className="trade-badge">Expert Window Design & Guides</span>
        <h1>The Lumina Window Design & Living Blog</h1>
        <p className="catalog-subtitle">
          Tips, buying guides, energy-saving insights, and smart motorization advice from our certified DMV window treatment specialists.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="catalog-toolbar" style={{ marginBottom: 'var(--spacing-12)' }}>
        <div className="search-wrap" style={{ maxWidth: '400px' }}>
          <Search size={18} color="var(--color-secondary-text)" />
          <input 
            type="text" 
            placeholder="Search articles & guides..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-wrap">
          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Lead Post */}
      {filteredPosts.length > 0 && !searchQuery && selectedCat === 'All' && (
        <div className="blog-featured-card" style={{ marginBottom: 'var(--spacing-12)' }}>
          <div className="blog-featured-grid">
            <div className="blog-featured-image-wrap">
              <img src={filteredPosts[0].image} alt={filteredPosts[0].title} />
              <span className="blog-cat-badge">{filteredPosts[0].category}</span>
            </div>
            <div className="blog-featured-content">
              <div className="blog-meta-row">
                <span><Calendar size={14} /> {filteredPosts[0].date}</span>
                <span><Clock size={14} /> {filteredPosts[0].readTime}</span>
              </div>
              <h2>
                <Link to={`/blog/${filteredPosts[0].slug}`}>{filteredPosts[0].title}</Link>
              </h2>
              <p>{filteredPosts[0].excerpt}</p>
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <Link to={`/blog/${filteredPosts[0].slug}`} className="btn btn-primary">
                  Read Full Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="catalog-grid">
        {filteredPosts.map(post => (
          <div key={post.id} className="product-card">
            <div className="product-card-image-wrap">
              <img src={post.image} alt={post.title} className="product-card-image" />
              <span className="product-card-badge" style={{ backgroundColor: 'var(--color-primary-text)' }}>
                {post.category}
              </span>
            </div>
            <div className="product-card-body">
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
                <span><Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {post.date}</span>
                <span><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {post.readTime}</span>
              </div>
              <h3 className="product-card-title" style={{ fontSize: '1.2rem', lineHeight: 1.3 }}>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="product-card-desc">{post.excerpt}</p>
              <div className="product-card-footer" style={{ marginTop: 'auto' }}>
                <Link to={`/blog/${post.slug}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Read Guide <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free Measure Callout */}
      <section className="catalog-cta-banner" style={{ marginTop: 'var(--spacing-16)' }}>
        <div className="cta-banner-content">
          <Sparkles className="cta-icon" size={36} />
          <div>
            <h3>Have specific window questions for your home?</h3>
            <p>Our Gaithersburg design consultants will guide you through fabrics and measurements.</p>
          </div>
        </div>
        <button className="btn btn-accent btn-large" onClick={onOpenQuote}>
          Schedule Free In-Home Consultation
        </button>
      </section>
    </div>
  );
};

export default Blog;
