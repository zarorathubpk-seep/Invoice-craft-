import React, { useEffect } from 'react';
import { CURRENCIES, CurrencyCode, InvoiceData, PaymentTerms } from '../../types/invoice.ts';
import { Calendar, Hash, Globe, RefreshCw } from 'lucide-react';
import { computeDueDate } from '../../utils/calculations.ts';

interface InvoiceMetaFormProps {
  invoice: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export const InvoiceMetaForm: React.FC<InvoiceMetaFormProps> = ({ invoice, onChange }) => {
  // Whenever terms or issueDate changes, compute new dueDate if not custom
  const handleTermsChange = (newTerms: PaymentTerms) => {
    if (newTerms !== 'custom') {
      const calculatedDue = computeDueDate(invoice.issueDate, newTerms);
      onChange({ paymentTerms: newTerms, dueDate: calculatedDue });
    } else {
      onChange({ paymentTerms: newTerms });
    }
  };

  const handleIssueDateChange = (newDate: string) => {
    if (invoice.paymentTerms !== 'custom') {
      const calculatedDue = computeDueDate(newDate, invoice.paymentTerms);
      onChange({ issueDate: newDate, dueDate: calculatedDue });
    } else {
      onChange({ issueDate: newDate });
    }
  };

  const generateNextNumber = () => {
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100 + Math.random() * 900);
    onChange({ invoiceNumber: `INV-${year}-${randomSeq}` });
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Invoice Information & Terms</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Invoice Title</label>
          <input
            type="text"
            value={invoice.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Tax Invoice"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-medium text-slate-700">Invoice Number *</label>
            <button
              type="button"
              onClick={generateNextNumber}
              title="Generate new number"
              className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-0.5"
            >
              <RefreshCw className="w-3 h-3" /> Auto
            </button>
          </div>
          <input
            type="text"
            required
            value={invoice.invoiceNumber}
            onChange={(e) => onChange({ invoiceNumber: e.target.value })}
            placeholder="INV-2026-001"
            className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Currency *</label>
          <select
            value={invoice.currency}
            onChange={(e) => onChange({ currency: e.target.value as CurrencyCode })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol}) — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Payment Terms</label>
          <select
            value={invoice.paymentTerms}
            onChange={(e) => handleTermsChange(e.target.value as PaymentTerms)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="due_on_receipt">Due on Receipt</option>
            <option value="net_7">Net 7 Days</option>
            <option value="net_15">Net 15 Days</option>
            <option value="net_30">Net 30 Days</option>
            <option value="net_60">Net 60 Days</option>
            <option value="custom">Custom Due Date</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Issue Date</label>
          <input
            type="date"
            value={invoice.issueDate}
            onChange={(e) => handleIssueDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Due Date</label>
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value, paymentTerms: 'custom' })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Purchase Order (PO #)</label>
          <input
            type="text"
            value={invoice.purchaseOrderRef || ''}
            onChange={(e) => onChange({ purchaseOrderRef: e.target.value })}
            placeholder="e.g. PO-7842"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Project / Contract Ref</label>
          <input
            type="text"
            value={invoice.projectRef || ''}
            onChange={(e) => onChange({ projectRef: e.target.value })}
            placeholder="e.g. Q4 Web Redesign"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
