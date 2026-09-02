import React, { useEffect } from 'react';

export const BASE_URL = 'https://www.luminablinds.com';

export const generateLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${BASE_URL}/#business`,
  'name': 'Lumina Window Treatments',
  'image': `${BASE_URL}/images/hero-living-room.jpg`,
  'url': BASE_URL,
  'telephone': '+1-800-555-0199',
  'priceRange': '$$$',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '101 Lakeforest Blvd, Suite 200',
    'addressLocality': 'Gaithersburg',
    'addressRegion': 'MD',
    'postalCode': '20877',
    'addressCountry': 'US'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 39.1434,
    'longitude': -77.2014
  },
  'areaServed': [
    { '@type': 'City', 'name': 'Gaithersburg' },
    { '@type': 'City', 'name': 'Rockville' },
    { '@type': 'City', 'name': 'Bethesda' },
    { '@type': 'City', 'name': 'Potomac' },
    { '@type': 'City', 'name': 'Silver Spring' },
    { '@type': 'City', 'name': 'Germantown' },
    { '@type': 'City', 'name': 'Frederick' },
    { '@type': 'City', 'name': 'Washington' },
    { '@type': 'City', 'name': 'Arlington' },
    { '@type': 'City', 'name': 'Alexandria' },
    { '@type': 'City', 'name': 'McLean' },
    { '@type': 'City', 'name': 'Reston' }
  ],
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.95',
    'reviewCount': '142'
  },
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      'opens': '08:00',
      'closes': '19:00'
    }
  ]
});

export const generateProductSchema = (product) => ({
  '@context': 'https://schema.org/',
  '@type': 'Product',
  'name': product?.name || 'Custom Window Treatment',
  'image': product?.images || [`${BASE_URL}/images/cat-roller.jpg`],
  'description': product?.description || 'Custom fabricated window blinds and shades.',
  'brand': {
    '@type': 'Brand',
    'name': product?.brand || 'Lumina Custom'
  },
  'offers': {
    '@type': 'AggregateOffer',
    'priceCurrency': 'USD',
    'lowPrice': product?.price_min || 89,
    'highPrice': product?.price_max || 350,
    'offerCount': '1',
    'availability': 'https://schema.org/InStock',
    'seller': {
      '@type': 'Organization',
      'name': 'Lumina Window Treatments'
    }
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.9',
    'reviewCount': '96'
  }
});

export const generateArticleSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  'headline': post?.title,
  'image': [`${BASE_URL}${post?.image || '/images/hero-living-room.jpg'}`],
  'datePublished': '2026-08-20',
  'dateModified': '2026-08-20',
  'author': {
    '@type': 'Person',
    'name': post?.author || 'Lumina Window Specialist'
  },
  'publisher': {
    '@type': 'Organization',
    'name': 'Lumina Window Treatments',
    'logo': {
      '@type': 'ImageObject',
      'url': `${BASE_URL}/favicon.ico`
    }
  },
  'description': post?.excerpt
});

export const generateServiceSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Custom Window Treatment Measuring and Installation',
  'provider': {
    '@type': 'LocalBusiness',
    'name': 'Lumina Window Treatments'
  },
  'areaServed': {
    '@type': 'State',
    'name': 'Maryland, District of Columbia, Northern Virginia'
  },
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Window Covering Services',
    'itemListElement': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Complimentary In-Home Laser Measuring'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'White-Glove Master Installation'
        }
      }
    ]
  }
});

const SEOHead = ({ 
  title = 'Lumina | Custom Blinds, Shades & In-Home Installation in DMV', 
  description = 'Premier custom window blinds, motorized shades, and shutters in Gaithersburg, MD serving DC, Maryland, and Northern Virginia. Free in-home laser measure and 100% Fit Guarantee.',
  canonical,
  ogImage = '/images/hero-living-room.jpg',
  ogType = 'website',
  schema
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMeta = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', `${BASE_URL}${ogImage}`);
    setMeta('property', 'og:type', ogType);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${BASE_URL}${ogImage}`);

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical ? `${BASE_URL}${canonical}` : window.location.href);

    // 4. Structured JSON-LD Schema
    const existingSchemaScript = document.getElementById('lumina-jsonld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'lumina-jsonld-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, ogType, schema]);

  return null;
};

export default SEOHead;
