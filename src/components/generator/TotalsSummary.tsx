import React from 'react';
import { CurrencyCode, DiscountConfig, LineItem, TaxConfig } from '../../types/invoice.ts';
import { Calculator, Percent, ShieldAlert } from 'lucide-react';
import { calculateInvoiceTotals, formatCurrency } from '../../utils/calculations.ts';

interface TotalsSummaryProps {
  items: LineItem[];
  currency: CurrencyCode;
  discount: DiscountConfig;
  tax: TaxConfig;
  shippingFee: number;
  amountPaid: number;
  onDiscountChange: (discount: DiscountConfig) => void;
  onTaxChange: (tax: TaxConfig) => void;
  onShippingChange: (fee: number) => void;
  onAmountPaidChange: (paid: number) => void;
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({
  items,
  currency,
  discount,
  tax,
  shippingFee,
  amountPaid,
  onDiscountChange,
  onTaxChange,
  onShippingChange,
  onAmountPaidChange,
}) => {
  const calculations = calculateInvoiceTotals(items, discount, tax, shippingFee, amountPaid);

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Financial Calculations & Totals</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Left Column: Adjustments & Tax Controls */}
        <div className="space-y-3.5">
          {/* Discount Controls */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Document Discount</span>
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded p-0.5">
                <button
                  type="button"
                  onClick={() => onDiscountChange({ ...discount, type: 'percentage' })}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    discount.type === 'percentage' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => onDiscountChange({ ...discount, type: 'fixed' })}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    discount.type === 'fixed' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fixed
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={discount.value || ''}
                onChange={(e) => onDiscountChange({ ...discount, value: parseFloat(e.target.value) || 0 })}
                placeholder={discount.type === 'percentage' ? 'e.g. 10 (%)' : 'e.g. 50 (fixed)'}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-500 text-[11px] shrink-0 font-mono">
                -{formatCurrency(calculations.discountAmount, currency)}
              </span>
            </div>
          </div>

          {/* Tax Controls */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="enable-tax"
                  checked={tax.enabled}
                  onChange={(e) => onTaxChange({ ...tax, enabled: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="enable-tax" className="font-medium text-slate-700 cursor-pointer">
                  Enable Sales Tax / VAT / GST
                </label>
              </div>
              {tax.enabled && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onTaxChange({ ...tax, isInclusive: false })}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                      !tax.isInclusive ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Exclusive
                  </button>
                  <button
                    type="button"
                    onClick={() => onTaxChange({ ...tax, isInclusive: true })}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                      tax.isInclusive ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Inclusive
                  </button>
                </div>
              )}
            </div>

            {tax.enabled && (
              <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in duration-200">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Tax Name</label>
                  <input
                    type="text"
                    value={tax.name}
                    onChange={(e) => onTaxChange({ ...tax, name: e.target.value })}
                    placeholder="VAT / GST / Sales Tax"
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax.rate || ''}
                    onChange={(e) => onTaxChange({ ...tax, rate: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 8.5"
                    className="w-full px-2 py-1 font-mono border border-slate-300 rounded bg-white text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Shipping & Handling */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Shipping & Handling</label>
              <input
                type="number"
                min="0"
                step="any"
                value={shippingFee || ''}
                onChange={(e) => onShippingChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Amount Paid (Deposit)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amountPaid || ''}
                onChange={(e) => onAmountPaidChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full px-2.5 py-1.5 font-mono border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Breakdown Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5 self-start">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono tabular-nums font-medium text-slate-900">
              {formatCurrency(calculations.subtotal, currency)}
            </span>
          </div>

          {calculations.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Document Discount:</span>
              <span className="font-mono tabular-nums font-medium">
                -{formatCurrency(calculations.discountAmount, currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-slate-500 text-[11px] pt-0.5 border-t border-slate-200">
            <span>Discounted Net:</span>
            <span className="font-mono tabular-nums">
              {formatCurrency(calculations.discountedSubtotal, currency)}
            </span>
          </div>

          {tax.enabled && (
            <div className="flex justify-between text-slate-600">
              <span>{tax.name || 'Tax'} ({tax.rate}% {tax.isInclusive ? 'included' : 'added'}):</span>
              <span className="font-mono tabular-nums font-medium text-slate-900">
                {formatCurrency(calculations.taxAmount, currency)}
              </span>
            </div>
          )}

          {calculations.shippingFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-mono tabular-nums font-medium text-slate-900">
                {formatCurrency(calculations.shippingFee, currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-900 mt-2">
            <span>Grand Total:</span>
            <span className="font-mono tabular-nums text-blue-600 text-base">
              {formatCurrency(calculations.grandTotal, currency)}
            </span>
          </div>

          {calculations.amountPaid > 0 && (
            <>
              <div className="flex justify-between text-slate-500 text-xs">
                <span>Amount Paid:</span>
                <span className="font-mono tabular-nums">
                  -{formatCurrency(calculations.amountPaid, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-amber-50 border border-amber-200 rounded text-xs font-bold text-amber-950">
                <span>Balance Due:</span>
                <span className="font-mono tabular-nums text-sm">
                  {formatCurrency(calculations.balanceDue, currency)}
                </span>
              </div>
            </>
          )}

          <p className="text-[10px] text-slate-400 italic pt-1">
            * Calculations computed using 2-decimal financial rounding. Tax rules vary by jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};
