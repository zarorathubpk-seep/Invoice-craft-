import React, { useState } from 'react';
import { QuotationData, LineItem, CurrencyCode } from '../../types/invoice.ts';
import { DEFAULT_BUSINESS, DEFAULT_CLIENT, saveInvoiceToStorage } from '../../utils/storage.ts';
import { calculateInvoiceTotals, calculateLineTotal, formatCurrency } from '../../utils/calculations.ts';
import { downloadInvoicePdf, printInvoice } from '../../utils/pdfGenerator.ts';
import { FileSpreadsheet, Plus, Trash2, ArrowRight, Download, Printer } from 'lucide-react';

interface QuotationGeneratorProps {
  onConvertToInvoice: (invoiceData: any) => void;
}

export const QuotationGenerator: React.FC<QuotationGeneratorProps> = ({ onConvertToInvoice }) => {
  const [quotation, setQuotation] = useState<QuotationData>({
    id: `quote_${Date.now()}`,
    quotationNumber: 'EST-2026-081',
    title: 'Project Quotation & Estimate',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    paymentTerms: 'net_15',
    currency: 'USD',
    status: 'draft',
    sender: DEFAULT_BUSINESS,
    client: DEFAULT_CLIENT,
    items: [
      {
        id: 'q_item_1',
        name: 'Brand Discovery & Strategic Roadmap',
        description: 'Stakeholder interviews, competitive analysis, and strategic positioning framework.',
        quantity: 1,
        unit: 'milestone',
        rate: 1500.00,
      },
      {
        id: 'q_item_2',
        name: 'Full-Stack Web App Development',
        description: 'Design implementation, database architecture, and integration with third-party APIs.',
        quantity: 45,
        unit: 'hours',
        rate: 120.00,
      },
    ],
    discount: { type: 'percentage', value: 0 },
    tax: { name: 'Tax', rate: 0, isInclusive: false, enabled: false },
    shippingFee: 0,
    amountPaid: 0,
    paymentDetails: {
      customNotes: 'Upon quotation acceptance, a 30% advance deposit is required to commence work.',
    },
    notes: 'This quotation is valid for 30 calendar days from the date of issue. Scope adjustments may impact final project delivery estimates.',
    terms: 'Estimated timelines commence upon contract execution and deposit receipt. Deliverables are subject to mutual milestone sign-offs.',
    footerNote: 'InvoiceCraft Quotation Tool · Free Client-Side Document Generator',
    customization: {
      templateId: 'modern_minimal',
      accentColor: '#0D9488',
      fontFamily: 'Plus Jakarta Sans',
      logoSize: 'medium',
      logoPosition: 'left',
      showWatermark: false,
    },
    updatedAt: new Date().toISOString(),
  });

  const [isExporting, setIsExporting] = useState(false);

  const calculations = calculateInvoiceTotals(
    quotation.items,
    quotation.discount,
    quotation.tax,
    quotation.shippingFee,
    0
  );

  const addItem = () => {
    setQuotation(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `item_${Date.now()}`, name: '', description: '', quantity: 1, unit: 'hrs', rate: 0 }
      ]
    }));
  };

  const updateItem = (index: number, updates: Partial<LineItem>) => {
    const next = [...quotation.items];
    next[index] = { ...next[index], ...updates };
    setQuotation(prev => ({ ...prev, items: next }));
  };

  const removeItem = (index: number) => {
    if (quotation.items.length <= 1) return;
    setQuotation(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleConvert = () => {
    const invoiceConverted = {
      ...quotation,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Tax Invoice',
      status: 'pending',
      updatedAt: new Date().toISOString(),
    };
    saveInvoiceToStorage(invoiceConverted);
    onConvertToInvoice(invoiceConverted);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadInvoicePdf('quotation-preview-sheet', `${quotation.quotationNumber.toLowerCase()}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Quotation & Estimate Generator</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create professional business quotations, specify expiration dates, and convert to an invoice in 1 click.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={printInvoice}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download Estimate PDF'}</span>
          </button>
          <button
            type="button"
            onClick={handleConvert}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>Convert to Invoice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h2 className="font-semibold text-sm text-slate-800">Quotation Meta</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Quote Number</label>
                <input
                  type="text"
                  value={quotation.quotationNumber}
                  onChange={(e) => setQuotation(q => ({ ...q, quotationNumber: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Valid Until (Expiration)</label>
                <input
                  type="date"
                  value={quotation.validUntil}
                  onChange={(e) => setQuotation(q => ({ ...q, validUntil: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Sender Company</label>
                <input
                  type="text"
                  value={quotation.sender.name}
                  onChange={(e) => setQuotation(q => ({ ...q, sender: { ...q.sender, name: e.target.value } }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Client Name / Company</label>
                <input
                  type="text"
                  value={quotation.client.name}
                  onChange={(e) => setQuotation(q => ({ ...q, client: { ...q.client, name: e.target.value } }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-slate-800">Quoted Scope & Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Scope Item
              </button>
            </div>

            <div className="space-y-3">
              {quotation.items.map((item, index) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      placeholder="Milestone / Deliverable name"
                      className="w-full px-2 py-1 border border-slate-300 rounded font-medium bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={1}
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    placeholder="Description of work, timeline, and inclusions..."
                    className="w-full px-2 py-1 text-[11px] border border-slate-200 rounded bg-white text-slate-600"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Unit</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(index, { unit: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Unit Rate ($)</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, { rate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Sheet */}
        <div className="lg:col-span-6 sticky top-24">
          <div
            id="quotation-preview-sheet"
            className="invoice-paper-sheet bg-white p-8 rounded-xl border border-slate-200 shadow-md space-y-6 text-xs text-slate-800"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{quotation.sender.name}</h2>
                <p className="text-slate-500 text-[11px]">{quotation.sender.email} · {quotation.sender.phone}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-700 font-semibold uppercase tracking-wider text-[10px] rounded">
                  ESTIMATE / QUOTE
                </span>
                <p className="text-base font-bold font-mono text-slate-900 mt-1">#{quotation.quotationNumber}</p>
                <p className="text-[11px] text-slate-500">Expires: <strong className="text-slate-800">{quotation.validUntil}</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Prepared For:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{quotation.client.name}</p>
                <p className="text-slate-500">{quotation.client.companyName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Quoted Value</span>
                <p className="text-2xl font-bold font-mono text-teal-600 mt-0.5">
                  {formatCurrency(calculations.grandTotal, quotation.currency)}
                </p>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-semibold">
                  <th scope="col" className="py-2 px-2.5">Description</th>
                  <th scope="col" className="py-2 px-2.5 text-center w-24">Qty</th>
                  <th scope="col" className="py-2 px-2.5 text-right w-24">Rate</th>
                  <th scope="col" className="py-2 px-2.5 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2.5 px-2.5">
                      <p className="font-semibold text-slate-900">{it.name || 'Scope Item'}</p>
                      {it.description && <p className="text-[11px] text-slate-500">{it.description}</p>}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-mono">{it.quantity} {it.unit}</td>
                    <td className="py-2.5 px-2.5 text-right font-mono">{formatCurrency(it.rate, quotation.currency)}</td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-semibold">{formatCurrency(calculateLineTotal(it), quotation.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p><strong>Notes:</strong> {quotation.notes}</p>
              <p><strong>Terms:</strong> {quotation.terms}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
