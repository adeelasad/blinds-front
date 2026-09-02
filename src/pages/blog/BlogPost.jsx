import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, ShieldCheck, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from './blogData';
import SEOHead, { generateArticleSchema } from '../../components/seo/SEOHead';

const BlogPost = ({ onOpenQuote }) => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="blog-post-page animate-fade-in container section" style={{ maxWidth: '840px' }}>
      <SEOHead 
        title={`${post.title} | Lumina Design Blog`}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
        schema={generateArticleSchema(post)}
      />
      {/* Back to Blog */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <Link to="/blog" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to All Articles
        </Link>
      </div>

      {/* Post Header */}
      <div className="blog-post-header">
        <span className="trade-badge">{post.category}</span>
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, margin: '12px 0 16px' }}>{post.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-secondary-text)', fontSize: '0.9rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} /> {post.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} /> {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> {post.readTime}
          </span>
        </div>
      </div>

      {/* Hero Visual */}
      <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--spacing-8)' }}>
        <img 
          src={post.image} 
          alt={post.title} 
          style={{ width: '100%', height: '420px', objectFit: 'cover' }} 
        />
      </div>

      {/* Post Body */}
      <div className="blog-post-body" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-primary-text)' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--color-secondary-text)', marginBottom: '24px' }}>
          {post.excerpt}
        </p>

        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '12px', color: 'var(--color-primary-text)' }}>
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <ul key={idx} style={{ paddingLeft: '20px', margin: '12px 0' }}>
                {paragraph.split('\n').map((li, lIdx) => (
                  <li key={lIdx} style={{ marginBottom: '6px' }}>
                    {li.replace('- ', '')}
                  </li>
                ))}
              </ul>
            );
          }
          if (/^\d+\./.test(paragraph)) {
            return (
              <ol key={idx} style={{ paddingLeft: '20px', margin: '12px 0' }}>
                {paragraph.split('\n').map((li, lIdx) => (
                  <li key={lIdx} style={{ marginBottom: '6px' }}>
                    {li.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>
            );
          }
          return <p key={idx} style={{ marginBottom: '16px' }}>{paragraph}</p>;
        })}
      </div>

      {/* Author & Reassurance Card */}
      <div style={{ backgroundColor: 'var(--color-secondary-bg)', padding: '24px', borderRadius: '12px', marginTop: 'var(--spacing-12)', border: '1px solid var(--color-border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <ShieldCheck size={36} color="var(--color-accent-premium)" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: 0 }}>Written by Lumina Window Specialists</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', margin: '4px 0 0 0' }}>
            Our articles are authored by licensed window treatment technicians and interior designers serving Gaithersburg, Rockville, Bethesda, Potomac, and the DMV.
          </p>
        </div>
      </div>

      {/* Quote Banner */}
      <section className="catalog-cta-banner" style={{ marginTop: 'var(--spacing-12)' }}>
        <div className="cta-banner-content">
          <Sparkles className="cta-icon" size={36} />
          <div>
            <h3>Bring these ideas to your windows</h3>
            <p>Get a personalized in-home consultation with free laser measurement.</p>
          </div>
        </div>
        <button className="btn btn-accent btn-large" onClick={onOpenQuote}>
          Schedule In-Home Measure
        </button>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-16)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-8)' }}>
          <h3 style={{ marginBottom: '16px' }}>Related Guides</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {relatedPosts.map(rp => (
              <div key={rp.slug} className="product-card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  <Link to={`/blog/${rp.slug}`}>{rp.title}</Link>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>{rp.excerpt}</p>
                <div style={{ marginTop: '8px' }}>
                  <Link to={`/blog/${rp.slug}`} className="btn btn-secondary btn-sm">
                    Read Article <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
