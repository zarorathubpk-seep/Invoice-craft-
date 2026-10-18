import React from 'react';
import { BookOpen, CheckCircle, Shield } from 'lucide-react';

export const EditorialPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Quality & Integrity</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Editorial Policy & Standards</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 17, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Commitment to Original, High-Value Content</h2>
        <p>
          At InvoiceCraft, we are committed to providing educational guides and business resources that genuinely benefit freelancers, agency owners, and independent contractors. We do not publish shallow &quot;AI filler&quot; or rehashed generic articles. Every guide is researched to provide practical, operational clarity.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Fact-Checking & Terminology Accuracy</h2>
        <p>
          Our guides explain commercial terminology—such as trade credit terms (Net 7, Net 30), pro forma invoicing, customs declarations, and credit notes—in strict alignment with international commercial accounting conventions. Where legal and tax regulations diverge across borders (e.g. EU VAT versus US Sales Tax), our articles explicitly highlight these differences to prevent reader confusion.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Commercial Independence</h2>
        <p>
          Editorial recommendations for invoicing workflows, calculation formulas, or business habits are never dictated by advertising sponsors. When our articles link to InvoiceCraft tools (such as the Quotation Generator or Tax Calculator), they do so only when directly relevant to the reader&apos;s workflow.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. Corrections & Updates</h2>
        <p>
          Commercial practices and payment regulations evolve. We periodically review our published guides to maintain freshness and accuracy. If you notice an error or have updated regulatory feedback, please notify our editorial desk at <strong className="font-mono text-blue-600">zarorathub.pk@gmail.com</strong>.
        </p>
      </section>
    </div>
  );
};
