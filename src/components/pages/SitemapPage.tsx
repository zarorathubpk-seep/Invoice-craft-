import React, { useState } from 'react';
import { BLOG_ARTICLES } from '../../data/blogArticles.ts';
import { TEMPLATE_PRESETS } from '../../data/templatesData.ts';
import { Globe, Download, Copy, Check } from 'lucide-react';

interface SitemapPageProps {
  onNavigate: (route: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const BASE_URL = 'https://invoicecraft.example';

  const staticRoutes = [
    { url: '/', label: 'Homepage', priority: '1.0', changefreq: 'daily' },
    { url: '/tools/invoice-generator', route: 'generator', label: 'Online Invoice Generator', priority: '1.0', changefreq: 'weekly' },
    { url: '/tools/quotation-generator', route: 'tools/quotation', label: 'Quotation / Estimate Generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/tools/receipt-generator', route: 'tools/receipt', label: 'Receipt Generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/tools/pro-forma-invoice', route: 'tools/pro-forma', label: 'Pro Forma Invoice Generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/tools/credit-note-generator', route: 'tools/credit-note', label: 'Credit Note Generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/tools/tax-calculator', route: 'tools/tax-calculator', label: 'Sales Tax & VAT Calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/tools/profit-margin-calculator', route: 'tools/profit-margin', label: 'Profit Margin Calculator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/discount-calculator', route: 'tools/discount-calculator', label: 'Discount Calculator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/payment-terms-calculator', route: 'tools/payment-terms', label: 'Payment Terms Due Date Calculator', priority: '0.7', changefreq: 'monthly' },
    { url: '/tools/expense-tracker', route: 'tools/expenses', label: 'Business Expense Tracker', priority: '0.8', changefreq: 'weekly' },
    { url: '/templates', route: 'templates', label: 'Invoice Template Library', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', route: 'blog', label: 'Guides & Editorial Blog', priority: '0.9', changefreq: 'daily' },
    { url: '/about', route: 'about', label: 'About Us', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact', route: 'contact', label: 'Contact Us', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy', route: 'privacy', label: 'Privacy Policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms', route: 'terms', label: 'Terms and Conditions', priority: '0.5', changefreq: 'yearly' },
    { url: '/disclaimer', route: 'disclaimer', label: 'Disclaimer', priority: '0.5', changefreq: 'yearly' },
    { url: '/cookie-policy', route: 'cookie-policy', label: 'Cookie Policy', priority: '0.4', changefreq: 'yearly' },
    { url: '/editorial-policy', route: 'editorial-policy', label: 'Editorial Policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/faq', route: 'faq', label: 'Frequently Asked Questions', priority: '0.6', changefreq: 'monthly' },
  ];

  const generateXml = () => {
    const today = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const r of staticRoutes) {
      xml += `  <url>\n    <loc>${BASE_URL}${r.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
    }

    // Blog articles
    for (const art of BLOG_ARTICLES) {
      xml += `  <url>\n    <loc>${BASE_URL}/blog/${art.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    return xml;
  };

  const handleDownloadXml = () => {
    const xml = generateXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(generateXml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Search Engine Optimization</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">XML Sitemap Index</h1>
          <p className="text-xs text-slate-500 mt-1">Complete crawlable directory of tools, articles, and public routes.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyXml}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied XML' : 'Copy XML'}</span>
          </button>
          <button
            onClick={handleDownloadXml}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download sitemap.xml</span>
          </button>
        </div>
      </div>

      {/* Directory Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {/* Core & Tools */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Business Tools & Core Pages</h2>
          <ul className="space-y-2">
            {staticRoutes.map((r) => (
              <li key={r.url} className="flex items-center justify-between py-1 border-b border-slate-100">
                <button
                  onClick={() => r.route ? onNavigate(r.route) : onNavigate('home')}
                  className="text-blue-600 hover:underline font-medium text-left"
                >
                  {r.label}
                </button>
                <span className="text-slate-400 font-mono text-[10px]">{r.url}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 12 Blog Guides */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Educational Guides (12 Articles)</h2>
          <ul className="space-y-2">
            {BLOG_ARTICLES.map((art) => (
              <li key={art.slug} className="flex items-center justify-between py-1 border-b border-slate-100">
                <button
                  onClick={() => onNavigate(`blog/${art.slug}`)}
                  className="text-blue-600 hover:underline font-medium text-left max-w-xs truncate"
                >
                  {art.title}
                </button>
                <span className="text-slate-400 font-mono text-[10px]">/blog/{art.slug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Robots.txt representation */}
      <div className="p-5 bg-slate-900 text-slate-300 rounded-xl font-mono text-xs space-y-2">
        <p className="text-slate-400 font-sans font-semibold">Standard robots.txt configuration:</p>
        <pre className="text-emerald-400">
{`User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml`}
        </pre>
      </div>
    </div>
  );
};
