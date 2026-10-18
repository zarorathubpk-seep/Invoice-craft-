import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Receipt, 
  RotateCcw, 
  Calculator, 
  TrendingUp, 
  Tag, 
  Calendar, 
  Wallet,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ToolsPageProps {
  onNavigate: (route: string) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: 'generator',
      name: 'Invoice Generator',
      category: 'Invoicing & Billing',
      desc: 'Create, customize, and export print-ready A4 PDF invoices with multi-currency support, custom taxes, and draft saving.',
      icon: FileText,
      badge: 'Most Popular',
    },
    {
      id: 'tools/quotation',
      name: 'Quotation / Estimate Generator',
      category: 'Estimates & Proposals',
      desc: 'Prepare formal project estimates with expiration dates and 1-click conversion into active invoice drafts.',
      icon: FileSpreadsheet,
      badge: 'Sales',
    },
    {
      id: 'tools/receipt',
      name: 'Payment Receipt Generator',
      category: 'Settlements',
      desc: 'Issue official payment acknowledgment receipts stamped Paid In Full to clear customer balances.',
      icon: Receipt,
      badge: 'Proof of Payment',
    },
    {
      id: 'tools/pro-forma',
      name: 'Pro Forma Invoice Creator',
      category: 'International Trade',
      desc: 'Generate preliminary commercial invoices for customs declaration, import permits, and advance deposit requests.',
      icon: FileText,
      badge: 'Customs',
    },
    {
      id: 'tools/credit-note',
      name: 'Credit Note Generator',
      category: 'Adjustments & Refunds',
      desc: 'Correct billing errors, process returns, or issue customer account credits referencing original invoices.',
      icon: RotateCcw,
      badge: 'Audit Compliant',
    },
    {
      id: 'tools/tax-calculator',
      name: 'Sales Tax & VAT Calculator',
      category: 'Calculators',
      desc: 'Extract VAT from gross amounts or compute inclusive/exclusive sales tax with copyable calculation summaries.',
      icon: Calculator,
      badge: 'Finance',
    },
    {
      id: 'tools/profit-margin',
      name: 'Profit Margin & Markup Calculator',
      category: 'Calculators',
      desc: 'Calculate gross profit, margin percentage, and markup multiplier to price your freelance services profitably.',
      icon: TrendingUp,
      badge: 'Pricing Strategy',
    },
    {
      id: 'tools/discount-calculator',
      name: 'Discount & Savings Calculator',
      category: 'Calculators',
      desc: 'Model percentage or fixed price promotions, calculate net savings, and compute post-discount tax totals.',
      icon: Tag,
      badge: 'Discounts',
    },
    {
      id: 'tools/payment-terms',
      name: 'Payment Terms Due Date Calculator',
      category: 'Calculators',
      desc: 'Determine calendar settlement dates, day of week, and days remaining for Net 7, Net 15, Net 30, and Net 60 terms.',
      icon: Calendar,
      badge: 'Cash Flow',
    },
    {
      id: 'tools/expenses',
      name: 'Business Expense Tracker',
      category: 'Bookkeeping',
      desc: 'Privately log business deductions and operating expenses in your browser with monthly summaries and CSV export.',
      icon: Wallet,
      badge: 'Local Storage',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>100% Free · Client-Side Private · No Registration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Business Document Tools & Calculators
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          A comprehensive suite of free, private web utilities designed to streamline invoicing, trade credit calculations, and administrative paperwork.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t.badge}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {t.name}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{t.category}</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
