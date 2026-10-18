import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  InvoiceData, 
  CustomerDetails, 
  BusinessDetails, 
  CURRENCIES, 
  CurrencyCode,
  PaymentTerms,
  TemplateId
} from '../../types/invoice.ts';
import { 
  getUserInvoices, 
  getUserDrafts, 
  getUserCustomers, 
  getBusinessProfile, 
  saveBusinessProfile, 
  saveUserCustomer, 
  deleteUserCustomer, 
  deleteUserInvoice, 
  deleteUserDraft, 
  updateUserInvoiceStatus,
  exportAllUserData,
  SavedCustomerRecord,
  UserBusinessProfile
} from '../../services/firestoreService.ts';
import { TEMPLATE_PRESETS } from '../../data/templatesData.ts';
import { formatCurrency, calculateInvoiceTotals } from '../../utils/calculations.ts';
import { downloadInvoicePdf, printInvoice } from '../../utils/pdfGenerator.ts';
import { 
  FileText, 
  PlusCircle, 
  FolderOpen, 
  Users, 
  Building2, 
  LayoutTemplate, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  LogOut, 
  Copy, 
  Save, 
  UserPlus, 
  Mail, 
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onEditInvoice: (invoice: InvoiceData) => void;
  onSelectTemplate: (templatePreset: any) => void;
  initialTab?: 'invoices' | 'drafts' | 'customers' | 'profile' | 'templates' | 'settings';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onEditInvoice,
  onSelectTemplate,
  initialTab = 'invoices',
}) => {
  const { 
    currentUser, 
    logout, 
    resendVerificationEmail, 
    updateUserDisplayName, 
    deleteUserAccount 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'invoices' | 'drafts' | 'customers' | 'profile' | 'templates' | 'settings'>(initialTab);
  
  // Data States
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [drafts, setDrafts] = useState<InvoiceData[]>([]);
  const [customers, setCustomers] = useState<SavedCustomerRecord[]>([]);
  const [businessProfile, setBusinessProfile] = useState<UserBusinessProfile>({
    businessName: '',
    email: currentUser?.email || '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    taxId: '',
    defaultCurrency: 'USD',
    defaultPaymentTerms: 'net_30',
    defaultTemplate: 'modern_minimal',
  });

  const [loadingData, setLoadingData] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Customer Modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDetails | null>(null);

  // Settings State
  const [displayNameInput, setDisplayNameInput] = useState(currentUser?.displayName || '');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Fetch all user cloud data
  const refreshData = async () => {
    if (!currentUser) return;
    setLoadingData(true);
    try {
      const [invList, draftList, custList, profile] = await Promise.all([
        getUserInvoices(currentUser.uid),
        getUserDrafts(currentUser.uid),
        getUserCustomers(currentUser.uid),
        getBusinessProfile(currentUser.uid),
      ]);
      setInvoices(invList);
      setDrafts(draftList);
      setCustomers(custList);
      if (profile) {
        setBusinessProfile(prev => ({ ...prev, ...profile }));
      }
    } catch (err) {
      console.error('Failed to load user records from Firestore:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Compute Verified KPIs from actual documents
  const totalInvoicesCount = invoices.length;
  const draftCount = drafts.length;
  const sentCount = invoices.filter(inv => inv.status === 'sent' || inv.status === 'pending').length;
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  
  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((acc, inv) => {
      const totals = calculateInvoiceTotals(inv.items, inv.discount, inv.tax, inv.shippingFee, inv.amountPaid);
      return acc + (totals.balanceDue > 0 ? totals.balanceDue : 0);
    }, 0);

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      (inv.client.companyName && inv.client.companyName.toLowerCase().includes(invoiceSearch.toLowerCase()));
    const matchesStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((cust) => {
    const q = customerSearch.toLowerCase();
    return (
      cust.name.toLowerCase().includes(q) ||
      (cust.companyName && cust.companyName.toLowerCase().includes(q)) ||
      (cust.email && cust.email.toLowerCase().includes(q))
    );
  });

  // Invoice Handlers
  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!currentUser || !confirm('Are you sure you want to delete this invoice? This cannot be undone.')) return;
    try {
      await deleteUserInvoice(currentUser.uid, invoiceId);
      setInvoices(prev => prev.filter(i => i.id !== invoiceId));
      showNotification('Invoice successfully deleted.');
    } catch (e) {
      showNotification('Failed to delete invoice.', 'error');
    }
  };

  const handleUpdateStatus = async (invoiceId: string, newStatus: InvoiceData['status']) => {
    if (!currentUser) return;
    try {
      await updateUserInvoiceStatus(currentUser.uid, invoiceId, newStatus);
      setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: newStatus } : i));
      showNotification(`Invoice status updated to ${newStatus}.`);
    } catch (e) {
      showNotification('Failed to update status.', 'error');
    }
  };

  // Draft Handlers
  const handleDeleteDraft = async (draftId: string) => {
    if (!currentUser || !confirm('Delete this draft permanently?')) return;
    try {
      await deleteUserDraft(currentUser.uid, draftId);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      showNotification('Draft deleted.');
    } catch (e) {
      showNotification('Failed to delete draft.', 'error');
    }
  };

  // Customer Handlers
  const handleSaveCustomerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingCustomer || !editingCustomer.name) return;
    try {
      await saveUserCustomer(currentUser.uid, editingCustomer, editingCustomer.id);
      setIsCustomerModalOpen(false);
      setEditingCustomer(null);
      await refreshData();
      showNotification('Customer saved successfully.');
    } catch (e) {
      showNotification('Failed to save customer.', 'error');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!currentUser || !confirm('Delete this customer from your address book?')) return;
    try {
      await deleteUserCustomer(currentUser.uid, customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      showNotification('Customer removed.');
    } catch (e) {
      showNotification('Failed to delete customer.', 'error');
    }
  };

  // Business Profile Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await saveBusinessProfile(currentUser.uid, businessProfile);
      showNotification('Business profile updated. All new invoices will automatically use these details!');
    } catch (e) {
      showNotification('Failed to save business profile.', 'error');
    }
  };

  // Export Data Handler
  const handleExportData = async () => {
    if (!currentUser) return;
    try {
      const bundle = await exportAllUserData(currentUser.uid);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `invoicecraft-data-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showNotification('Complete account archive exported as JSON.');
    } catch (e) {
      showNotification('Failed to export data.', 'error');
    }
  };

  // Account Deletion Handler
  const handleConfirmDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    try {
      await deleteUserAccount();
      onNavigate('home');
    } catch (e: any) {
      showNotification(e.message || 'Failed to delete account.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {actionMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* Top Banner / Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Account: <span className="font-mono text-white">{currentUser?.email}</span>
            {currentUser?.emailVerified ? (
              <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ✓ Verified
              </span>
            ) : (
              <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                Unverified Email
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('generator')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Invoice</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Verified KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Invoices</span>
          <div className="text-2xl font-black text-slate-900">{totalInvoicesCount}</div>
          <p className="text-[10px] text-slate-400">All saved records</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Drafts</span>
          <div className="text-2xl font-black text-blue-600">{draftCount}</div>
          <p className="text-[10px] text-slate-400">Autosaved in cloud</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sent / Pending</span>
          <div className="text-2xl font-black text-amber-600">{sentCount}</div>
          <p className="text-[10px] text-slate-400">Awaiting client payment</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Settled & Paid</span>
          <div className="text-2xl font-black text-emerald-600">{paidCount}</div>
          <p className="text-[10px] text-slate-400">Completed payments</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Outstanding</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-400">Unsettled invoice total</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'invoices', label: `My Invoices (${totalInvoicesCount})`, icon: FileText },
          { id: 'drafts', label: `My Drafts (${draftCount})`, icon: FolderOpen },
          { id: 'customers', label: `My Customers (${customers.length})`, icon: Users },
          { id: 'profile', label: 'Business Profile', icon: Building2 },
          { id: 'templates', label: 'My Templates', icon: LayoutTemplate },
          { id: 'settings', label: 'Account Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY INVOICES */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoices by number or client..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter invoices by status"
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Drafts</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 space-y-4 p-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">No invoices found</h3>
                <p className="text-xs text-slate-500">
                  {invoiceSearch || invoiceStatusFilter !== 'all'
                    ? 'Try clearing your search filters to find what you are looking for.'
                    : 'Start creating your first professional invoice. All line items, taxes, and client details will be securely saved in your account.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('generator')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Invoice Now</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Client / Recipient</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredInvoices.map((inv) => {
                      const totals = calculateInvoiceTotals(inv.items, inv.discount, inv.tax, inv.shippingFee, inv.amountPaid);
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                            #{inv.invoiceNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {inv.issueDate || '—'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {inv.client.name || 'Unnamed Client'}
                            {inv.client.companyName && (
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {inv.client.companyName}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            {formatCurrency(totals.grandTotal, inv.currency)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <select
                              aria-label={`Update status for invoice ${inv.invoiceNumber}`}
                              value={inv.status}
                              onChange={(e) => handleUpdateStatus(inv.id, e.target.value as any)}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : inv.status === 'sent'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : inv.status === 'overdue'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="draft">Draft</option>
                              <option value="sent">Sent</option>
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onEditInvoice(inv)}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit in Generator"
                                aria-label="Edit invoice"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInvoice(inv.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete invoice"
                                aria-label="Delete invoice"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY DRAFTS */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Autosaved Invoice Drafts</h2>
              <p className="text-xs text-slate-500">Drafts are debounced and synchronized across your devices in real-time.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('generator')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Draft</span>
            </button>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 space-y-3 p-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No saved drafts</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any invoice you work on is automatically saved to your cloud drafts so you never lose work.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => {
                const totals = calculateInvoiceTotals(draft.items, draft.discount, draft.tax, draft.shippingFee, draft.amountPaid);
                return (
                  <div key={draft.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          #{draft.invoiceNumber || 'DRAFT'}
                        </span>
                        <span className="text-slate-400">
                          {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {draft.client.name || 'Untitled Client'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {draft.items.length} item{draft.items.length === 1 ? '' : 's'} · Total: {formatCurrency(totals.grandTotal, draft.currency)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onEditInvoice(draft)}
                        className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Resume Editing</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, company, or email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingCustomer({
                  name: '',
                  companyName: '',
                  email: '',
                  phone: '',
                  billingAddress: '',
                  taxId: '',
                  notes: '',
                });
                setIsCustomerModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Customer</span>
            </button>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 space-y-3 p-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No customer records yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Save client contact info, addresses, and tax numbers here so they can be loaded instantly into any future invoice with one click.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-blue-200 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomer(c);
                            setIsCustomerModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {c.companyName && <p className="text-xs font-semibold text-blue-600">{c.companyName}</p>}
                    {c.email && <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {c.email}</p>}
                    {c.billingAddress && <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{c.billingAddress}</p>}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Tax ID: {c.taxId || 'N/A'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        // Open generator with this client
                        const blankWithClient: InvoiceData = {
                          id: `inv_${Date.now()}`,
                          invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                          title: 'TAX INVOICE',
                          status: 'draft',
                          issueDate: new Date().toISOString().split('T')[0],
                          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                          paymentTerms: 'net_30',
                          currency: 'USD',
                          sender: {
                            name: businessProfile.businessName || '',
                            email: businessProfile.email || '',
                            phone: businessProfile.phone || '',
                            addressLine1: businessProfile.addressLine1 || '',
                            city: businessProfile.city || '',
                            state: businessProfile.state || '',
                            country: businessProfile.country || '',
                            postalCode: businessProfile.postalCode || '',
                            taxId: businessProfile.taxId || '',
                          },
                          client: c,
                          items: [
                            { id: '1', name: 'Service', description: 'Consulting & Deliverables', quantity: 1, unit: 'hours', rate: 100 },
                          ],
                          discount: { type: 'percentage', value: 0 },
                          tax: { name: 'VAT', rate: 0, isInclusive: false, enabled: false },
                          shippingFee: 0,
                          amountPaid: 0,
                          paymentDetails: {
                            bankName: businessProfile.bankName || '',
                            accountName: businessProfile.accountName || '',
                            accountNumber: businessProfile.accountNumber || '',
                            routingNumberOrSwift: businessProfile.routingNumberOrSwift || '',
                          },
                          notes: 'Thank you for your business.',
                          terms: 'Payment due within 30 days.',
                          footerNote: 'InvoiceCraft Certified Invoice',
                          customization: {
                            templateId: (businessProfile.defaultTemplate as TemplateId) || 'modern_minimal',
                            accentColor: '#2563eb',
                            fontFamily: 'Inter',
                            logoSize: 'medium',
                            logoPosition: 'left',
                            showWatermark: false,
                          },
                          updatedAt: new Date().toISOString(),
                        };
                        onEditInvoice(blankWithClient);
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Bill Customer →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY BUSINESS PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 max-w-4xl">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Business Identity &amp; Default Settings</h2>
            <p className="text-xs text-slate-500 mt-1">
              Save your company branding once. Every new invoice will automatically populate with your company details, payment instructions, and template style.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessProfile.businessName || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })}
                  placeholder="e.g. Acme Creative Agency"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Email Address</label>
                <input
                  type="email"
                  value={businessProfile.email || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, email: e.target.value })}
                  placeholder="billing@acmeagency.com"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={businessProfile.phone || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, phone: e.target.value })}
                  placeholder="+1 (555) 234-5678"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tax ID / VAT / GST / EIN</label>
                <input
                  type="text"
                  value={businessProfile.taxId || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, taxId: e.target.value })}
                  placeholder="US12-3456789 or GB999 9999 73"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={businessProfile.addressLine1 || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, addressLine1: e.target.value })}
                  placeholder="100 Innovation Way, Suite 400"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={businessProfile.city || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, city: e.target.value })}
                  placeholder="San Francisco"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={businessProfile.country || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, country: e.target.value })}
                  placeholder="United States"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Currency</label>
                <select
                  value={businessProfile.defaultCurrency || 'USD'}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, defaultCurrency: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Payment Terms</label>
                <select
                  value={businessProfile.defaultPaymentTerms || 'net_30'}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, defaultPaymentTerms: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_7">Net 7 Days</option>
                  <option value="net_15">Net 15 Days</option>
                  <option value="net_30">Net 30 Days</option>
                  <option value="net_60">Net 60 Days</option>
                </select>
              </div>
            </div>

            {/* Banking Details */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Default Banking &amp; Remittance Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={businessProfile.bankName || ''}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, bankName: e.target.value })}
                    placeholder="Silicon Valley Bank / Chase"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={businessProfile.accountName || ''}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, accountName: e.target.value })}
                    placeholder="Acme Agency LLC"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account / IBAN Number</label>
                  <input
                    type="text"
                    value={businessProfile.accountNumber || ''}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, accountNumber: e.target.value })}
                    placeholder="1234 5678 9012"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SWIFT / BIC / Routing</label>
                  <input
                    type="text"
                    value={businessProfile.routingNumberOrSwift || ''}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, routingNumberOrSwift: e.target.value })}
                    placeholder="CHASUS33 / 121000358"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: MY TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Ready-To-Use Invoice Templates</h2>
            <p className="text-xs text-slate-500">Select any template design to create an invoice preloaded with that styling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATE_PRESETS.map((tpl) => (
              <div key={tpl.id} className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                  <div className="w-full max-w-[200px] bg-white rounded p-3 shadow-xs border border-slate-200 space-y-2 text-[8px]">
                    <div className="flex justify-between items-center border-b pb-1 border-slate-100">
                      <span className="font-bold" style={{ color: tpl.accentColor }}>{tpl.name}</span>
                      <span className="text-slate-400">#001</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded w-3/4" />
                    <div className="h-1 bg-slate-100 rounded w-1/2" />
                    <div className="text-right font-mono font-bold pt-1" style={{ color: tpl.accentColor }}>
                      $2,450.00
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold uppercase" style={{ color: tpl.accentColor }}>
                    {tpl.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{tpl.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{tpl.description}</p>
                  
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Create with This Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ACCOUNT SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-8 max-w-3xl">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Account &amp; Security Settings</h2>
            <p className="text-xs text-slate-500 mt-1">Manage your identity, security verification, data privacy, and erasure rights.</p>
          </div>

          {/* Profile Name update */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account Display Name</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                placeholder="Your Display Name"
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={async () => {
                  if (displayNameInput.trim()) {
                    await updateUserDisplayName(displayNameInput);
                    showNotification('Display name updated.');
                  }
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Update Name
              </button>
            </div>
          </div>

          {/* Email Verification */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email Verification Status</h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-slate-800">
                  {currentUser?.email}
                </p>
                <p className="text-slate-500 mt-0.5">
                  {currentUser?.emailVerified 
                    ? 'Your email address is verified with Firebase Authentication.' 
                    : 'Your email address has not been verified yet.'}
                </p>
              </div>
              {!currentUser?.emailVerified && (
                <button
                  type="button"
                  onClick={async () => {
                    await resendVerificationEmail();
                    setVerificationSent(true);
                    showNotification('Verification email sent to your inbox.');
                  }}
                  disabled={verificationSent}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 disabled:opacity-50"
                >
                  {verificationSent ? 'Verification Sent!' : 'Send Verification Link'}
                </button>
              )}
            </div>
          </div>

          {/* GDPR / Privacy Export */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Data Privacy &amp; Portability</h3>
            <p className="text-xs text-slate-500">
              Under GDPR and privacy regulations, you have the right to download a complete copy of all your commercial records, customer details, invoices, and drafts at any time.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export All Account Data (JSON)</span>
            </button>
          </div>

          {/* Dangerous Zone / Account Deletion */}
          <div className="pt-4 border-t border-red-100 space-y-3">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider">Danger Zone — Right to Erasure</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Permanently delete your account. This action removes your user profile from Firebase Authentication and completely erases all your private Firestore invoices, drafts, customer databases, and business settings. <strong>This action cannot be undone.</strong>
            </p>

            {!isDeletingAccount ? (
              <button
                type="button"
                onClick={() => setIsDeletingAccount(true)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Initiate Account &amp; Data Deletion...
              </button>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3 max-w-md animate-in fade-in">
                <p className="text-xs font-bold text-red-900">
                  Please type <span className="font-mono bg-red-100 px-1 rounded">DELETE</span> to confirm permanent erasure:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full text-xs p-2 bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE'}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-40 transition-colors"
                  >
                    Permanently Delete Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeletingAccount(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isCustomerModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {editingCustomer.id ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomerForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Contact Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  placeholder="e.g. John Doe or Jane Smith"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={editingCustomer.companyName || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, companyName: e.target.value })}
                  placeholder="e.g. Global Tech Partners Inc."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    placeholder="client@company.com"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="+1 555-0192"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Billing Address</label>
                <textarea
                  rows={2}
                  value={editingCustomer.billingAddress || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, billingAddress: e.target.value })}
                  placeholder="Street, City, State, ZIP, Country"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tax ID / VAT Number</label>
                <input
                  type="text"
                  value={editingCustomer.taxId || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, taxId: e.target.value })}
                  placeholder="Client VAT or EIN number"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomerModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
