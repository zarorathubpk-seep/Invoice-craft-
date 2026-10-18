import React from 'react';
import { ShieldCheck, Lock, HardDrive, Cookie } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Legal Documentation</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 17, 2026</p>
      </div>

      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong>Summary for Busy Professionals:</strong> InvoiceCraft does not send your client records, invoice item descriptions, or financial rates to external servers. Document generation runs entirely in your web browser. Local drafts stay inside your computer&apos;s localStorage until you choose to clear them.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Client-Side Document Generation Architecture</h2>
        <p>
          When you use InvoiceCraft to create invoices, quotations, receipts, pro forma documents, or credit notes, all data entry, mathematical calculations, and PDF rendering take place locally within your web browser (client-side execution).
        </p>
        <p>
          Unlike legacy cloud invoicing services, we do not require you to create an account, nor do we sync your commercial client database to our servers. Your financial information belongs exclusively to you and your business.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Local Browser Storage (localStorage)</h2>
        <p>
          To enhance user convenience and prevent data loss if your browser refreshes, InvoiceCraft utilizes your browser&apos;s native <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code> API. This storage holds:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Active invoice drafts and template preferences.</li>
          <li>Locally saved customer address book entries (optional).</li>
          <li>Locally logged business expense records (optional).</li>
          <li>Your cookie and storage preference acknowledgement.</li>
        </ul>
        <p>
          You may clear all locally cached information at any time directly through the app (&apos;Clear Stored Expenses&apos; or drafts trash controls) or through your browser&apos;s site settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Cookies & Advertising Technologies</h2>
        <p>
          InvoiceCraft operates on a privacy-first model. We do not place third-party tracking pixels on document generation workflows. In the future, to keep our document generation tools 100% free for all users, we may partner with vetted advertising networks (such as RevBid). Any advertising integration will be deployed in accordance with strict consent management controls, and advertising code is strictly excluded from exported PDF invoices and print output.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. Contact Inquiries & Correspondence</h2>
        <p>
          When you send inquiries via email to our team (e.g. at <strong className="font-mono text-slate-900">zarorathub.pk@gmail.com</strong>), we use your email address solely to reply to your question. We never sell, rent, or distribute contact lists to third-party marketing companies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">5. Contact Information</h2>
        <p>
          If you have questions regarding this Privacy Policy or wish to request data verification, contact our privacy compliance team at <strong className="font-mono text-blue-600">zarorathub.pk@gmail.com</strong>.
        </p>
      </section>
    </div>
  );
};
