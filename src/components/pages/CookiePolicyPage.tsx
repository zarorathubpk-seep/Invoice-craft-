import React from 'react';
import { Cookie } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Privacy & Tracking Disclosures</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Cookie & Storage Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 17, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. What Are Cookies and Local Storage?</h2>
        <p>
          Cookies are small text files placed on your computer or mobile device by websites you visit. Local storage (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">window.localStorage</code>) is a modern web standard that allows web applications to store data directly in your browser without transmitting that data over the internet on every HTTP request.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. How InvoiceCraft Uses Local Storage</h2>
        <p>
          InvoiceCraft relies primarily on client-side local storage rather than traditional third-party tracking cookies. We store:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Draft Invoices:</strong> Prevents work loss during browser tab closures.</li>
          <li><strong>Client Address Book:</strong> Allows quick reuse of client details across documents.</li>
          <li><strong>Expenses Log:</strong> Stores your local expense tracking entries privately.</li>
          <li><strong>Consent State:</strong> Remembers your privacy banner preferences.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Third-Party Analytics & Advertising Cookies</h2>
        <p>
          Currently, InvoiceCraft does not deploy intrusive cross-site tracking cookies. If publisher monetization partners (such as RevBid) are activated in the future, non-essential advertising cookies will only load with your explicit prior consent in compliance with the EU GDPR, UK GDPR, and California CCPA/CPRA.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. How to Clear or Disable Stored Data</h2>
        <p>
          You have full control over data stored in your browser. You can clear your browser cache and site data at any time via your browser settings (Chrome: Settings &gt; Privacy and Security &gt; Clear Browsing Data).
        </p>
      </section>
    </div>
  );
};
