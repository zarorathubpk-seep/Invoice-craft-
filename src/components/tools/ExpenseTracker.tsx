import React, { useState, useEffect, useRef } from 'react';
import { BusinessExpense } from '../../types/invoice.ts';
import { getExpenses, saveExpenses } from '../../utils/storage.ts';
import { formatCurrency } from '../../utils/calculations.ts';
import { Wallet, Plus, Trash2, Download, Upload, Search, Filter, AlertCircle } from 'lucide-react';

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<BusinessExpense[]>(() => getExpenses());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New expense form state
  const [newExp, setNewExp] = useState<Omit<BusinessExpense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Software & Subscriptions',
    vendor: '',
    amount: 0,
    currency: 'USD',
    taxDeductible: true,
    notes: '',
  });

  const categories = [
    'All',
    'Software & Subscriptions',
    'Hosting & Domains',
    'Office Supplies',
    'Contractor & Freelancer',
    'Marketing & Advertising',
    'Travel & Transportation',
    'Meals & Entertainment',
    'Utilities & Phone',
    'Legal & Accounting',
    'Other',
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.vendor || newExp.amount <= 0) {
      alert('Please enter a valid vendor name and positive amount.');
      return;
    }
    const created: BusinessExpense = {
      ...newExp,
      id: `exp_${Date.now()}`,
    };
    const updated = [created, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    setIsAdding(false);
    setNewExp({
      date: new Date().toISOString().split('T')[0],
      category: 'Software & Subscriptions',
      vendor: '',
      amount: 0,
      currency: 'USD',
      taxDeductible: true,
      notes: '',
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Delete this expense entry?')) {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      saveExpenses(updated);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL recorded expenses? This cannot be undone.')) {
      setExpenses([]);
      saveExpenses([]);
    }
  };

  const handleExportCsv = () => {
    if (expenses.length === 0) {
      alert('No expenses to export.');
      return;
    }
    const headers = ['Date', 'Vendor', 'Category', 'Amount', 'Currency', 'TaxDeductible', 'Notes'];
    const rows = expenses.map(e => [
      e.date,
      `"${e.vendor.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      e.amount,
      e.currency,
      e.taxDeductible ? 'Yes' : 'No',
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `invoicecraft-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        if (lines.length <= 1) return;

        const imported: BusinessExpense[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length >= 4) {
            imported.push({
              id: `exp_${Date.now()}_${i}`,
              date: parts[0]?.trim() || new Date().toISOString().split('T')[0],
              vendor: parts[1]?.replace(/"/g, '').trim() || 'Vendor',
              category: parts[2]?.replace(/"/g, '').trim() || 'Other',
              amount: parseFloat(parts[3]) || 0,
              currency: 'USD',
              taxDeductible: parts[5]?.includes('Yes') ?? true,
              notes: parts[6]?.replace(/"/g, '').trim() || '',
            });
          }
        }
        if (imported.length > 0) {
          const merged = [...imported, ...expenses];
          setExpenses(merged);
          saveExpenses(merged);
          alert(`Imported ${imported.length} expenses successfully!`);
        }
      } catch (err) {
        alert('Could not parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered expenses
  const filtered = expenses.filter(e => {
    const matchesSearch = e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Analytics
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const deductibleAmount = expenses.filter(e => e.taxDeductible).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <Wallet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Business Expense Tracker</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track business deductions and operating costs. 100% private in browser storage. CSV export and import.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Total Tracked Expenses</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(totalAmount, 'USD')}
          </p>
          <span className="text-[11px] text-slate-400">{expenses.length} total entries</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-700 font-semibold">Tax Deductible Expenses</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {formatCurrency(deductibleAmount, 'USD')}
          </p>
          <span className="text-[11px] text-slate-400">Potential tax write-offs</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Average Expense Cost</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(expenses.length > 0 ? totalAmount / expenses.length : 0, 'USD')}
          </p>
          <span className="text-[11px] text-slate-400">Per transaction</span>
        </div>
      </div>

      {/* Add expense form modal/drawer */}
      {isAdding && (
        <form onSubmit={handleAddExpense} className="bg-white p-5 rounded-xl border border-blue-200 shadow-md space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900">Record New Expense</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Date</label>
              <input
                type="date"
                required
                value={newExp.date}
                onChange={(e) => setNewExp({ ...newExp, date: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Vendor / Payee</label>
              <input
                type="text"
                required
                value={newExp.vendor}
                onChange={(e) => setNewExp({ ...newExp, vendor: e.target.value })}
                placeholder="e.g. AWS, Adobe, Office Depot"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Category</label>
              <select
                value={newExp.category}
                onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Amount ($)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={newExp.amount || ''}
                onChange={(e) => setNewExp({ ...newExp, amount: parseFloat(e.target.value) || 0 })}
                placeholder="49.99"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-600 mb-1">Notes / Business Purpose</label>
              <input
                type="text"
                value={newExp.notes || ''}
                onChange={(e) => setNewExp({ ...newExp, notes: e.target.value })}
                placeholder="Quarterly design license"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={newExp.taxDeductible}
                  onChange={(e) => setNewExp({ ...newExp, taxDeductible: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-700 font-medium">Tax Deductible</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vendor or notes..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {expenses.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 hover:underline text-[11px] shrink-0"
          >
            Clear Stored Expenses
          </button>
        )}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                <th scope="col" className="py-3 px-4 font-semibold">Date</th>
                <th scope="col" className="py-3 px-4 font-semibold">Vendor / Payee</th>
                <th scope="col" className="py-3 px-4 font-semibold">Category</th>
                <th scope="col" className="py-3 px-4 font-semibold text-center">Tax Deductible</th>
                <th scope="col" className="py-3 px-4 font-semibold">Notes</th>
                <th scope="col" className="py-3 px-4 font-semibold text-right">Amount</th>
                <th scope="col" className="py-3 px-4 font-semibold text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No matching expenses found.
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">{exp.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{exp.vendor}</td>
                    <td className="py-3 px-4 text-slate-600">{exp.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                        exp.taxDeductible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {exp.taxDeductible ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{exp.notes || '-'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(exp.amount, exp.currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
