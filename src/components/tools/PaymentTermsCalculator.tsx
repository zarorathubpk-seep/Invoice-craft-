import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const PaymentTermsCalculator: React.FC = () => {
  const [invoiceDate, setInvoiceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [termDays, setTermDays] = useState<number>(30);

  const calculateDueDate = (baseDateStr: string, days: number): { dateStr: string; dayName: string; daysRemaining: number } => {
    if (!baseDateStr) return { dateStr: '', dayName: '', daysRemaining: 0 };
    const date = new Date(baseDateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return { dateStr: '', dayName: '', daysRemaining: 0 };

    const due = new Date(date);
    due.setDate(due.getDate() + days);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = due.toISOString().split('T')[0];
    const dayName = due.toLocaleDateString('en-US', options);

    return { dateStr, dayName, daysRemaining };
  };

  const { dateStr, dayName, daysRemaining } = calculateDueDate(invoiceDate, termDays);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-xl mb-1">
          <Calendar className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Payment Terms Due Date Calculator</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Determine the exact calendar due date and payment deadlines from Net 7, Net 15, Net 30, or custom terms.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Invoice Issue Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Payment Terms (Calendar Days)</label>
            <input
              type="number"
              min="0"
              value={termDays}
              onChange={(e) => setTermDays(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500">Standard Presets:</span>
          {[
            { label: 'Due on Receipt (0)', days: 0 },
            { label: 'Net 7', days: 7 },
            { label: 'Net 14', days: 14 },
            { label: 'Net 15', days: 15 },
            { label: 'Net 30', days: 30 },
            { label: 'Net 45', days: 45 },
            { label: 'Net 60', days: 60 },
            { label: 'Net 90', days: 90 },
          ].map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => setTermDays(preset.days)}
              className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors ${
                termDays === preset.days
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Calculated Result Card */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Target Settlement Date</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Official Due Date</span>
              <p className="text-2xl font-bold font-mono text-slate-900">{dateStr}</p>
              <p className="text-xs text-slate-600 font-medium pt-1">{dayName}</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Timeline Status</span>
              <p className={`text-2xl font-bold font-mono ${daysRemaining >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {daysRemaining >= 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}
              </p>
              <p className="text-xs text-slate-500 pt-1">Relative to today&apos;s date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
