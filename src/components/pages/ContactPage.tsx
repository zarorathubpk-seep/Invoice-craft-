import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback regarding InvoiceCraft');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Verified contact destination
  const CONTACT_EMAIL = 'zarorathub.pk@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Since no third-party server backend is configured for form processing,
    // we launch a clean mailto draft while acknowledging submission in-app.
    const mailtoUri = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[InvoiceCraft Contact] ${subject}`
    )}&body=${encodeURIComponent(
      `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}\n\nSent via InvoiceCraft Web Contact Form`
    )}`;

    window.location.href = mailtoUri;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-xl mb-1">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Have an inquiry, suggestion for a new document tool, or feedback? Get in touch with the InvoiceCraft team.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Direct Email Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Official Editorial & Support Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm font-bold text-slate-900 hover:text-blue-600 font-mono"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Open Mail Client &rarr;
          </a>
        </div>

        {/* Contact Form */}
        {submitted ? (
          <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-emerald-950">Thank You For Reaching Out</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Your message was prepared for delivery. If your email application did not launch automatically, please email us directly at <strong>{CONTACT_EMAIL}</strong>.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 px-4 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Topic / Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Question about invoice templates or tax calculator"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help your business?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Processed client-side. We respect your privacy.
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
