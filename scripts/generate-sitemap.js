import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.luminablinds.com';

const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/blinds', priority: '0.9', changefreq: 'weekly' },
  { url: '/shades', priority: '0.9', changefreq: 'weekly' },
  { url: '/motorized', priority: '0.9', changefreq: 'weekly' },
  { url: '/solutions', priority: '0.8', changefreq: 'weekly' },
  { url: '/business', priority: '0.8', changefreq: 'weekly' },
  { url: '/trade', priority: '0.8', changefreq: 'monthly' },
  { url: '/services', priority: '0.8', changefreq: 'monthly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/inspiration', priority: '0.7', changefreq: 'weekly' },
  { url: '/professional-installation', priority: '0.8', changefreq: 'monthly' },
  { url: '/how-to-measure', priority: '0.8', changefreq: 'monthly' },
  { url: '/child-safety', priority: '0.7', changefreq: 'monthly' },
  { url: '/energy-saving', priority: '0.7', changefreq: 'monthly' },
  { url: '/outdoor-shades', priority: '0.8', changefreq: 'monthly' },
  { url: '/cleaning-and-care', priority: '0.6', changefreq: 'monthly' },
  { url: '/policies', priority: '0.5', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/fb-offer', priority: '0.6', changefreq: 'weekly' },
  { url: '/google-offer', priority: '0.6', changefreq: 'weekly' },
  { url: '/cl-offer', priority: '0.6', changefreq: 'weekly' }
];

const PRODUCTS = [
  'roller-shades',
  'roman-shades',
  'wood-blinds',
  'faux-wood-blinds',
  'cellular-honeycomb-shades',
  'vertical-sheer-blinds',
  'woven-wood-natural-shades',
  'plantation-shutters',
  'hunter-douglas-silhouette',
  'hunter-douglas-powerview-motorized',
  'somfy-motorized-solar-roller',
  'exterior-patio-motorized-drop-shades'
];

const CITIES = [
  'gaithersburg-md',
  'rockville-md',
  'bethesda-md',
  'potomac-md',
  'silver-spring-md',
  'germantown-md',
  'frederick-md',
  'washington-dc',
  'arlington-va',
  'alexandria-va',
  'mclean-va',
  'reston-va'
];

const ROOMS = [
  'living-room',
  'bedroom',
  'kitchen',
  'bathroom',
  'home-office'
];

const BLOG_POSTS = [
  '5-signs-to-upgrade-window-treatments-maryland-dc',
  'motorized-vs-cordless-shades-smart-home-guide',
  'how-honeycomb-shades-cut-energy-bills-dmv',
  'inside-mount-vs-outside-mount-window-guide',
  'best-window-treatments-for-bathrooms-kitchens'
];

const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Routes
  STATIC_ROUTES.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Product Routes
  PRODUCTS.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/products/${p}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  });

  // City Routes
  CITIES.forEach(c => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/locations/${c}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  // Room Routes
  ROOMS.forEach(r => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/rooms/${r}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.75</priority>\n`;
    xml += `  </url>\n`;
  });

  // Blog Routes
  BLOG_POSTS.forEach(b => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${b}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`✅ Sitemap successfully generated at: ${outputPath} (${STATIC_ROUTES.length + PRODUCTS.length + CITIES.length + ROOMS.length + BLOG_POSTS.length} URLs)`);
};

generateSitemap();
