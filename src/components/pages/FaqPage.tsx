import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, PlusCircle } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (route: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'Is InvoiceCraft completely free to use?',
      a: 'Yes. InvoiceCraft is 100% free for creating, customizing, printing, and downloading invoices, estimates, receipts, and credit notes. There are no paywalls, hidden export fees, or forced account registrations.'
    },
    {
      q: 'Do I need to sign up or create an account to create an invoice?',
      a: 'No signup is required. You can open InvoiceCraft and immediately begin typing your business details, client info, and line items. Everything runs directly in your browser.'
    },
    {
      q: 'Where is my client and pricing data stored?',
      a: 'All data entered into InvoiceCraft is processed client-side within your browser and stored in your device&apos;s private localStorage. We do not transmit or store your client details, prices, or banking records on external servers.'
    },
    {
      q: 'Can I add my business logo and change colors?',
      a: 'Absolutely. You can upload any PNG, JPG, or SVG logo, resize it, choose from 6 professional templates, select your brand accent color, and toggle optional watermarks or digital signatures.'
    },
    {
      q: 'Which currencies are supported?',
      a: 'InvoiceCraft supports all major international currencies, including USD ($), EUR (€), GBP (£), PKR (Rs.), AED, SAR, CAD, AUD, INR (₹), JPY (¥), SGD, and CHF with correct formatting and decimal precision.'
    },
    {
      q: 'How does sales tax or VAT calculation work?',
      a: 'You can configure custom tax names (VAT, GST, Sales Tax), set any percentage rate, and toggle between tax-exclusive (added on top of the subtotal) and tax-inclusive (extracted from the subtotal) modes.'
    },
    {
      q: 'Can I convert a quotation or estimate into an invoice?',
      a: 'Yes. Our Quotation Generator includes a 1-click &apos;Convert to Invoice&apos; feature that automatically migrates all client details and quoted line items directly into an editable invoice draft.'
    },
    {
      q: 'How do I save drafts or work on multiple invoices?',
      a: 'Click &apos;Save&apos; on the editor toolbar to store drafts in your local browser library. You can reopen past drafts, duplicate invoices, or export and import raw JSON backups anytime.'
    },
    {
      q: 'What payment terms should I choose for my clients?',
      a: 'Standard commercial terms include Due on Receipt (immediate), Net 7 or Net 14 (popular for freelancers), and Net 30 (the international corporate standard). You can also set a custom calendar due date.'
    },
    {
      q: 'How does PDF downloading work?',
      a: 'Click &apos;Download PDF&apos; on the invoice workspace to export a crisp, publication-ready vector-raster A4 PDF document directly to your computer. You can also print directly via your browser&apos;s native print menu.'
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-xl mb-1">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Common questions about InvoiceCraft, local privacy, PDF exports, tax configurations, and business document standards.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search answers (e.g. taxes, PDF, privacy)..."
          className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
              >
                <span className="font-semibold text-sm text-slate-900">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-3">
        <h3 className="font-bold text-base text-slate-900">Ready to create your first document?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Start generating professional invoices right now without creating an account.
        </p>
        <button
          onClick={() => onNavigate('generator')}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open Free Invoice Generator</span>
        </button>
      </div>
    </div>
  );
};
