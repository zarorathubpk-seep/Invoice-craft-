import React, { useState } from 'react';
import { roundToDecimals, formatCurrency } from '../../utils/calculations.ts';
import { TrendingUp, Copy, Check, DollarSign } from 'lucide-react';

export const ProfitMarginCalculator: React.FC = () => {
  const [cost, setCost] = useState<number>(60);
  const [revenue, setRevenue] = useState<number>(100);
  const [copied, setCopied] = useState(false);

  const safeCost = Math.max(0, cost || 0);
  const safeRevenue = Math.max(0, revenue || 0);

  const grossProfit = roundToDecimals(safeRevenue - safeCost, 2);
  const profitMarginPercent = safeRevenue > 0 ? roundToDecimals((grossProfit / safeRevenue) * 100, 2) : 0;
  const markupPercent = safeCost > 0 ? roundToDecimals((grossProfit / safeCost) * 100, 2) : 0;

  const copyBreakdown = () => {
    const text = `Profit Margin Breakdown:\nCost Price: $${safeCost.toFixed(2)}\nSelling Price: $${safeRevenue.toFixed(2)}\nGross Profit: $${grossProfit.toFixed(2)}\nProfit Margin: ${profitMarginPercent}%\nMarkup: ${markupPercent}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-xl mb-1">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profit Margin & Markup Calculator</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Compute gross profit, profit margin percentage, and required markup to set sustainable freelance and product pricing.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Cost of Goods / Service Delivery ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={cost || ''}
              onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Direct labor, subcontractor fees, software, materials</p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Selling Price / Client Revenue ($)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={revenue || ''}
              onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">What you charge the client</p>
          </div>
        </div>

        {/* Results grid */}
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800">Financial Performance</h3>
            <button
              type="button"
              onClick={copyBreakdown}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Result'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Gross Profit</span>
              <p className={`text-xl font-bold font-mono mt-1 ${grossProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                ${grossProfit.toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Profit Margin</span>
              <p className="text-xl font-bold font-mono text-blue-600 mt-1">
                {profitMarginPercent}%
              </p>
              <span className="text-[10px] text-slate-400">Profit as % of revenue</span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500">Markup</span>
              <p className="text-xl font-bold font-mono text-teal-700 mt-1">
                {markupPercent}%
              </p>
              <span className="text-[10px] text-slate-400">Profit as % of cost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
