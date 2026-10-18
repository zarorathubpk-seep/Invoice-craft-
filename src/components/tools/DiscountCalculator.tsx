import React, { useState } from 'react';
import { roundToDecimals, formatCurrency } from '../../utils/calculations.ts';
import { Tag, Copy, Check } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<number>(250);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [taxRate, setTaxRate] = useState<number>(8.5);
  const [includeTax, setIncludeTax] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const safeOriginal = Math.max(0, originalPrice || 0);
  const safeDiscountVal = Math.max(0, discountValue || 0);

  let savings = 0;
  if (discountType === 'percentage') {
    savings = roundToDecimals(safeOriginal * (Math.min(100, safeDiscountVal) / 100), 2);
  } else {
    savings = roundToDecimals(Math.min(safeOriginal, safeDiscountVal), 2);
  }

  const discountedPrice = roundToDecimals(safeOriginal - savings, 2);
  const taxAmount = includeTax ? roundToDecimals(discountedPrice * (Math.max(0, taxRate || 0) / 100), 2) : 0;
  const finalPrice = roundToDecimals(discountedPrice + taxAmount, 2);

  const copyBreakdown = () => {
    const text = `Discount Calculation:\nOriginal: $${safeOriginal.toFixed(2)}\nDiscount: -$${savings.toFixed(2)}\nDiscounted Net: $${discountedPrice.toFixed(2)}\nTax (${taxRate}%): $${taxAmount.toFixed(2)}\nFinal Total: $${finalPrice.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-2 bg-amber-50 text-amber-600 rounded-xl mb-1">
          <Tag className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Discount & Savings Calculator</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Compute client discounts, promotional markdowns, and post-discount tax totals accurately.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Original Price ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={originalPrice || ''}
              onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-medium text-slate-700">Discount Amount</label>
              <div className="flex rounded border border-slate-200 p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                    discountType === 'percentage' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                    discountType === 'fixed' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  Fixed $
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              step="any"
              value={discountValue || ''}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              placeholder={discountType === 'percentage' ? '15 (%)' : '25 ($)'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-medium text-slate-700">Sales Tax / VAT (%)</label>
              <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTax}
                  onChange={(e) => setIncludeTax(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Apply
              </label>
            </div>
            <input
              type="number"
              min="0"
              step="0.1"
              disabled={!includeTax}
              value={taxRate || ''}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm disabled:bg-slate-100 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800">Final Calculation</h3>
            <button
              type="button"
              onClick={copyBreakdown}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Original Price</span>
              <p className="text-lg font-bold font-mono text-slate-700 mt-1">
                ${safeOriginal.toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Total Savings</span>
              <p className="text-lg font-bold font-mono text-emerald-600 mt-1">
                -${savings.toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Tax on Discounted</span>
              <p className="text-lg font-bold font-mono text-slate-700 mt-1">
                +${taxAmount.toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-200 bg-blue-50/30">
              <span className="text-xs text-blue-700 font-semibold">Final Price</span>
              <p className="text-xl font-bold font-mono text-blue-600 mt-1">
                ${finalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
