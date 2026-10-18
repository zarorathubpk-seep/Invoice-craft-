import React, { useState } from 'react';
import { roundToDecimals, formatCurrency } from '../../utils/calculations.ts';
import { Calculator, Copy, Check, Info } from 'lucide-react';

export const TaxCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [copied, setCopied] = useState(false);

  // Calculations
  const safeAmount = Math.max(0, amount || 0);
  const safeRate = Math.max(0, taxRate || 0);

  let netAmount = 0;
  let taxAmount = 0;
  let grossAmount = 0;

  if (isInclusive) {
    // Amount includes tax
    grossAmount = safeAmount;
    netAmount = roundToDecimals(safeAmount / (1 + safeRate / 100), 2);
    taxAmount = roundToDecimals(grossAmount - netAmount, 2);
  } else {
    // Amount is net (exclusive)
    netAmount = safeAmount;
    taxAmount = roundToDecimals(safeAmount * (safeRate / 100), 2);
    grossAmount = roundToDecimals(netAmount + taxAmount, 2);
  }

  const copyBreakdown = () => {
    const text = `Tax Calculation Summary (${currency}):\nMode: ${isInclusive ? 'Tax Inclusive' : 'Tax Exclusive'}\nRate: ${safeRate}%\nNet Amount: ${formatCurrency(netAmount, currency)}\nTax Amount: ${formatCurrency(taxAmount, currency)}\nGross Total: ${formatCurrency(grossAmount, currency)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-xl mb-1">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Sales Tax & VAT Calculator</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Calculate tax inclusive or tax exclusive amounts, extract VAT from gross sums, and verify invoice totals.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Base Monetary Amount</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={taxRate || ''}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Calculation Method</label>
            <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-colors ${
                  !isInclusive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tax Exclusive (+ Add)
              </button>
              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-colors ${
                  isInclusive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tax Inclusive (Extract)
              </button>
            </div>
          </div>
        </div>

        {/* Preset tax rates */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500">Quick Rates:</span>
          {[5, 8.25, 10, 15, 19, 20, 21].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTaxRate(r)}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                taxRate === r ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r}%
            </button>
          ))}
        </div>

        {/* Results display */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800">Calculation Breakdown</h3>
            <button
              type="button"
              onClick={copyBreakdown}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to clipboard' : 'Copy Breakdown'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Net Amount (Pre-Tax)</span>
              <p className="text-xl font-bold font-mono text-slate-900 mt-1">
                {formatCurrency(netAmount, currency)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Calculated Tax ({safeRate}%)</span>
              <p className="text-xl font-bold font-mono text-blue-600 mt-1">
                {formatCurrency(taxAmount, currency)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Gross Total (With Tax)</span>
              <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
                {formatCurrency(grossAmount, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Jurisdictional Disclaimer:</strong> Tax legislation varies by state, province, and nation. Value Added Tax (VAT), Goods & Services Tax (GST), and provincial sales taxes operate under distinct registration thresholds and exemption classifications. This calculator provides arithmetic estimations and does not constitute certified tax advice.
          </p>
        </div>
      </div>
    </div>
  );
};
