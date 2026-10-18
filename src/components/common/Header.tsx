import React, { useState } from 'react';
import { Logo } from '../brand/Logo.tsx';
import { Menu, X, PlusCircle, Wrench, FileText, BookOpen, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Generator', route: 'generator' },
    { label: 'Business Tools', route: 'tools' },
    { label: 'Templates', route: 'templates' },
    { label: 'Guides & Blog', route: 'blog' },
    { label: 'FAQ', route: 'faq' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Top Bar Contract: Single text element wordmark) */}
        <button
          onClick={() => handleNavClick('home')}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5 text-left"
          aria-label="InvoiceCraft Homepage"
        >
          <Logo variant="full" size="md" />
        </button>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
                  isActive ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('generator')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('generator')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md"
          >
            Create
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('generator')}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Free Invoice</span>
          </button>
          
          <button
            onClick={() => handleNavClick('tools')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>Business Document Tools</span>
          </button>
          
          <button
            onClick={() => handleNavClick('templates')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Invoice Templates</span>
          </button>
          
          <button
            onClick={() => handleNavClick('blog')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Guides & Articles</span>
          </button>

          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Frequently Asked Questions</span>
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button onClick={() => handleNavClick('about')} className="hover:text-slate-800">About</button>
            <span>·</span>
            <button onClick={() => handleNavClick('contact')} className="hover:text-slate-800">Contact</button>
            <span>·</span>
            <button onClick={() => handleNavClick('privacy')} className="hover:text-slate-800">Privacy</button>
            <span>·</span>
            <button onClick={() => handleNavClick('terms')} className="hover:text-slate-800">Terms</button>
          </div>
        </div>
      )}
    </header>
  );
};
