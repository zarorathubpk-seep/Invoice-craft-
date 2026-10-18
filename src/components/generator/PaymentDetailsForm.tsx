import React from 'react';
import { InvoiceData, PaymentInstructions } from '../../types/invoice.ts';
import { CreditCard, FileCheck, MessageSquare } from 'lucide-react';

interface PaymentDetailsFormProps {
  paymentDetails: PaymentInstructions;
  notes: string;
  terms: string;
  footerNote: string;
  onPaymentDetailsChange: (details: PaymentInstructions) => void;
  onNotesChange: (notes: string) => void;
  onTermsChange: (terms: string) => void;
  onFooterNoteChange: (footer: string) => void;
}

export const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  paymentDetails,
  notes,
  terms,
  footerNote,
  onPaymentDetailsChange,
  onNotesChange,
  onTermsChange,
  onFooterNoteChange,
}) => {
  const handlePaymentField = (field: keyof PaymentInstructions, val: string) => {
    onPaymentDetailsChange({ ...paymentDetails, [field]: val });
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Payment Instructions & Client Notes</h3>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Bank Name</label>
          <input
            type="text"
            value={paymentDetails.bankName || ''}
            onChange={(e) => handlePaymentField('bankName', e.target.value)}
            placeholder="e.g. JPMorgan Chase / Barclays"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Account Beneficiary Name</label>
          <input
            type="text"
            value={paymentDetails.accountName || ''}
            onChange={(e) => handlePaymentField('accountName', e.target.value)}
            placeholder="Studio North Creative LLC"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Account Number / IBAN</label>
          <input
            type="text"
            value={paymentDetails.accountNumber || ''}
            onChange={(e) => handlePaymentField('accountNumber', e.target.value)}
            placeholder="IBAN or Account #"
            className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">SWIFT / BIC / Routing Code</label>
          <input
            type="text"
            value={paymentDetails.routingNumberOrSwift || ''}
            onChange={(e) => handlePaymentField('routingNumberOrSwift', e.target.value)}
            placeholder="e.g. CHASUS33"
            className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">PayPal Email</label>
          <input
            type="email"
            value={paymentDetails.paypalEmail || ''}
            onChange={(e) => handlePaymentField('paypalEmail', e.target.value)}
            placeholder="billing@yourdomain.com"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Wire Transfer Reference</label>
          <input
            type="text"
            value={paymentDetails.paymentReference || ''}
            onChange={(e) => handlePaymentField('paymentReference', e.target.value)}
            placeholder="e.g. Invoice # or Client Code"
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes & Terms Textareas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Thank You / Client Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Thank you for your business! We appreciate working with you."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Terms & Conditions</label>
          <textarea
            rows={3}
            value={terms}
            onChange={(e) => onTermsChange(e.target.value)}
            placeholder="Payment due within agreed terms. Direct ACH or wire transfer preferred."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-medium text-slate-700 mb-1">Footer Subtext / Disclosures</label>
          <input
            type="text"
            value={footerNote}
            onChange={(e) => onFooterNoteChange(e.target.value)}
            placeholder="InvoiceCraft Verified Free Generator · No Personal Data Transmitted"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
