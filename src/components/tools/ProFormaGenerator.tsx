import React, { useState } from 'react';
import { InvoiceData } from '../../types/invoice.ts';
import { DEFAULT_BUSINESS, DEFAULT_CLIENT } from '../../utils/storage.ts';
import { calculateInvoiceTotals, calculateLineTotal, formatCurrency } from '../../utils/calculations.ts';
import { downloadInvoicePdf, printInvoice } from '../../utils/pdfGenerator.ts';
import { FileText, Download, Printer, AlertTriangle, Plus, Trash2 } from 'lucide-react';

export const ProFormaGenerator: React.FC = () => {
  const [proforma, setProforma] = useState<InvoiceData>({
    id: `proforma_${Date.now()}`,
    invoiceNumber: 'PRO-2026-104',
    title: 'PRO FORMA INVOICE',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    paymentTerms: 'net_30',
    currency: 'USD',
    sender: DEFAULT_BUSINESS,
    client: DEFAULT_CLIENT,
    items: [
      {
        id: 'pf_1',
        name: 'Custom Fabricated Component Units (Lot A)',
        description: 'Preliminary manufacturing estimate for 50 precision units prior to international customs clearance.',
        quantity: 50,
        unit: 'units',
        rate: 85.00,
      },
      {
        id: 'pf_2',
        name: 'Export Freight & Port Handling Estimate',
        description: 'Estimated CIF delivery charge subject to final bill of lading weight.',
        quantity: 1,
        unit: 'shipment',
        rate: 450.00,
      },
    ],
    discount: { type: 'percentage', value: 0 },
    tax: { name: 'Estimated Customs Duty / VAT', rate: 5, isInclusive: false, enabled: true },
    shippingFee: 0,
    amountPaid: 0,
    paymentDetails: {
      bankName: 'Pacific Commerce Bank',
      accountName: 'Studio North Creative LLC',
      accountNumber: '•••••••• 4892',
      routingNumberOrSwift: 'PCBXUS33',
      customNotes: 'Pro forma advance payment: wire transfer must reference PRO-2026-104.',
    },
    notes: 'NOTICE: This Pro Forma Invoice is an advance quotation document issued for customs inspection, import permits, or advance deposit requirements. It does NOT constitute a final commercial tax invoice and is not recorded as an account receivable in financial ledgers.',
    terms: 'Prices quoted are firm for 30 calendar days. Final commercial tax invoice will be issued upon shipment completion.',
    footerNote: 'InvoiceCraft Pro Forma Generator · Free Small Business Document Tool',
    customization: {
      templateId: 'clean_corporate',
      accentColor: '#102A43',
      fontFamily: 'Plus Jakarta Sans',
      logoSize: 'medium',
      logoPosition: 'left',
      showWatermark: true,
      watermarkText: 'PRO FORMA',
    },
    updatedAt: new Date().toISOString(),
  });

  const [isExporting, setIsExporting] = useState(false);

  const calculations = calculateInvoiceTotals(
    proforma.items,
    proforma.discount,
    proforma.tax,
    proforma.shippingFee,
    0
  );

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadInvoicePdf('proforma-preview-sheet', `${proforma.invoiceNumber.toLowerCase()}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Pro Forma Invoice Generator</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal preliminary pro forma documents for customs clearance, advance deposits, and import licensing.
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
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download Pro Forma PDF'}</span>
          </button>
        </div>
      </div>

      {/* Compliance Advisory Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Bookkeeping Note:</strong> A pro forma invoice is a declaration of intent to provide goods or services at agreed prices. It is <em>not</em> an official tax invoice and should not be booked as actual accounts receivable in your accounting ledgers until services or shipments are formally finalized.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h2 className="font-semibold text-sm text-slate-800">Pro Forma Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Document Number</label>
                <input
                  type="text"
                  value={proforma.invoiceNumber}
                  onChange={(e) => setProforma(p => ({ ...p, invoiceNumber: e.target.value }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Date Issued</label>
                  <input
                    type="date"
                    value={proforma.issueDate}
                    onChange={(e) => setProforma(p => ({ ...p, issueDate: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Estimated Due Date</label>
                  <input
                    type="date"
                    value={proforma.dueDate}
                    onChange={(e) => setProforma(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Client Contact Name</label>
                <input
                  type="text"
                  value={proforma.client.name}
                  onChange={(e) => setProforma(p => ({ ...p, client: { ...p.client, name: e.target.value } }))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Client Shipping Destination</label>
                <textarea
                  rows={2}
                  value={proforma.client.shippingAddress || ''}
                  onChange={(e) => setProforma(p => ({ ...p, client: { ...p.client, shippingAddress: e.target.value } }))}
                  placeholder="Port of entry, warehouse dock, or physical delivery address"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 sticky top-24">
          <div
            id="proforma-preview-sheet"
            className="invoice-paper-sheet bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-md space-y-6 text-xs text-slate-800 relative overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <span className="text-8xl font-black text-slate-100 tracking-widest uppercase transform -rotate-45">
                PRO FORMA
              </span>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{proforma.sender.name}</h2>
                  <p className="text-slate-500 text-xs">{proforma.sender.email} · {proforma.sender.phone}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] rounded">
                    PRO FORMA INVOICE
                  </span>
                  <p className="text-base font-bold font-mono text-slate-900 mt-1.5">#{proforma.invoiceNumber}</p>
                  <p className="text-slate-500 text-[11px]">Issue Date: {proforma.issueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Consignee / Client</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{proforma.client.name}</p>
                  <p className="text-slate-500">{proforma.client.companyName}</p>
                  <p className="text-slate-500 whitespace-pre-line mt-1">{proforma.client.billingAddress}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Estimated Total</span>
                  <p className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
                    {formatCurrency(calculations.grandTotal, proforma.currency)}
                  </p>
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                    <th scope="col" className="py-2 px-2.5">Description</th>
                    <th scope="col" className="py-2 px-2.5 text-center w-24">Qty</th>
                    <th scope="col" className="py-2 px-2.5 text-right w-24">Est. Rate</th>
                    <th scope="col" className="py-2 px-2.5 text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {proforma.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5 px-2.5">
                        <p className="font-semibold text-slate-900">{it.name}</p>
                        <p className="text-[11px] text-slate-500">{it.description}</p>
                      </td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{it.quantity} {it.unit}</td>
                      <td className="py-2.5 px-2.5 text-right font-mono">{formatCurrency(it.rate, proforma.currency)}</td>
                      <td className="py-2.5 px-2.5 text-right font-mono font-semibold">{formatCurrency(calculateLineTotal(it), proforma.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-slate-500 text-[11px] leading-relaxed">
                <p><strong>Legal Pro Forma Notice:</strong> {proforma.notes}</p>
                <p><strong>Terms:</strong> {proforma.terms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
