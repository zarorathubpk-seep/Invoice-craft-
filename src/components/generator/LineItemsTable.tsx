import React from 'react';
import { CurrencyCode, LineItem } from '../../types/invoice.ts';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, ShoppingBag } from 'lucide-react';
import { calculateLineTotal, formatCurrency } from '../../utils/calculations.ts';

interface LineItemsTableProps {
  items: LineItem[];
  currency: CurrencyCode;
  onChange: (items: LineItem[]) => void;
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({ items, currency, onChange }) => {
  const addItem = () => {
    const newItem: LineItem = {
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      unit: 'hrs',
      rate: 0,
      discountPercent: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<LineItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      // Keep at least one empty row
      onChange([{
        id: `item_${Date.now()}`,
        name: '',
        description: '',
        quantity: 1,
        unit: 'hrs',
        rate: 0,
      }]);
      return;
    }
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  const duplicateItem = (index: number) => {
    const itemToCopy = items[index];
    const copied: LineItem = {
      ...itemToCopy,
      id: `item_${Date.now()}`,
    };
    const next = [...items];
    next.splice(index + 1, 0, copied);
    onChange(next);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const next = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Products & Services ({items.length})</h3>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Line Item</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const lineTotal = calculateLineTotal(item);
          return (
            <div
              key={item.id || index}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  {/* Name and Description */}
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      placeholder="Item name / service title *"
                      className="w-full px-2.5 py-1.5 font-medium border border-slate-300 rounded text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <textarea
                      rows={1}
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      placeholder="Optional detailed description or deliverables..."
                      className="w-full px-2.5 py-1 text-[11px] text-slate-600 border border-slate-200 rounded mt-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 mb-0.5">Quantity</label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 font-mono text-center border border-slate-300 rounded text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Unit */}
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-500 mb-0.5">Unit</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(index, { unit: e.target.value })}
                      placeholder="hrs"
                      className="w-full px-1.5 py-1.5 text-center text-[11px] border border-slate-300 rounded text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Unit Rate */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-500 mb-0.5">Rate ({currency})</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.rate}
                      onChange={(e) => updateItem(index, { rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 font-mono text-right border border-slate-300 rounded text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Line Total */}
                  <div className="sm:col-span-1 text-right flex flex-col justify-end pb-1">
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="font-semibold text-slate-900 font-mono text-xs tabular-nums whitespace-nowrap">
                      {formatCurrency(lineTotal, currency)}
                    </span>
                  </div>
                </div>

                {/* Row Actions */}
                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    title="Move up"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move down"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateItem(index)}
                    title="Duplicate item"
                    className="p-1 text-slate-400 hover:text-blue-600"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    title="Remove item"
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={addItem}
          className="w-full py-2 border border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Line Item</span>
        </button>
      </div>
    </div>
  );
};
