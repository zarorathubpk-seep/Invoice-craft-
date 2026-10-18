import React from 'react';
import { ShieldCheck, Lock, Cloud, Database, Download, Trash2, Key } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-800 text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Legal &amp; Compliance</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Privacy &amp; Data Security Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 18, 2026 · SaaS Architecture Update</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-950">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Summary for Business Owners:</strong> InvoiceCraft uses genuine Google Firebase Authentication and Google Cloud Firestore. Your customer contacts, issued invoices, drafts, and business preferences are strictly partitioned per user account using rigorous security rules. You retain 100% ownership, complete data portability (instant JSON export), and the absolute right to permanent erasure (one-click complete deletion).
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          <span>1. User Accounts &amp; Authentication</span>
        </h2>
        <p>
          To access the professional Invoice Generator, cloud synchronization, and private dashboard, users create an account using Firebase Authentication. We support:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Email &amp; Password:</strong> Handled securely by Google Identity Toolkit. We never store or transmit plain-text user passwords.</li>
          <li><strong>Federated OAuth Providers (Google, Facebook):</strong> Authenticated directly through their official OAuth 2.0 endpoints. Only your public name, email address, and avatar URL are received.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <span>2. Cloud Storage &amp; Zero-Trust Data Isolation</span>
        </h2>
        <p>
          Unlike unauthenticated static tools, InvoiceCraft synchronizes your commercial workspace to encrypted Cloud Firestore databases:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Issued Invoices &amp; Drafts:</strong> Line item descriptions, calculations, rates, payment terms, and notes are stored under <code className="bg-slate-100 px-1 rounded text-xs font-mono">users/&#123;uid&#125;/invoices</code> and <code className="bg-slate-100 px-1 rounded text-xs font-mono">users/&#123;uid&#125;/drafts</code>.</li>
          <li><strong>Customer Address Book:</strong> Saved client names, emails, billing addresses, and tax identifiers are stored under <code className="bg-slate-100 px-1 rounded text-xs font-mono">users/&#123;uid&#125;/customers</code>.</li>
          <li><strong>Business Identity:</strong> Your registered business name, logo URL, remittance instructions, and currency preferences are stored under <code className="bg-slate-100 px-1 rounded text-xs font-mono">users/&#123;uid&#125;/settings/businessProfile</code>.</li>
        </ul>
        <p>
          <strong>Security Rules Enforcement:</strong> Every database operation is protected at the database engine level by Cloud Firestore Security Rules that mandate <code className="bg-slate-100 px-1 rounded text-xs font-mono">request.auth != null &amp;&amp; request.auth.uid == uid</code>. One user can never read, query, list, or overwrite another user&apos;s records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>3. Local Browser Caching (Offline Fallback)</span>
        </h2>
        <p>
          For optimal responsiveness and offline resilience, your active invoice workspace is mirrored in your browser&apos;s local cache (<code className="bg-slate-100 px-1 rounded text-xs font-mono">localStorage</code>). When your device is online, debounced autosave synchronizes changes to the cloud automatically. If offline, changes are queued locally until connectivity is restored.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          <span>4. Data Portability &amp; Instant Export</span>
        </h2>
        <p>
          In full accordance with GDPR and international data protection standards, you have the right to export all data associated with your account at any time. Under <strong>Dashboard &gt; Account Settings &gt; Data Privacy</strong>, you can download a complete, unencrypted JSON archive containing all invoices, drafts, customers, and business preferences.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          <span>5. Right to Erasure (Complete Account Deletion)</span>
        </h2>
        <p>
          You have the absolute right to delete your account. Our deletion workflow performs an exhaustive purge:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>All cloud invoices, drafts, and historical records under your UID are deleted from Cloud Firestore.</li>
          <li>All saved client contacts and address book entries are permanently destroyed.</li>
          <li>Your business profile, banking details, and settings are purged.</li>
          <li>Your authentication credentials are deleted from Firebase Authentication.</li>
        </ul>
        <p>
          We do not leave orphaned personal or commercial data in the cloud following an account deletion request.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">6. Third-Party Disclosures &amp; Subprocessors</h2>
        <p>
          We partner only with enterprise infrastructure providers necessary to deliver our services:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Google Cloud Platform &amp; Firebase:</strong> For cloud database hosting, authentication, and secure servers in compliance with SOC 1/2/3 and ISO 27001 certifications.</li>
        </ul>
        <p>
          We do not sell, rent, monetize, or feed your customer financial information or invoice line items to advertising networks or third-party brokers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">7. Contact the Privacy Team</h2>
        <p>
          For privacy inquiries, audit requests, or compliance documentation, contact our Data Protection Officer at:
        </p>
        <p className="font-mono font-bold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block text-xs">
          zarorathub.pk@gmail.com
        </p>
      </section>
    </div>
  );
};
