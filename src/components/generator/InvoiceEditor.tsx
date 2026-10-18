import React, { useState, useEffect } from 'react';
import { InvoiceData } from '../../types/invoice.ts';
import { DEFAULT_INVOICE, getSavedDrafts, getStoredInvoice, saveDraftToList, saveInvoiceToStorage, deleteDraftFromList } from '../../utils/storage.ts';
import { SenderForm } from './SenderForm.tsx';
import { ClientForm } from './ClientForm.tsx';
import { InvoiceMetaForm } from './InvoiceMetaForm.tsx';
import { LineItemsTable } from './LineItemsTable.tsx';
import { TotalsSummary } from './TotalsSummary.tsx';
import { PaymentDetailsForm } from './PaymentDetailsForm.tsx';
import { CustomizationPanel } from './CustomizationPanel.tsx';
import { InvoicePreview } from './InvoicePreview.tsx';
import { DraftsModal } from './DraftsModal.tsx';
import { downloadInvoicePdf, printInvoice } from '../../utils/pdfGenerator.ts';
import { formatCurrency, calculateInvoiceTotals } from '../../utils/calculations.ts';
import { 
  Download, 
  Printer, 
  Save, 
  FolderOpen, 
  Mail, 
  FilePlus, 
  Eye, 
  Edit3, 
  Sparkles,
  Check, 
  AlertCircle 
} from 'lucide-react';

interface InvoiceEditorProps {
  initialInvoice?: InvoiceData;
  onNavigate?: (route: string) => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ initialInvoice, onNavigate }) => {
  const [invoice, setInvoice] = useState<InvoiceData>(() => initialInvoice || getStoredInvoice());
  const [savedDrafts, setSavedDrafts] = useState<InvoiceData[]>(() => getSavedDrafts());
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview' | 'actions'>('edit');
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [customFilename, setCustomFilename] = useState(`invoice-${invoice.invoiceNumber.toLowerCase() || 'document'}.pdf`);

  // Auto-sync storage on change
  useEffect(() => {
    saveInvoiceToStorage(invoice);
    setCustomFilename(`invoice-${(invoice.invoiceNumber || 'draft').toLowerCase()}.pdf`);
  }, [invoice]);

  const handleUpdate = (updates: Partial<InvoiceData>) => {
    setInvoice(prev => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = () => {
    const updated = saveDraftToList(invoice);
    setSavedDrafts(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleStartNew = () => {
    if (confirm('Start a new invoice? Your current draft will remain saved in browser drafts.')) {
      saveDraftToList(invoice);
      const newInv: InvoiceData = {
        ...DEFAULT_INVOICE,
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      };
      setInvoice(newInv);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadInvoicePdf('invoice-preview-sheet', customFilename);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenEmailDraft = () => {
    const clientEmail = invoice.client.email || '';
    const subject = encodeURIComponent(`Invoice #${invoice.invoiceNumber} from ${invoice.sender.name || 'us'}`);
    const body = encodeURIComponent(
      `Hi ${invoice.client.name || 'there'},\n\nPlease find attached invoice #${invoice.invoiceNumber} for ${formatCurrency(
        calculateInvoiceTotals(invoice.items, invoice.discount, invoice.tax, invoice.shippingFee, invoice.amountPaid).grandTotal,
        invoice.currency
      )}.\n\nPayment is due on or before ${invoice.dueDate}.\n\nThank you for your business!\n\nBest regards,\n${invoice.sender.name}`
    );
    window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
  };

  const totals = calculateInvoiceTotals(invoice.items, invoice.discount, invoice.tax, invoice.shippingFee, invoice.amountPaid);

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* Workspace Sub-Header / Action Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Invoice Generator</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
              #{invoice.invoiceNumber}
            </span>
            {saveToast && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Draft saved locally
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5 text-slate-500" />
              <span>New</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDraftsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Drafts ({savedDrafts.length})</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Save</span>
            </button>

            <button
              type="button"
              onClick={printInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tabs */}
        <div className="lg:hidden flex border-t border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveMobileTab('edit')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
              activeMobileTab === 'edit'
                ? 'border-blue-600 text-blue-600 font-semibold bg-white'
                : 'border-transparent'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
              activeMobileTab === 'preview'
                ? 'border-blue-600 text-blue-600 font-semibold bg-white'
                : 'border-transparent'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
          <button
            onClick={() => setActiveMobileTab('actions')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
              activeMobileTab === 'actions'
                ? 'border-blue-600 text-blue-600 font-semibold bg-white'
                : 'border-transparent'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Send</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Controls (Always shown on desktop, tabbed on mobile) */}
          <div
            className={`lg:col-span-6 xl:col-span-6 space-y-6 ${
              activeMobileTab === 'edit' ? 'block' : 'hidden lg:block'
            }`}
          >
            <InvoiceMetaForm
              invoice={invoice}
              onChange={handleUpdate}
            />

            <SenderForm
              sender={invoice.sender}
              onChange={(sender) => handleUpdate({ sender })}
            />

            <ClientForm
              client={invoice.client}
              onChange={(client) => handleUpdate({ client })}
            />

            <LineItemsTable
              items={invoice.items}
              currency={invoice.currency}
              onChange={(items) => handleUpdate({ items })}
            />

            <TotalsSummary
              items={invoice.items}
              currency={invoice.currency}
              discount={invoice.discount}
              tax={invoice.tax}
              shippingFee={invoice.shippingFee}
              amountPaid={invoice.amountPaid}
              onDiscountChange={(discount) => handleUpdate({ discount })}
              onTaxChange={(tax) => handleUpdate({ tax })}
              onShippingChange={(shippingFee) => handleUpdate({ shippingFee })}
              onAmountPaidChange={(amountPaid) => handleUpdate({ amountPaid })}
            />

            <PaymentDetailsForm
              paymentDetails={invoice.paymentDetails}
              notes={invoice.notes}
              terms={invoice.terms}
              footerNote={invoice.footerNote}
              onPaymentDetailsChange={(paymentDetails) => handleUpdate({ paymentDetails })}
              onNotesChange={(notes) => handleUpdate({ notes })}
              onTermsChange={(terms) => handleUpdate({ terms })}
              onFooterNoteChange={(footerNote) => handleUpdate({ footerNote })}
            />

            <CustomizationPanel
              customization={invoice.customization}
              onChange={(customization) => handleUpdate({ customization })}
            />
          </div>

          {/* Right Column: Live Document Preview & Export Tools */}
          <div
            className={`lg:col-span-6 xl:col-span-6 lg:sticky lg:top-36 space-y-4 ${
              activeMobileTab === 'preview' || activeMobileTab === 'actions' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Quick Export & Email Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 no-print">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Balance</span>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {formatCurrency(totals.balanceDue, invoice.currency)}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Building PDF...' : 'Download PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenEmailDraft}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                    title="Open your email client with pre-filled message"
                  >
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Email Draft</span>
                  </button>
                </div>
              </div>

              {/* Custom Filename Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 shrink-0">PDF Filename:</span>
                <input
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  className="flex-1 px-2.5 py-1 border border-slate-200 rounded text-slate-700 font-mono text-[11px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Visual A4 Document Canvas */}
            <div className="max-h-[82vh] overflow-y-auto rounded-xl p-1 bg-slate-200/50">
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        </div>
      </div>

      {/* Drafts Modal */}
      <DraftsModal
        isOpen={isDraftsModalOpen}
        drafts={savedDrafts}
        onClose={() => setIsDraftsModalOpen(false)}
        onLoadDraft={(d) => setInvoice(d)}
        onDeleteDraft={(id) => {
          const updated = deleteDraftFromList(id);
          setSavedDrafts(updated);
        }}
        onDuplicateDraft={(d) => {
          const duplicated: InvoiceData = {
            ...d,
            id: `inv_${Date.now()}`,
            invoiceNumber: `${d.invoiceNumber}-COPY`,
            updatedAt: new Date().toISOString(),
          };
          const updated = saveDraftToList(duplicated);
          setSavedDrafts(updated);
        }}
        onImportJson={(imported) => {
          setInvoice(imported);
          saveDraftToList(imported);
        }}
      />
    </div>
  );
};
