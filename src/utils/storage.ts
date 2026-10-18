import { InvoiceData, CustomerDetails, BusinessExpense, TemplateId, QuotationData, ReceiptData, CreditNoteData } from '../types/invoice.ts';

const INVOICE_STORAGE_KEY = 'invoicecraft_current_invoice';
const DRAFTS_STORAGE_KEY = 'invoicecraft_saved_drafts';
const SAVED_CLIENTS_KEY = 'invoicecraft_saved_clients';
const EXPENSES_STORAGE_KEY = 'invoicecraft_expenses';

export const DEFAULT_BUSINESS: InvoiceData['sender'] = {
  name: 'Studio North Creative',
  email: 'billing@studionorth.example',
  phone: '+1 (555) 234-5678',
  website: 'www.studionorth.example',
  addressLine1: '742 Evergreen Terrace, Suite 300',
  city: 'Portland',
  state: 'OR',
  country: 'United States',
  postalCode: '97201',
  taxId: 'US-EIN-98-7654321',
};

export const DEFAULT_CLIENT: CustomerDetails = {
  name: 'Elena Rostova',
  companyName: 'Apex Dynamics LLC',
  email: 'finance@apexdynamics.example',
  phone: '+1 (555) 876-5432',
  billingAddress: '100 Montgomery Street, Floor 18\nSan Francisco, CA 94104\nUnited States',
  taxId: 'CA-94104-5829',
};

export const DEFAULT_INVOICE: InvoiceData = {
  id: 'inv_default_001',
  invoiceNumber: 'INV-2026-001',
  title: 'Tax Invoice',
  status: 'pending',
  issueDate: '2026-10-17',
  dueDate: '2026-11-16',
  paymentTerms: 'net_30',
  purchaseOrderRef: 'PO-98214',
  projectRef: 'Brand Identity & Web Portal',
  currency: 'USD',
  sender: DEFAULT_BUSINESS,
  client: DEFAULT_CLIENT,
  items: [
    {
      id: 'item_1',
      name: 'Design System & Brand Architecture',
      description: 'Comprehensive design tokens, typography scale, icon suite, and component guidelines.',
      quantity: 1,
      unit: 'project',
      rate: 1850.00,
    },
    {
      id: 'item_2',
      name: 'Frontend Web Portal Development',
      description: 'Responsive React and TypeScript user dashboard with modular components and accessibility compliance.',
      quantity: 40,
      unit: 'hours',
      rate: 125.00,
      discountPercent: 5,
    },
    {
      id: 'item_3',
      name: 'Performance Optimization & QA Testing',
      description: 'Cross-browser verification, responsive layout audit, and Core Web Vitals optimization.',
      quantity: 8,
      unit: 'hours',
      rate: 110.00,
    },
  ],
  discount: {
    type: 'percentage',
    value: 5,
  },
  tax: {
    name: 'Sales Tax',
    rate: 8.5,
    isInclusive: false,
    enabled: true,
  },
  shippingFee: 0,
  amountPaid: 1000.00,
  paymentDetails: {
    bankName: 'Pacific Commerce Bank',
    accountName: 'Studio North Creative LLC',
    accountNumber: '•••••••• 4892',
    routingNumberOrSwift: 'PCBXUS33',
    paypalEmail: 'payments@studionorth.example',
    paymentReference: 'INV-2026-001',
    customNotes: 'Please include the invoice reference number with your bank wire or electronic payment.',
  },
  notes: 'Thank you for your business! We appreciate your partnership and look forward to collaborating on upcoming milestones.',
  terms: 'Payment is due within 30 days of invoice issue date. Electronic transfers or ACH preferred. Unpaid balances beyond 45 days may incur standard commercial service interruptions.',
  footerNote: 'InvoiceCraft Verified Free Generator · No Personal Data Transmitted to External Servers',
  customization: {
    templateId: 'modern_minimal',
    accentColor: '#2563EB',
    fontFamily: 'Plus Jakarta Sans',
    logoSize: 'medium',
    logoPosition: 'left',
    showWatermark: false,
    watermarkText: 'DRAFT',
    signatureName: 'Marcus Vance',
    signatureDate: '2026-10-17',
  },
  updatedAt: new Date().toISOString(),
};

/**
 * Local Storage Operations
 */
export function getStoredInvoice(): InvoiceData {
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read invoice from localStorage', err);
  }
  return DEFAULT_INVOICE;
}

export function saveInvoiceToStorage(invoice: InvoiceData): void {
  try {
    invoice.updatedAt = new Date().toISOString();
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoice));
  } catch (err) {
    console.warn('Could not save invoice to localStorage', err);
  }
}

export function getSavedDrafts(): InvoiceData[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read drafts', err);
  }
  return [];
}

export function saveDraftToList(invoice: InvoiceData): InvoiceData[] {
  try {
    const drafts = getSavedDrafts();
    const existingIndex = drafts.findIndex(d => d.id === invoice.id || d.invoiceNumber === invoice.invoiceNumber);
    const updatedInvoice = { ...invoice, updatedAt: new Date().toISOString() };
    
    let nextDrafts: InvoiceData[];
    if (existingIndex >= 0) {
      nextDrafts = [...drafts];
      nextDrafts[existingIndex] = updatedInvoice;
    } else {
      nextDrafts = [updatedInvoice, ...drafts];
    }
    
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(nextDrafts));
    return nextDrafts;
  } catch (err) {
    console.warn('Could not save draft', err);
    return getSavedDrafts();
  }
}

export function deleteDraftFromList(id: string): InvoiceData[] {
  try {
    const drafts = getSavedDrafts().filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    return drafts;
  } catch (err) {
    console.warn('Could not delete draft', err);
    return [];
  }
}

export function getSavedClients(): CustomerDetails[] {
  try {
    const raw = localStorage.getItem(SAVED_CLIENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read saved clients', err);
  }
  return [DEFAULT_CLIENT];
}

export function saveClient(client: CustomerDetails): CustomerDetails[] {
  try {
    const clients = getSavedClients();
    const existing = clients.findIndex(c => c.name.toLowerCase() === client.name.toLowerCase());
    let next: CustomerDetails[];
    if (existing >= 0) {
      next = [...clients];
      next[existing] = client;
    } else {
      next = [client, ...clients];
    }
    localStorage.setItem(SAVED_CLIENTS_KEY, JSON.stringify(next));
    return next;
  } catch (err) {
    console.warn('Could not save client', err);
    return getSavedClients();
  }
}

export function getExpenses(): BusinessExpense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read expenses', err);
  }
  return [
    {
      id: 'exp_1',
      date: '2026-10-02',
      category: 'Software & Subscriptions',
      vendor: 'Figma Inc.',
      amount: 45.00,
      currency: 'USD',
      taxDeductible: true,
      notes: 'Monthly design suite subscription',
    },
    {
      id: 'exp_2',
      date: '2026-10-05',
      category: 'Hosting & Domains',
      vendor: 'Cloudflare',
      amount: 20.00,
      currency: 'USD',
      taxDeductible: true,
      notes: 'DNS & SSL performance plan',
    },
    {
      id: 'exp_3',
      date: '2026-10-12',
      category: 'Office Supplies',
      vendor: 'Staples',
      amount: 68.50,
      currency: 'USD',
      taxDeductible: true,
      notes: 'Recycled printer paper & supplies',
    },
  ];
}

export function saveExpenses(expenses: BusinessExpense[]): void {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.warn('Could not save expenses', err);
  }
}

export function clearAllUserData(): void {
  localStorage.removeItem(INVOICE_STORAGE_KEY);
  localStorage.removeItem(DRAFTS_STORAGE_KEY);
  localStorage.removeItem(SAVED_CLIENTS_KEY);
  localStorage.removeItem(EXPENSES_STORAGE_KEY);
}
