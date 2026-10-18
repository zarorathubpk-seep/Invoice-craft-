import React, { useState, useEffect, useRef } from 'react';
import { InvoiceData, CustomerDetails } from '../../types/invoice.ts';
import { DEFAULT_INVOICE, getSavedDrafts, getStoredInvoice, saveDraftToList, saveInvoiceToStorage } from '../../utils/storage.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  saveUserDraft, 
  saveUserInvoice, 
  getUserDrafts, 
  getUserCustomers, 
  saveUserCustomer, 
  getBusinessProfile,
  SavedCustomerRecord 
} from '../../services/firestoreService.ts';
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
  AlertCircle,
  Cloud,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface InvoiceEditorProps {
  initialInvoice?: InvoiceData;
  onNavigate?: (route: string) => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ initialInvoice, onNavigate }) => {
  const { currentUser } = useAuth();

  const [invoice, setInvoice] = useState<InvoiceData>(() => initialInvoice || getStoredInvoice());
  const [savedDrafts, setSavedDrafts] = useState<InvoiceData[]>(() => getSavedDrafts());
  const [cloudCustomers, setCloudCustomers] = useState<SavedCustomerRecord[]>([]);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview' | 'actions'>('edit');
  const [isDownloading, setIsDownloading] = useState(false);
  const [customFilename, setCustomFilename] = useState(`invoice-${invoice.invoiceNumber.toLowerCase() || 'document'}.pdf`);

  // Cloud Sync State: 'saved' | 'saving' | 'offline' | 'error'
  const [syncState, setSyncState] = useState<'saved' | 'saving' | 'offline' | 'error'>('saved');
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load user business profile if this is a fresh invoice
  useEffect(() => {
    if (!currentUser) return;

    const loadUserData = async () => {
      try {
        const [profile, customers, drafts] = await Promise.all([
          getBusinessProfile(currentUser.uid),
          getUserCustomers(currentUser.uid),
          getUserDrafts(currentUser.uid),
        ]);

        if (customers) setCloudCustomers(customers);
        if (drafts && drafts.length > 0) setSavedDrafts(drafts);

        // If newly generated invoice without sender info, prefill from profile
        if (profile && (!initialInvoice || !invoice.sender.name)) {
          setInvoice(prev => ({
            ...prev,
            currency: (profile.defaultCurrency as any) || prev.currency,
            paymentTerms: (profile.defaultPaymentTerms as any) || prev.paymentTerms,
            sender: {
              ...prev.sender,
              name: profile.businessName || prev.sender.name,
              email: profile.email || prev.sender.email,
              phone: profile.phone || prev.sender.phone,
              addressLine1: profile.addressLine1 || prev.sender.addressLine1,
              city: profile.city || prev.sender.city,
              state: profile.state || prev.sender.state,
              country: profile.country || prev.sender.country,
              postalCode: profile.postalCode || prev.sender.postalCode,
              taxId: profile.taxId || prev.sender.taxId,
              logoUrl: profile.logoUrl || prev.sender.logoUrl,
            },
            paymentDetails: {
              ...prev.paymentDetails,
              bankName: profile.bankName || prev.paymentDetails.bankName,
              accountName: profile.accountName || prev.paymentDetails.accountName,
              accountNumber: profile.accountNumber || prev.paymentDetails.accountNumber,
              routingNumberOrSwift: profile.routingNumberOrSwift || prev.paymentDetails.routingNumberOrSwift,
              customNotes: profile.paymentInstructions || prev.paymentDetails.customNotes,
            },
          }));
        }
      } catch (err) {
        console.warn('Could not auto-populate profile in editor:', err);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Debounced Autosave (1500ms)
  useEffect(() => {
    saveInvoiceToStorage(invoice);
    setCustomFilename(`invoice-${(invoice.invoiceNumber || 'draft').toLowerCase()}.pdf`);

    if (!currentUser) {
      setSyncState('offline');
      return;
    }

    setSyncState('saving');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        await saveUserDraft(currentUser.uid, invoice);
        setSyncState('saved');
      } catch (e) {
        console.warn('Cloud autosave failed, saved locally:', e);
        setSyncState('error');
      }
    }, 1500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [invoice, currentUser]);

  const handleUpdate = (updates: Partial<InvoiceData>) => {
    setInvoice(prev => ({ ...prev, ...updates }));
  };

  const handleManualSave = async () => {
    if (currentUser) {
      setSyncState('saving');
      try {
        await saveUserInvoice(currentUser.uid, invoice);
        await saveUserDraft(currentUser.uid, invoice);
        setSyncState('saved');
        setSavedNotification('Invoice saved to your cloud dashboard!');
        setTimeout(() => setSavedNotification(null), 3000);
      } catch (e) {
        setSyncState('error');
        setSavedNotification('Error saving to cloud. Saved in local storage.');
        setTimeout(() => setSavedNotification(null), 3000);
      }
    } else {
      const updated = saveDraftToList(invoice);
      setSavedDrafts(updated);
      setSavedNotification('Draft saved locally.');
      setTimeout(() => setSavedNotification(null), 2500);
    }
  };

  const handleSaveCustomerToCloud = async (customer: CustomerDetails) => {
    if (!currentUser) return;
    try {
      await saveUserCustomer(currentUser.uid, customer);
      const updated = await getUserCustomers(currentUser.uid);
      setCloudCustomers(updated);
    } catch (e) {
      console.warn('Failed to save customer to cloud:', e);
    }
  };

  const handleStartNew = () => {
    if (confirm('Start a new invoice? Your current draft is preserved in your drafts.')) {
      if (currentUser) {
        saveUserDraft(currentUser.uid, invoice);
      } else {
        saveDraftToList(invoice);
      }
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

            {/* Cloud Sync Indicator */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                {syncState === 'saving' && (
                  <span className="text-blue-600 flex items-center gap-1 animate-pulse">
                    <Cloud className="w-3.5 h-3.5" /> Saving draft...
                  </span>
                )}
                {syncState === 'saved' && (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cloud Synced
                  </span>
                )}
                {syncState === 'error' && (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Saved locally
                  </span>
                )}
              </div>
            ) : (
              <span className="hidden sm:inline text-xs text-slate-400">
                (Guest Mode - Saved in browser)
              </span>
            )}

            {savedNotification && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> {savedNotification}
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

            {currentUser && onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Dashboard</span>
              </button>
            )}

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
              onClick={handleManualSave}
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
          {/* Left Column: Editor Controls */}
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
              cloudCustomers={cloudCustomers}
              onSaveCustomerToCloud={handleSaveCustomerToCloud}
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

          {/* Right Column: Sticky Live PDF-Accurate Preview */}
          <div
            className={`lg:col-span-6 xl:col-span-6 lg:sticky lg:top-32 space-y-4 ${
              activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                Document Preview (Exact A4 Aspect)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenEmailDraft}
                  className="px-2.5 py-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded font-medium flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draft Client Email</span>
                </button>
                <button
                  type="button"
                  onClick={printInvoice}
                  className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-medium flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <InvoicePreview invoice={invoice} />
          </div>

          {/* Mobile Actions Tab */}
          <div
            className={`space-y-4 ${
              activeMobileTab === 'actions' ? 'block lg:hidden' : 'hidden'
            }`}
          >
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 text-center">
              <h3 className="font-bold text-base text-slate-900">Export &amp; Share Document</h3>
              <p className="text-xs text-slate-500">
                Download your completed invoice as an A4 PDF document or print directly from your browser.
              </p>
              
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Invoice'}</span>
                </button>

                <button
                  type="button"
                  onClick={printInvoice}
                  className="w-full py-3 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenEmailDraft}
                  className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email to Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Drafts Modal */}
      <DraftsModal
        isOpen={isDraftsModalOpen}
        drafts={savedDrafts}
        onLoadDraft={(draft: InvoiceData) => {
          setInvoice(draft);
          setIsDraftsModalOpen(false);
        }}
        onDeleteDraft={(id: string) => {
          setSavedDrafts(prev => prev.filter(d => d.id !== id));
        }}
        onDuplicateDraft={(draft: InvoiceData) => {
          const duplicated: InvoiceData = {
            ...draft,
            id: `inv_${Date.now()}`,
            invoiceNumber: `${draft.invoiceNumber}-COPY`,
          };
          setInvoice(duplicated);
          setIsDraftsModalOpen(false);
        }}
        onImportJson={(imported: InvoiceData) => {
          setInvoice(imported);
          setIsDraftsModalOpen(false);
        }}
        onClose={() => setIsDraftsModalOpen(false)}
      />
    </div>
  );
};
