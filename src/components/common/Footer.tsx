import React from 'react';
import { Logo } from '../brand/Logo.tsx';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNav = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 no-print" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo variant="full" theme="dark" size="md" />
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Brand tagline: <strong className="text-slate-200">Create. Customize. Get Paid.</strong>
              <br />
              Free online invoice generator, business document creators, and financial education hub for freelancers, consultants, agencies, and small business owners.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Client-Side Private Generator. Zero Data Upload.</span>
            </div>
          </div>

          {/* Column 2: Generator & Business Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-normal text-slate-200">Business Tools</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('generator')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Invoice Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools/quotation')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Quotation Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools/receipt')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Receipt Generator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools/pro-forma')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Pro Forma Invoice
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools/credit-note')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Credit Note Creator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools/tax-calculator')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Sales Tax & VAT Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tools/expenses')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Expense Tracker (Local)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Templates & Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-normal text-slate-200">Templates & Guides</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('templates')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Invoice Template Library
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog/what-is-an-invoice')} className="hover:text-white transition-colors cursor-pointer text-left">
                  What Is an Invoice?
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog/how-to-invoice-for-freelance-work')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Freelance Billing Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog/net-7-net-15-net-30-payment-terms-explained')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Payment Terms Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog/common-invoicing-mistakes')} className="hover:text-white transition-colors cursor-pointer text-left">
                  10 Invoicing Mistakes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-white transition-colors cursor-pointer text-left">
                  All 12 Business Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-normal text-slate-200">Trust & Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About InvoiceCraft
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('disclaimer')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Financial Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('cookie-policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('editorial-policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Editorial Standards
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('sitemap')} className="hover:text-white transition-colors cursor-pointer text-left">
                  XML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InvoiceCraft. Built for international small business freedom.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('privacy')} className="hover:text-slate-300">Privacy Notice</button>
            <span>·</span>
            <button onClick={() => handleNav('disclaimer')} className="hover:text-slate-300">No Legal Advice Disclaimer</button>
            <span>·</span>
            <button onClick={() => handleNav('faq')} className="hover:text-slate-300">Support FAQ</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
