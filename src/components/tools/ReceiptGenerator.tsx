import React, { useState } from 'react';
import { ReceiptData } from '../../types/invoice.ts';
import { DEFAULT_BUSINESS, DEFAULT_CLIENT } from '../../utils/storage.ts';
import { formatCurrency } from '../../utils/calculations.ts';
import { downloadInvoicePdf, printInvoice } from '../../utils/pdfGenerator.ts';
import { CheckCircle2, Download, Printer, Receipt } from 'lucide-react';

export const ReceiptGenerator: React.FC = () => {
  const [receipt, setReceipt] = useState<ReceiptData>({
    id: `rec_${Date.now()}`,
    receiptNumber: 'REC-2026-059',
    invoiceRef: 'INV-2026-001',
    paymentDate: new Date().toISOString().split('T')[0],
    amountReceived: 293.50,
    paymentMethod: 'Bank Transfer',
    currency: 'USD',
    sender: DEFAULT_BUSINESS,
    client: DEFAULT_CLIENT,
    notes: 'Payment received in full with thanks. Account balance cleared.',
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadInvoicePdf('receipt-preview-sheet', `${receipt.receiptNumber.toLowerCase()}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Receipt className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Payment Receipt Generator</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal acknowledgment receipts for paid invoices or cash settlements. Download as PDF.
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
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download Receipt PDF'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h2 className="font-semibold text-sm text-slate-800">Receipt Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Receipt Number</label>
                <input
                  type="text"
                  value={receipt.receiptNumber}
                  onChange={(e) => setReceipt(r => ({ ...r, receiptNumber: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Original Invoice Reference (Optional)</label>
                <input
                  type="text"
                  value={receipt.invoiceRef || ''}
                  onChange={(e) => setReceipt(r => ({ ...r, invoiceRef: e.target.value }))}
                  placeholder="e.g. INV-2026-001"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={receipt.paymentDate}
                    onChange={(e) => setReceipt(r => ({ ...r, paymentDate: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Amount Received</label>
                  <input
                    type="number"
                    step="0.01"
                    value={receipt.amountReceived}
                    onChange={(e) => setReceipt(r => ({ ...r, amountReceived: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Payment Method</label>
                <select
                  value={receipt.paymentMethod}
                  onChange={(e) => setReceipt(r => ({ ...r, paymentMethod: e.target.value as any }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="Bank Transfer">Bank Transfer (Wire / ACH)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Received From (Client)</label>
                <input
                  type="text"
                  value={receipt.client.name}
                  onChange={(e) => setReceipt(r => ({ ...r, client: { ...r.client, name: e.target.value } }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Receipt Notes / Reference Note</label>
                <textarea
                  rows={2}
                  value={receipt.notes || ''}
                  onChange={(e) => setReceipt(r => ({ ...r, notes: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Sheet */}
        <div className="lg:col-span-7 sticky top-24">
          <div
            id="receipt-preview-sheet"
            className="invoice-paper-sheet bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-md space-y-8 text-xs text-slate-800"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{receipt.sender.name}</h2>
                <p className="text-slate-500 text-xs mt-1">{receipt.sender.addressLine1}</p>
                <p className="text-slate-500 text-xs">{receipt.sender.email} · {receipt.sender.phone}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-xs rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  PAID IN FULL
                </span>
                <p className="text-sm font-bold font-mono text-slate-900 mt-2">#{receipt.receiptNumber}</p>
                <p className="text-slate-400 text-[11px]">Date: {receipt.paymentDate}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-emerald-900">Total Amount Settled</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-0.5">
                  {formatCurrency(receipt.amountReceived, receipt.currency)}
                </div>
              </div>
              <div className="text-right text-xs text-emerald-800">
                <p>Payment Method:</p>
                <p className="font-bold text-slate-900">{receipt.paymentMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Received From</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{receipt.client.name}</p>
                {receipt.client.companyName && <p className="text-slate-600">{receipt.client.companyName}</p>}
                <p className="text-slate-500">{receipt.client.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment Allocation</span>
                <p className="text-slate-700 mt-0.5">
                  Invoice Ref: <strong className="font-mono text-slate-900">{receipt.invoiceRef || 'General Account'}</strong>
                </p>
                <p className="text-slate-500">Remaining Due: <strong className="text-emerald-700">$0.00</strong></p>
              </div>
            </div>

            {receipt.notes && (
              <div className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                {receipt.notes}
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400">
              Official Payment Receipt · Generated with InvoiceCraft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
