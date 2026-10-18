import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('invoicecraft_consent');
    if (!consent) {
      // Delay prompt slightly per anti-annoyance UX guidelines
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (choice: 'all' | 'essential') => {
    localStorage.setItem('invoicecraft_consent', choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and storage preferences"
      className="no-print fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-800 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="font-semibold text-slate-100 text-sm">
            Your Privacy & Data Stay on Your Device
          </p>
          <p className="text-slate-300 leading-relaxed">
            InvoiceCraft generates documents entirely in your browser. We never transmit your client or pricing details to an external database. We use local browser storage strictly to remember your draft documents.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleAccept('essential')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Accept Essential
            </button>
            <button
              onClick={() => handleAccept('all')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Accept All
            </button>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#privacy';
              }}
              className="text-slate-400 hover:text-white underline ml-1"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-200 p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
