import React, { useState } from 'react';
import { 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  FileSpreadsheet, 
  Receipt, 
  RotateCcw, 
  Calculator, 
  TrendingUp, 
  Wallet, 
  Clock, 
  Lock, 
  Download, 
  Sparkles, 
  Eye, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { TEMPLATE_PRESETS } from '../../data/templatesData.ts';
import { BLOG_ARTICLES } from '../../data/blogArticles.ts';
import { formatCurrency } from '../../utils/calculations.ts';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectTemplate: (templatePreset: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectTemplate }) => {
  // Interactive Hero Preview State
  const [heroTemplate, setHeroTemplate] = useState<'modern_minimal' | 'executive_navy' | 'elegant_blue'>('modern_minimal');
  const [heroClient, setHeroClient] = useState('Acme Global Industries');
  const [heroAmount, setHeroAmount] = useState(2450.00);

  const businessTools = [
    {
      title: 'Invoice Generator',
      desc: 'Create, customize, and download A4/Letter PDF invoices with decimal-accurate taxes and discounts.',
      route: 'generator',
      icon: FileText,
      badge: 'Core Tool',
    },
    {
      title: 'Quotation / Estimate Generator',
      desc: 'Draft project proposals with expiration dates and convert to invoices in a single click.',
      route: 'tools/quotation',
      icon: FileSpreadsheet,
      badge: 'Estimates',
    },
    {
      title: 'Receipt Generator',
      desc: 'Issue official payment acknowledgment receipts stamped Paid In Full for settled invoices.',
      route: 'tools/receipt',
      icon: Receipt,
      badge: 'Payments',
    },
    {
      title: 'Pro Forma Invoice Creator',
      desc: 'Prepare preliminary commercial declarations for customs inspections and advance milestone retainers.',
      route: 'tools/pro-forma',
      icon: FileText,
      badge: 'International',
    },
    {
      title: 'Credit Note Generator',
      desc: 'Formally adjust billing errors, manage returns, or issue client credits referencing original invoices.',
      route: 'tools/credit-note',
      icon: RotateCcw,
      badge: 'Adjustments',
    },
    {
      title: 'Sales Tax & VAT Calculator',
      desc: 'Calculate tax inclusive and exclusive amounts with customizable rates and copyable breakdowns.',
      route: 'tools/tax-calculator',
      icon: Calculator,
      badge: 'Compliance',
    },
    {
      title: 'Profit Margin & Markup Calculator',
      desc: 'Determine sustainable freelance and product pricing by computing gross profit margins and markups.',
      route: 'tools/profit-margin',
      icon: TrendingUp,
      badge: 'Pricing',
    },
    {
      title: 'Business Expense Tracker',
      desc: 'Track deductible business expenses locally in your browser with category breakdowns and CSV export.',
      route: 'tools/expenses',
      icon: Wallet,
      badge: 'Local Private',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>100% Client-Side Privacy · No Account Required</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Create Professional Invoices <span className="text-blue-600">in Minutes.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Design beautiful invoices, estimates, and receipts with free, easy-to-use business tools. Customize, preview in real time, and download crisp A4 PDF documents.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('generator')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Free Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('templates')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Explore Templates</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Genuine Trust Indicators Strip */}
              <div className="pt-6 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free generator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No signup needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download as PDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Editable presets</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Real-Time Working Demo Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Floating Card Chrome */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                  {/* Demo Control Header */}
                  <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="font-mono text-[11px] text-slate-300 ml-2">Live Interactive Preview</span>
                    </div>

                    {/* Template switcher tabs on live demo */}
                    <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md">
                      <button
                        type="button"
                        onClick={() => setHeroTemplate('modern_minimal')}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          heroTemplate === 'modern_minimal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Minimal
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroTemplate('executive_navy')}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          heroTemplate === 'executive_navy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Executive
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroTemplate('elegant_blue')}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          heroTemplate === 'elegant_blue' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Royal
                      </button>
                    </div>
                  </div>

                  {/* Working Invoice Document Preview */}
                  <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800 bg-white">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">Studio North Creative</h3>
                        <p className="text-[11px] text-slate-500">Brand & Web Engineering</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
                          Tax Invoice
                        </span>
                        <p className="font-mono font-bold text-sm text-slate-900 mt-1">#INV-2026-001</p>
                        <p className="text-[10px] text-slate-400">Due: Net 30 Days</p>
                      </div>
                    </div>

                    {/* Billed To with live input */}
                    <div className="grid grid-cols-2 gap-4 py-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Billed To</span>
                        <input
                          type="text"
                          value={heroClient}
                          onChange={(e) => setHeroClient(e.target.value)}
                          aria-label="Client Name"
                          className="w-full font-semibold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none text-xs pb-0.5 mt-0.5"
                        />
                        <p className="text-[11px] text-slate-500">San Francisco, CA</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Amount Due</span>
                        <p className="text-2xl font-bold font-mono text-blue-600 mt-0.5">
                          {formatCurrency(heroAmount, 'USD')}
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                          <th scope="col" className="py-2">Description</th>
                          <th scope="col" className="py-2 text-center w-12">Qty</th>
                          <th scope="col" className="py-2 text-right w-20">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 font-medium text-slate-900">Frontend SaaS Architecture</td>
                          <td className="py-2.5 text-center font-mono">1</td>
                          <td className="py-2.5 text-right font-mono font-semibold">$1,850.00</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-medium text-slate-900">Custom Invoice Document Engine</td>
                          <td className="py-2.5 text-center font-mono">5 hrs</td>
                          <td className="py-2.5 text-right font-mono font-semibold">$600.00</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Totals Strip */}
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                      <div className="w-48 space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span className="font-mono tabular-nums">$2,450.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-xs">
                          <span>Total Balance:</span>
                          <span className="font-mono text-blue-600 tabular-nums">$2,450.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Launch CTA */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('generator')}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Open & Customize This In Editor</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR BUSINESS TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Complete Business Suite</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Business Document Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              From initial client quotes to settled receipts and sales tax auditing, InvoiceCraft covers your full financial document lifecycle.
            </p>
          </div>
          <button
            onClick={() => onNavigate('generator')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {businessTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.title}
                onClick={() => onNavigate(tool.route)}
                className="p-5 bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW INVOICECRAFT WORKS */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Streamlined Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              How InvoiceCraft Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Three simple steps to generate verified, publication-grade commercial documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-300">
            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3 relative">
              <span className="text-2xl font-black text-blue-400 font-mono">01</span>
              <h3 className="font-bold text-base text-white">Input Details & Line Items</h3>
              <p className="leading-relaxed text-slate-300">
                Enter your company info, upload a logo, add your client, and list products or hourly deliverables. All calculations update dynamically.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3 relative">
              <span className="text-2xl font-black text-teal-400 font-mono">02</span>
              <h3 className="font-bold text-base text-white">Customize & Brand</h3>
              <p className="leading-relaxed text-slate-300">
                Choose between 6 refined templates, adjust accent colors to match your brand, set payment terms, and add digital signatures or draft watermarks.
              </p>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3 relative">
              <span className="text-2xl font-black text-amber-400 font-mono">03</span>
              <h3 className="font-bold text-base text-white">Download PDF & Get Paid</h3>
              <p className="leading-relaxed text-slate-300">
                Export crisp, vector-clear A4 PDF files, print directly, or launch an email draft to your client. Your data stays 100% private in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED TEMPLATES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Industry Specific</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Invoice Templates
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Curated for different business disciplines. Pick a design to load sample presets and start editing instantly.
            </p>
          </div>
          <button
            onClick={() => onNavigate('templates')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All 10 Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATE_PRESETS.slice(0, 3).map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                <div className="w-44 bg-white rounded-lg shadow-sm border border-slate-200 p-3 space-y-2 group-hover:scale-105 transition-transform">
                  <div className="flex justify-between items-center border-b pb-1" style={{ borderColor: tpl.accentColor }}>
                    <div className="w-10 h-2 rounded" style={{ backgroundColor: tpl.accentColor }} />
                    <div className="w-6 h-1.5 bg-slate-200 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-slate-100 rounded" />
                    <div className="w-2/3 h-1 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{tpl.category}</span>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">{tpl.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{tpl.description}</p>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HELPFUL BUSINESS GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Financial Education</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Helpful Business & Invoicing Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Original, step-by-step editorial articles on payment terms, invoicing ethics, tax considerations, and client communications.
            </p>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All 12 Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(0, 3).map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate(`blog/${article.slug}`)}
              className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-blue-600 text-[10px] uppercase tracking-wider">{article.category}</span>
                  <span className="text-[11px]">{article.readTime}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{article.publishedDate}</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CONVERSION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Ready to Send Your Next Invoice?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              No account creation, no card details, and 100% private in your browser. Download your first professional document in seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('generator')}
            className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Free Invoice Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};
