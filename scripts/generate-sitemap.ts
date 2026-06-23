import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://mkadaugyoptuptxlgpdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYWRhdWd5b3B0dXB0eGxncGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzE4NjEsImV4cCI6MjA4MTU0Nzg2MX0.ey7aqjXJ0XMlxddvF8HY1hlB5UdXLS90qP-iHx6YZLw';

const supabase = createClient(supabaseUrl, supabaseKey);

const slugify = (text: string): string => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

async function generateSitemap() {
  console.log('--- Generating Dynamic Sitemap ---');
  const baseUrl = 'https://pmartinsimob.com.br';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static Pages
  const staticPages = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/about`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/properties`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/privacy`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${baseUrl}/alto-sobradinho`, changefreq: 'daily', priority: '0.95' }
  ];

  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Append Static Pages
  staticPages.forEach(page => {
    sitemapContent += `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
  });

  // Fetch Dynamic Properties from Supabase
  try {
    console.log('Fetching properties from Supabase...');
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, slug');

    if (error) {
      throw error;
    }

    if (properties && properties.length > 0) {
      console.log(`Found ${properties.length} properties. Adding to sitemap...`);
      properties.forEach((prop: any) => {
        const slug = prop.slug || (prop.title ? slugify(prop.title) : prop.id);
        const lastmod = currentDate;
        
        sitemapContent += `  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
      });
    } else {
      console.log('No properties found in database.');
    }
  } catch (error) {
    console.error('Error fetching properties from Supabase:', error);
  }

  sitemapContent += `</urlset>`;

  const publicDirPath = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDirPath)) {
    fs.mkdirSync(publicDirPath, { recursive: true });
  }

  const sitemapXmlPath = path.join(publicDirPath, 'sitemap.xml');
  fs.writeFileSync(sitemapXmlPath, sitemapContent.trim());
  console.log(`Sitemap successfully written to ${sitemapXmlPath}`);
  console.log('--- Sitemap Generation Complete ---');
}

generateSitemap().catch(err => {
  console.error('Unhandled sitemap generation error:', err);
  process.exit(1);
});
