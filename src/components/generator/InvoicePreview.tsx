import React from 'react';
import { InvoiceData } from '../../types/invoice.ts';
import { calculateInvoiceTotals, calculateLineTotal, formatCurrency } from '../../utils/calculations.ts';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  scale?: number;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, scale = 1 }) => {
  const calculations = calculateInvoiceTotals(
    invoice.items,
    invoice.discount,
    invoice.tax,
    invoice.shippingFee,
    invoice.amountPaid
  );

  const { customization } = invoice;
  const accentColor = customization?.accentColor || '#2563EB';
  const templateId = customization?.templateId || 'modern_minimal';

  // Format terms label
  const termsLabels: Record<string, string> = {
    due_on_receipt: 'Due Upon Receipt',
    net_7: 'Net 7 Days',
    net_15: 'Net 15 Days',
    net_30: 'Net 30 Days',
    net_60: 'Net 60 Days',
    custom: 'Custom Terms',
  };

  const logoDimension = {
    small: 'max-h-12 max-w-[140px]',
    medium: 'max-h-16 max-w-[180px]',
    large: 'max-h-24 max-w-[240px]',
  }[customization?.logoSize || 'medium'];

  return (
    <div className="relative overflow-hidden flex justify-center py-4 bg-slate-200/50 rounded-xl">
      {/* Printable Sheet (Standard A4 ratio 210mm x 297mm approx 1:1.414) */}
      <div
        id="invoice-preview-sheet"
        className="invoice-paper-sheet bg-white text-slate-800 shadow-xl border border-slate-200 transition-all duration-200 mx-auto w-full max-w-[794px] min-h-[1123px] p-8 md:p-12 relative flex flex-col justify-between"
        style={{
          fontFamily: customization?.fontFamily || 'Plus Jakarta Sans',
        }}
      >
        {/* Optional Watermark */}
        {customization?.showWatermark && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <span className="text-8xl md:text-9xl font-black text-slate-200/40 tracking-widest uppercase transform -rotate-45">
              {customization.watermarkText || 'DRAFT'}
            </span>
          </div>
        )}

        <div className="relative z-10 space-y-8 flex-1">
          {/* Header Section (Adjusted per Template) */}
          {templateId === 'executive_navy' ? (
            <div className="bg-slate-900 text-white -m-8 md:-m-12 p-8 md:p-12 mb-8 rounded-t-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  {invoice.sender.logoUrl ? (
                    <img
                      src={invoice.sender.logoUrl}
                      alt={invoice.sender.name}
                      className={`${logoDimension} object-contain mb-3 bg-white/10 p-1.5 rounded`}
                    />
                  ) : (
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                      {invoice.sender.name || 'Your Company Name'}
                    </h1>
                  )}
                  <p className="text-xs text-slate-300">{invoice.sender.taxId ? `Tax ID / Reg: ${invoice.sender.taxId}` : ''}</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded mb-1">
                    {invoice.title || 'Tax Invoice'}
                  </span>
                  <div className="text-2xl font-bold font-mono text-white">#{invoice.invoiceNumber || 'INV-001'}</div>
                  <div className="text-xs text-slate-300 mt-1">Issue Date: {invoice.issueDate || 'YYYY-MM-DD'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-100 pb-8">
              {/* Sender Brand / Logo */}
              <div className="space-y-2 max-w-sm">
                {invoice.sender.logoUrl ? (
                  <img
                    src={invoice.sender.logoUrl}
                    alt={invoice.sender.name}
                    className={`${logoDimension} object-contain`}
                  />
                ) : (
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900" style={{ color: templateId === 'classic' ? '#0F172A' : accentColor }}>
                    {invoice.sender.name || 'Your Company Name'}
                  </h1>
                )}
                <div className="text-xs text-slate-500 leading-relaxed space-y-0.5">
                  {invoice.sender.addressLine1 && <p>{invoice.sender.addressLine1}</p>}
                  {invoice.sender.addressLine2 && <p>{invoice.sender.addressLine2}</p>}
                  {(invoice.sender.city || invoice.sender.state || invoice.sender.postalCode) && (
                    <p>{[invoice.sender.city, invoice.sender.state, invoice.sender.postalCode].filter(Boolean).join(', ')}</p>
                  )}
                  {invoice.sender.country && <p>{invoice.sender.country}</p>}
                  {invoice.sender.email && <p>Email: {invoice.sender.email}</p>}
                  {invoice.sender.phone && <p>Tel: {invoice.sender.phone}</p>}
                  {invoice.sender.taxId && <p className="font-medium text-slate-600">Tax ID: {invoice.sender.taxId}</p>}
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="text-left sm:text-right space-y-1.5 shrink-0">
                <h2
                  className="text-3xl font-bold uppercase tracking-tight"
                  style={{ color: templateId === 'elegant_blue' ? '#2563EB' : '#0F172A' }}
                >
                  {invoice.title || 'Invoice'}
                </h2>
                <div className="text-base font-semibold font-mono text-slate-700">
                  #{invoice.invoiceNumber || 'INV-001'}
                </div>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <p><span className="text-slate-400">Date:</span> <strong className="text-slate-700">{invoice.issueDate}</strong></p>
                  <p><span className="text-slate-400">Due Date:</span> <strong className="text-slate-700">{invoice.dueDate}</strong></p>
                  <p><span className="text-slate-400">Terms:</span> <span className="text-slate-700">{termsLabels[invoice.paymentTerms] || invoice.paymentTerms}</span></p>
                  {invoice.purchaseOrderRef && (
                    <p><span className="text-slate-400">PO Ref:</span> <span className="font-mono text-slate-700">{invoice.purchaseOrderRef}</span></p>
                  )}
                  {invoice.projectRef && (
                    <p><span className="text-slate-400">Project:</span> <span className="text-slate-700">{invoice.projectRef}</span></p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Billed To (Client Details) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
            <div className="space-y-1 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Billed To</span>
              <p className="text-sm font-bold text-slate-900">{invoice.client.name || 'Client Contact Name'}</p>
              {invoice.client.companyName && <p className="font-medium text-slate-700">{invoice.client.companyName}</p>}
              {invoice.client.email && <p className="text-slate-500">{invoice.client.email}</p>}
              {invoice.client.phone && <p className="text-slate-500">{invoice.client.phone}</p>}
              {invoice.client.billingAddress && (
                <p className="text-slate-500 whitespace-pre-line pt-0.5">{invoice.client.billingAddress}</p>
              )}
              {invoice.client.taxId && <p className="text-slate-600 font-medium">Tax ID: {invoice.client.taxId}</p>}
            </div>

            {invoice.client.shippingAddress && (
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ship To</span>
                <p className="text-slate-500 whitespace-pre-line">{invoice.client.shippingAddress}</p>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className="border-b-2 text-slate-600 uppercase tracking-wider text-[11px]"
                  style={{
                    borderColor: accentColor,
                    backgroundColor: templateId === 'clean_corporate' ? '#F8FAFC' : 'transparent',
                  }}
                >
                  <th scope="col" className="py-2.5 px-2 font-semibold">Description</th>
                  <th scope="col" className="py-2.5 px-2 text-center font-semibold w-16">Qty</th>
                  <th scope="col" className="py-2.5 px-2 text-right font-semibold w-24">Rate</th>
                  {invoice.items.some(i => (i.discountPercent || 0) > 0) && (
                    <th scope="col" className="py-2.5 px-2 text-right font-semibold w-20">Disc %</th>
                  )}
                  <th scope="col" className="py-2.5 px-2 text-right font-semibold w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      No line items added yet. Click &quot;Add Item&quot; in the editor.
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item, idx) => {
                    const lineTot = calculateLineTotal(item);
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2">
                          <p className="font-semibold text-slate-900">{item.name || 'Untitled Item'}</p>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 whitespace-pre-line mt-0.5 max-w-md">
                              {item.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center text-slate-700 font-mono tabular-nums">
                          {item.quantity} {item.unit && <span className="text-[10px] text-slate-400">{item.unit}</span>}
                        </td>
                        <td className="py-3 px-2 text-right text-slate-700 font-mono tabular-nums">
                          {formatCurrency(item.rate, invoice.currency)}
                        </td>
                        {invoice.items.some(i => (i.discountPercent || 0) > 0) && (
                          <td className="py-3 px-2 text-right text-slate-600 font-mono tabular-nums">
                            {item.discountPercent ? `${item.discountPercent}%` : '-'}
                          </td>
                        )}
                        <td className="py-3 px-2 text-right font-semibold text-slate-900 font-mono tabular-nums">
                          {formatCurrency(lineTot, invoice.currency)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums font-medium">{formatCurrency(calculations.subtotal, invoice.currency)}</span>
              </div>

              {calculations.discountAmount > 0 && (
                <div className="flex justify-between py-1 text-emerald-600">
                  <span>Discount {invoice.discount.type === 'percentage' ? `(${invoice.discount.value}%)` : ''}:</span>
                  <span className="font-mono tabular-nums font-medium">-{formatCurrency(calculations.discountAmount, invoice.currency)}</span>
                </div>
              )}

              {invoice.tax.enabled && calculations.taxAmount > 0 && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>{invoice.tax.name || 'Tax'} ({invoice.tax.rate}% {invoice.tax.isInclusive ? 'incl.' : ''}):</span>
                  <span className="font-mono tabular-nums font-medium">{formatCurrency(calculations.taxAmount, invoice.currency)}</span>
                </div>
              )}

              {calculations.shippingFee > 0 && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Shipping & Handling:</span>
                  <span className="font-mono tabular-nums font-medium">{formatCurrency(calculations.shippingFee, invoice.currency)}</span>
                </div>
              )}

              <div
                className="flex justify-between py-2.5 px-3 rounded-lg text-sm font-bold border-t border-slate-200 mt-2"
                style={{
                  backgroundColor: templateId === 'modern_minimal' ? '#F8FAFC' : '#F1F5F9',
                  color: '#0F172A',
                }}
              >
                <span>Total:</span>
                <span className="font-mono tabular-nums" style={{ color: accentColor }}>
                  {formatCurrency(calculations.grandTotal, invoice.currency)}
                </span>
              </div>

              {calculations.amountPaid > 0 && (
                <>
                  <div className="flex justify-between py-1 text-slate-500 text-xs">
                    <span>Amount Paid:</span>
                    <span className="font-mono tabular-nums text-slate-700">-{formatCurrency(calculations.amountPaid, invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-amber-50 rounded text-xs font-bold text-amber-900 border border-amber-200">
                    <span>Balance Due:</span>
                    <span className="font-mono tabular-nums">{formatCurrency(calculations.balanceDue, invoice.currency)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Instructions & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
            {/* Payment Details */}
            {(invoice.paymentDetails.bankName || invoice.paymentDetails.paypalEmail || invoice.paymentDetails.customNotes) && (
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">Payment Instructions</span>
                {invoice.paymentDetails.bankName && <p><strong className="text-slate-700">Bank:</strong> {invoice.paymentDetails.bankName}</p>}
                {invoice.paymentDetails.accountName && <p><strong className="text-slate-700">Account Name:</strong> {invoice.paymentDetails.accountName}</p>}
                {invoice.paymentDetails.accountNumber && <p><strong className="text-slate-700">Account / IBAN:</strong> <span className="font-mono">{invoice.paymentDetails.accountNumber}</span></p>}
                {invoice.paymentDetails.routingNumberOrSwift && <p><strong className="text-slate-700">SWIFT / Routing:</strong> <span className="font-mono">{invoice.paymentDetails.routingNumberOrSwift}</span></p>}
                {invoice.paymentDetails.paypalEmail && <p><strong className="text-slate-700">PayPal:</strong> {invoice.paymentDetails.paypalEmail}</p>}
                {invoice.paymentDetails.paymentReference && <p><strong className="text-slate-700">Reference:</strong> {invoice.paymentDetails.paymentReference}</p>}
                {invoice.paymentDetails.customNotes && <p className="text-slate-500 italic pt-1">{invoice.paymentDetails.customNotes}</p>}
              </div>
            )}

            {/* Terms and Notes */}
            <div className="space-y-2">
              {invoice.notes && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">Notes</span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">Terms & Conditions</span>
                  <p className="text-slate-500 leading-relaxed mt-0.5">{invoice.terms}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signature Block (if configured) */}
          {(customization?.signatureUrl || customization?.signatureName) && (
            <div className="flex justify-end pt-4">
              <div className="text-right space-y-1">
                {customization.signatureUrl && (
                  <img
                    src={customization.signatureUrl}
                    alt="Authorized Signature"
                    className="h-12 object-contain ml-auto"
                  />
                )}
                <div className="w-48 border-t border-slate-300 ml-auto pt-1">
                  <p className="text-xs font-semibold text-slate-800">{customization.signatureName || 'Authorized Signature'}</p>
                  {customization.signatureDate && (
                    <p className="text-[10px] text-slate-400">Date: {customization.signatureDate}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-8 mt-auto border-t border-slate-100 text-center text-[10px] text-slate-400">
          <p>{invoice.footerNote || 'Generated with InvoiceCraft · Free Online Document Generator'}</p>
        </div>
      </div>
    </div>
  );
};
