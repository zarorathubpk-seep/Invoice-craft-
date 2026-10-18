import React from 'react';
import { Shield, Sparkles, Lock, Cpu, Globe, Heart } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Our Mission & Standards</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About InvoiceCraft
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Building fast, private, and genuinely free financial document tools for the global community of freelancers, contractors, and independent business builders.
        </p>
      </div>

      {/* Why We Built InvoiceCraft */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Why InvoiceCraft Exists</h2>
        <p>
          Too many invoicing platforms today force small businesses and solo freelancers behind expensive monthly subscriptions, mandatory account creation, intrusive tracking, and lock-in walled gardens. A freelancer who completes two projects a month should not have to pay $35/month just to format an A4 PDF document with accurate sales tax.
        </p>
        <p>
          InvoiceCraft was engineered from the ground up on one core principle: <strong>Client-Side Processing First</strong>. When you generate an invoice, customize colors, or calculate tax on InvoiceCraft, all computational logic runs directly inside your web browser. Your client names, banking details, rates, and line items never leave your machine to sit in an external database.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">100% Private By Design</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Invoices and drafts are stored in your device&apos;s localStorage. We never upload customer financial records to third-party databases.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Mathematical Precision</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tested 2-decimal financial rounding for taxes, discounts, and line calculations. No floating-point penny discrepancies.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg w-fit">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Genuinely Accessible</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No signup barriers, no watermarks forced on basic exports, and no paywalls on essential business calculators.
          </p>
        </div>
      </div>

      {/* Disclosures and Editorial Stance */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm">Transparency & Publisher Standards</h3>
        <p>
          InvoiceCraft provides practical business tools, educational guides, and customizable document templates. We believe in total transparency: we do not invent fabricated customer numbers, fake award badges, or artificial ratings.
        </p>
        <p>
          Have questions, ideas for a new business tool, or feedback on an existing calculator? Reach out through our verified contact channel.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Contact the InvoiceCraft Team
          </button>
        </div>
      </div>
    </div>
  );
};
