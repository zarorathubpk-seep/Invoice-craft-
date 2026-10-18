import React, { useRef } from 'react';
import { InvoiceData } from '../../types/invoice.ts';
import { X, FileText, Download, Upload, Trash2, Copy, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations.ts';

interface DraftsModalProps {
  isOpen: boolean;
  drafts: InvoiceData[];
  onClose: () => void;
  onLoadDraft: (draft: InvoiceData) => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (draft: InvoiceData) => void;
  onImportJson: (data: InvoiceData) => void;
}

export const DraftsModal: React.FC<DraftsModalProps> = ({
  isOpen,
  drafts,
  onClose,
  onLoadDraft,
  onDeleteDraft,
  onDuplicateDraft,
  onImportJson,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.invoiceNumber && parsed.items) {
            onImportJson(parsed);
            alert('Invoice imported successfully!');
            onClose();
          } else {
            alert('Invalid InvoiceCraft JSON format.');
          }
        } catch (err) {
          alert('Could not parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportJson = (draft: InvoiceData) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draft, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${draft.invoiceNumber || 'invoice'}-backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Saved Invoice Drafts ({drafts.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <p className="text-xs text-slate-500">
              Drafts are securely stored in your browser&apos;s localStorage and never transmitted to our servers.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {drafts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-medium text-slate-600">No saved drafts found</p>
              <p className="text-xs text-slate-400 mt-1">
                Click &apos;Save Draft&apos; on the editor toolbar to store your current invoice locally.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => {
                const total = draft.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
                return (
                  <div
                    key={draft.id}
                    className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          #{draft.invoiceNumber || 'Draft'}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs font-medium text-slate-700">
                          {draft.client.name || draft.client.companyName || 'No Client Specified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Items: {draft.items.length}</span>
                        <span>·</span>
                        <span>Total: <strong className="text-slate-800">{formatCurrency(total, draft.currency)}</strong></span>
                        <span>·</span>
                        <span>Updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadDraft(draft);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Load Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportJson(draft)}
                        title="Download JSON backup"
                        className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white rounded border border-slate-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateDraft(draft)}
                        title="Duplicate draft"
                        className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white rounded border border-slate-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDraft(draft.id)}
                        title="Delete draft"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
