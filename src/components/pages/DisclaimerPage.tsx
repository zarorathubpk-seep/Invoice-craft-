import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Legal & Regulatory</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Disclaimer</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 17, 2026</p>
      </div>

      <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-amber-900 mb-1">No Professional Financial, Accounting, or Legal Advice</p>
          <p className="leading-relaxed">
            The information, calculators, and templates provided on InvoiceCraft are for general informational and administrative purposes only. They do not constitute formal financial, accounting, legal, or tax advice.
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Tax Jurisdictions & Regulatory Variance</h2>
        <p>
          Tax laws, Value Added Tax (VAT) directives, Goods and Services Tax (GST) thresholds, and invoicing compliance mandates differ significantly across countries, states, and municipalities. While InvoiceCraft offers flexible tax configuration (inclusive/exclusive toggles, custom rates, tax ID fields), you are responsible for ensuring that documents comply with the specific revenue authorities governing your business location.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Accuracy of Calculations</h2>
        <p>
          We employ strict 2-decimal rounded financial arithmetic in all our calculators and generator tools. However, mathematical outputs depend entirely on user inputs. You must independently audit all totals, currency conversions, and line rates before transmitting documents to clients or tax authorities.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Independent Professional Consultation</h2>
        <p>
          If you require advice concerning contract enforceability, cross-border VAT reverse charges, or corporate tax filing, we strongly advise consulting a qualified Certified Public Accountant (CPA), chartered tax advisor, or legal counsel in your respective jurisdiction.
        </p>
      </section>
    </div>
  );
};
