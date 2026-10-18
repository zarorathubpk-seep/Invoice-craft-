export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'AED' | 'SAR' | 'CAD' | 'AUD' | 'INR' | 'JPY' | 'SGD' | 'CHF';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  PKR: { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee', decimals: 2 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimals: 2 },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  SGD: { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
};

export type PaymentTerms = 'due_on_receipt' | 'net_7' | 'net_15' | 'net_30' | 'net_60' | 'custom';

export type TemplateId = 
  | 'classic'
  | 'modern_minimal'
  | 'elegant_blue'
  | 'executive_navy'
  | 'clean_corporate'
  | 'creative_freelancer';

export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string; // e.g. "hours", "items", "units", "days"
  rate: number;
  discountPercent?: number; // optional line discount %
  taxPercent?: number; // optional line tax %
}

export interface BusinessDetails {
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  website?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxId?: string; // VAT/GST/EIN
  customFields?: { label: string; value: string }[];
}

export interface CustomerDetails {
  id?: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  billingAddress: string;
  shippingAddress?: string;
  taxId?: string;
  notes?: string;
}

export interface DiscountConfig {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface TaxConfig {
  name: string; // e.g., "VAT", "GST", "Sales Tax"
  rate: number; // percentage, e.g., 5 or 20
  isInclusive: boolean; // false = exclusive (added on top), true = inclusive
  enabled: boolean;
}

export interface PaymentInstructions {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumberOrSwift?: string;
  paypalEmail?: string;
  paymentReference?: string;
  customNotes?: string;
}

export interface InvoiceCustomization {
  templateId: TemplateId;
  accentColor: string;
  fontFamily: string;
  logoSize: 'small' | 'medium' | 'large';
  logoPosition: 'left' | 'right' | 'center';
  showWatermark: boolean;
  watermarkText?: string;
  signatureUrl?: string;
  signatureName?: string;
  signatureDate?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  title: string;
  status: 'draft' | 'pending' | 'sent' | 'paid' | 'overdue';
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  paymentTerms: PaymentTerms;
  purchaseOrderRef?: string;
  projectRef?: string;
  currency: CurrencyCode;
  
  sender: BusinessDetails;
  client: CustomerDetails;
  
  items: LineItem[];
  
  discount: DiscountConfig;
  tax: TaxConfig;
  shippingFee: number;
  amountPaid: number;
  
  paymentDetails: PaymentInstructions;
  notes: string;
  terms: string;
  footerNote: string;
  
  customization: InvoiceCustomization;
  updatedAt: string;
}

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  discountedSubtotal: number;
  taxAmount: number;
  taxableAmount: number;
  shippingFee: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
}

export interface QuotationData extends Omit<InvoiceData, 'status' | 'invoiceNumber'> {
  invoiceNumber?: string;
  quotationNumber: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'converted';
}

export interface ReceiptData {
  id: string;
  receiptNumber: string;
  invoiceRef?: string;
  paymentDate: string;
  amountReceived: number;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'PayPal' | 'Cash' | 'Cheque' | 'Other';
  currency: CurrencyCode;
  sender: BusinessDetails;
  client: CustomerDetails;
  notes?: string;
}

export interface CreditNoteData {
  id: string;
  creditNoteNumber: string;
  originalInvoiceNumber: string;
  issueDate: string;
  reason: string;
  currency: CurrencyCode;
  sender: BusinessDetails;
  client: CustomerDetails;
  items: LineItem[];
  tax: TaxConfig;
  customization: InvoiceCustomization;
  notes?: string;
}

export interface BusinessExpense {
  id: string;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  currency: CurrencyCode;
  taxDeductible: boolean;
  notes?: string;
}
