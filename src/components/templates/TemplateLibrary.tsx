import React, { useState } from 'react';
import { TEMPLATE_PRESETS, TemplatePreset } from '../../data/templatesData.ts';
import { DEFAULT_BUSINESS, DEFAULT_CLIENT, saveInvoiceToStorage } from '../../utils/storage.ts';
import { InvoiceData } from '../../types/invoice.ts';
import { FileText, ArrowRight, CheckCircle, Sparkles, Filter } from 'lucide-react';

interface TemplateLibraryProps {
  onSelectTemplate: (invoiceData: InvoiceData) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePreviewPreset, setActivePreviewPreset] = useState<TemplatePreset | null>(null);

  const categories = ['All', 'Freelancing', 'Small Business', 'Consulting', 'Creative & Design', 'Trades & Construction', 'Services'];

  const filtered = TEMPLATE_PRESETS.filter(t => {
    if (selectedCategory === 'All') return true;
    return t.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleUseTemplate = (preset: TemplatePreset) => {
    const customizedInvoice: InvoiceData = {
      id: `inv_tpl_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Tax Invoice',
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      paymentTerms: 'net_30',
      currency: preset.currency,
      sender: DEFAULT_BUSINESS,
      client: DEFAULT_CLIENT,
      items: preset.items,
      discount: { type: 'percentage', value: 0 },
      tax: { name: 'Sales Tax', rate: 8.5, isInclusive: false, enabled: true },
      shippingFee: 0,
      amountPaid: 0,
      paymentDetails: {
        bankName: 'Pacific Commerce Bank',
        accountName: 'Studio North Creative LLC',
        accountNumber: '•••••••• 4892',
        routingNumberOrSwift: 'PCBXUS33',
        paypalEmail: 'payments@studionorth.example',
        customNotes: preset.defaultTerms,
      },
      notes: 'Thank you for your partnership! Please remit payment according to agreed schedule.',
      terms: preset.defaultTerms,
      footerNote: 'Generated with InvoiceCraft · Free Professional Invoice Generator',
      customization: {
        templateId: preset.templateId,
        accentColor: preset.accentColor,
        fontFamily: 'Plus Jakarta Sans',
        logoSize: 'medium',
        logoPosition: 'left',
        showWatermark: false,
      },
      updatedAt: new Date().toISOString(),
    };

    saveInvoiceToStorage(customizedInvoice);
    onSelectTemplate(customizedInvoice);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Curated Document Design Systems</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Professional Invoice Templates
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Pre-built, customizable invoice designs tailored for freelancers, agencies, contractors, and small businesses. Choose any template to launch straight into the live editor.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((preset) => (
          <div
            key={preset.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Visual Header / Mock Paper Sheet */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative min-h-[170px]">
              {/* Geometric mini-invoice sheet representation */}
              <div className="w-48 bg-white rounded-lg shadow-sm border border-slate-200 p-3 space-y-2 transform group-hover:scale-105 transition-transform duration-200">
                <div className="flex justify-between items-center border-b pb-1.5" style={{ borderColor: preset.accentColor }}>
                  <div className="w-12 h-2.5 rounded" style={{ backgroundColor: preset.accentColor }} />
                  <div className="w-8 h-2 bg-slate-200 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded" />
                  <div className="w-3/4 h-1.5 bg-slate-100 rounded" />
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <div className="w-10 h-1.5 bg-slate-200 rounded" />
                  <div className="w-8 h-2 font-mono font-bold rounded" style={{ color: preset.accentColor }}>$Total</div>
                </div>
              </div>
            </div>

            {/* Template Information */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    {preset.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accentColor }} />
                    <span className="text-[10px] text-slate-400 font-mono">{preset.accentColor}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {preset.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Best For:</span>
                  <p className="text-xs font-medium text-slate-700">{preset.recommendedFor}</p>
                </div>

                <div className="space-y-1 pt-1">
                  {preset.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleUseTemplate(preset)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template FAQ Section */}
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mt-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 text-center">Invoice Template Guidance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed pt-2">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Can I customize colors and logos on these templates?</h3>
            <p>
              Yes. Every template preset loads directly into the Invoice Generator where you can swap colors, upload your business logo, adjust font styling, and modify line items freely.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Are these templates free for commercial client use?</h3>
            <p>
              100% free. No watermarks, no account signup required, and zero hidden licensing restrictions on any documents you export for your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
