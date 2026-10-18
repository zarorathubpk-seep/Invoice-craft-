import React, { useState } from 'react';
import { CreditNoteData, LineItem } from '../../types/invoice.ts';
import { DEFAULT_BUSINESS, DEFAULT_CLIENT } from '../../utils/storage.ts';
import { calculateLineTotal, formatCurrency } from '../../utils/calculations.ts';
import { downloadInvoicePdf, printInvoice } from '../../utils/pdfGenerator.ts';
import { RotateCcw, Download, Printer, Plus, Trash2 } from 'lucide-react';

export const CreditNoteGenerator: React.FC = () => {
  const [creditNote, setCreditNote] = useState<CreditNoteData>({
    id: `cn_${Date.now()}`,
    creditNoteNumber: 'CRN-2026-018',
    originalInvoiceNumber: 'INV-2026-001',
    issueDate: new Date().toISOString().split('T')[0],
    reason: 'Billing adjustment: 5 unused consultation hours credited back to client account.',
    currency: 'USD',
    sender: DEFAULT_BUSINESS,
    client: DEFAULT_CLIENT,
    items: [
      {
        id: 'cn_1',
        name: 'Credit: Unused Consultation Hours',
        description: 'Hours deducted following completion of QA milestone ahead of schedule.',
        quantity: 5,
        unit: 'hours',
        rate: 110.00,
      },
    ],
    tax: { name: 'Sales Tax', rate: 8.5, isInclusive: false, enabled: false },
    notes: 'This credit note reduces your outstanding balance or may be applied toward upcoming invoices.',
    customization: {
      templateId: 'modern_minimal',
      accentColor: '#DC2626',
      fontFamily: 'Plus Jakarta Sans',
      logoSize: 'medium',
      logoPosition: 'left',
      showWatermark: true,
      watermarkText: 'CREDIT NOTE',
    },
  });

  const [isExporting, setIsExporting] = useState(false);

  const subtotal = creditNote.items.reduce((sum, item) => sum + calculateLineTotal(item), 0);

  const addItem = () => {
    setCreditNote(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `item_${Date.now()}`, name: '', description: '', quantity: 1, unit: 'items', rate: 0 }
      ]
    }));
  };

  const updateItem = (index: number, updates: Partial<LineItem>) => {
    const next = [...creditNote.items];
    next[index] = { ...next[index], ...updates };
    setCreditNote(prev => ({ ...prev, items: next }));
  };

  const removeItem = (index: number) => {
    if (creditNote.items.length <= 1) return;
    setCreditNote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadInvoicePdf('credit-note-preview-sheet', `${creditNote.creditNoteNumber.toLowerCase()}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-50 text-red-700 rounded-lg">
              <RotateCcw className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Credit Note Generator</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Issue formal credit notes to offset previous invoices, handle client refunds, or correct billing errors.
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
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download Credit Note PDF'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h2 className="font-semibold text-sm text-slate-800">Credit Note Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Credit Note Number</label>
                <input
                  type="text"
                  value={creditNote.creditNoteNumber}
                  onChange={(e) => setCreditNote(c => ({ ...c, creditNoteNumber: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Original Invoice Reference *</label>
                <input
                  type="text"
                  required
                  value={creditNote.originalInvoiceNumber}
                  onChange={(e) => setCreditNote(c => ({ ...c, originalInvoiceNumber: e.target.value }))}
                  placeholder="e.g. INV-2026-001"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={creditNote.issueDate}
                  onChange={(e) => setCreditNote(c => ({ ...c, issueDate: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Reason for Credit</label>
                <textarea
                  rows={2}
                  value={creditNote.reason}
                  onChange={(e) => setCreditNote(c => ({ ...c, reason: e.target.value }))}
                  placeholder="e.g. Return of damaged goods, discount correction, or scope reduction"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-slate-800">Credit Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {creditNote.items.map((item, index) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      placeholder="Item name / reason"
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Credited Rate ($)</label>
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

        {/* Right Preview */}
        <div className="lg:col-span-7 sticky top-24">
          <div
            id="credit-note-preview-sheet"
            className="invoice-paper-sheet bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-md space-y-6 text-xs text-slate-800 relative overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <span className="text-8xl font-black text-red-500/10 tracking-widest uppercase transform -rotate-45">
                CREDIT NOTE
              </span>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{creditNote.sender.name}</h2>
                  <p className="text-slate-500 text-xs">{creditNote.sender.email} · {creditNote.sender.phone}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-red-100 text-red-800 font-bold uppercase tracking-wider text-[10px] rounded">
                    CREDIT NOTE
                  </span>
                  <p className="text-base font-bold font-mono text-slate-900 mt-1.5">#{creditNote.creditNoteNumber}</p>
                  <p className="text-slate-600 font-medium text-[11px] mt-1">
                    Refers to: <strong className="font-mono text-slate-900">{creditNote.originalInvoiceNumber}</strong>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 text-xs">
                <span className="font-bold text-red-900">Reason for Credit:</span>
                <p className="text-red-800 mt-0.5">{creditNote.reason}</p>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                    <th scope="col" className="py-2 px-2.5">Description</th>
                    <th scope="col" className="py-2 px-2.5 text-center w-24">Qty</th>
                    <th scope="col" className="py-2 px-2.5 text-right w-24">Rate</th>
                    <th scope="col" className="py-2 px-2.5 text-right w-28">Credit Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {creditNote.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5 px-2.5">
                        <p className="font-semibold text-slate-900">{it.name}</p>
                        {it.description && <p className="text-[11px] text-slate-500">{it.description}</p>}
                      </td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{it.quantity} {it.unit}</td>
                      <td className="py-2.5 px-2.5 text-right font-mono">{formatCurrency(it.rate, creditNote.currency)}</td>
                      <td className="py-2.5 px-2.5 text-right font-mono font-semibold text-red-600">
                        -{formatCurrency(calculateLineTotal(it), creditNote.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-200 font-bold text-red-900">
                    <span>Total Credited:</span>
                    <span className="font-mono text-base">-{formatCurrency(subtotal, creditNote.currency)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-slate-500 text-[11px]">
                <p>{creditNote.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
