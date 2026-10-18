import { CURRENCIES } from '../types/invoice.ts';
import type { CurrencyCode, DiscountConfig, LineItem, TaxConfig, InvoiceCalculations } from '../types/invoice.ts';

/**
 * Rounds a number to exactly specified decimals (default 2) safely.
 * Prevents floating point errors like 0.1 + 0.2 = 0.30000000000000004
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates a single line item total:
 * gross = quantity * rate
 * If line discount applies, lineDiscountAmount = gross * (discountPercent / 100)
 * lineTotal = gross - lineDiscountAmount
 */
export function calculateLineTotal(item: LineItem, decimals: number = 2): number {
  const quantity = Math.max(0, item.quantity || 0);
  const rate = Math.max(0, item.rate || 0);
  const gross = roundToDecimals(quantity * rate, decimals);
  
  if (item.discountPercent && item.discountPercent > 0) {
    const discountVal = roundToDecimals(gross * (Math.min(100, item.discountPercent) / 100), decimals);
    return roundToDecimals(gross - discountVal, decimals);
  }
  return gross;
}

/**
 * Calculate full invoice totals accurately:
 * 1. Subtotal = sum of all line item totals
 * 2. Document discount = percentage of subtotal OR fixed discount (capped at subtotal)
 * 3. Discounted subtotal = subtotal - discount
 * 4. Tax:
 *    - If tax is disabled or rate is 0: tax = 0
 *    - If tax is exclusive: tax = discountedSubtotal * (rate / 100)
 *    - If tax is inclusive: tax = discountedSubtotal - (discountedSubtotal / (1 + rate / 100))
 * 5. Grand total:
 *    - If exclusive: discountedSubtotal + tax + shippingFee
 *    - If inclusive: discountedSubtotal + shippingFee
 * 6. Balance due = grand total - amountPaid (capped at min 0 for due)
 */
export function calculateInvoiceTotals(
  items: LineItem[],
  discount: DiscountConfig,
  tax: TaxConfig,
  shippingFee: number = 0,
  amountPaid: number = 0,
  decimals: number = 2
): InvoiceCalculations {
  // 1. Subtotal
  let subtotal = 0;
  for (const item of items) {
    subtotal = roundToDecimals(subtotal + calculateLineTotal(item, decimals), decimals);
  }

  // 2. Discount
  let discountAmount = 0;
  if (discount && discount.value > 0) {
    if (discount.type === 'percentage') {
      const pct = Math.min(100, Math.max(0, discount.value));
      discountAmount = roundToDecimals(subtotal * (pct / 100), decimals);
    } else {
      discountAmount = roundToDecimals(Math.min(subtotal, Math.max(0, discount.value)), decimals);
    }
  }

  const discountedSubtotal = roundToDecimals(Math.max(0, subtotal - discountAmount), decimals);

  // 3. Tax calculation
  let taxAmount = 0;
  let taxableAmount = discountedSubtotal;

  if (tax && tax.enabled && tax.rate > 0) {
    const taxRate = Math.max(0, tax.rate);
    if (tax.isInclusive) {
      // Tax is included inside the discountedSubtotal
      // Price with tax = net * (1 + rate/100) => net = Price / (1 + rate/100)
      const netAmount = roundToDecimals(discountedSubtotal / (1 + taxRate / 100), decimals);
      taxAmount = roundToDecimals(discountedSubtotal - netAmount, decimals);
      taxableAmount = netAmount;
    } else {
      // Tax is exclusive (added on top of the discounted subtotal)
      taxAmount = roundToDecimals(discountedSubtotal * (taxRate / 100), decimals);
      taxableAmount = discountedSubtotal;
    }
  }

  // 4. Shipping Fee
  const safeShipping = roundToDecimals(Math.max(0, shippingFee || 0), decimals);

  // 5. Grand Total
  let grandTotal = 0;
  if (tax && tax.enabled && tax.isInclusive) {
    grandTotal = roundToDecimals(discountedSubtotal + safeShipping, decimals);
  } else {
    grandTotal = roundToDecimals(discountedSubtotal + taxAmount + safeShipping, decimals);
  }

  // 6. Paid & Balance Due
  const safePaid = roundToDecimals(Math.max(0, amountPaid || 0), decimals);
  const balanceDue = roundToDecimals(Math.max(0, grandTotal - safePaid), decimals);

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    taxAmount,
    taxableAmount,
    shippingFee: safeShipping,
    grandTotal,
    amountPaid: safePaid,
    balanceDue,
  };
}

/**
 * Formats a monetary number with appropriate currency symbol, decimals, and thousands separators.
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(safeAmount);

  // Format with space or standard symbol placement
  if (['PKR', 'AED', 'SAR', 'CHF'].includes(currencyCode)) {
    return `${currency.symbol} ${formattedNumber}`;
  }
  return `${currency.symbol}${formattedNumber}`;
}

/**
 * Calculates due date based on payment terms and issue date
 */
export function computeDueDate(issueDateStr: string, terms: string): string {
  if (!issueDateStr) return '';
  const date = new Date(issueDateStr);
  if (isNaN(date.getTime())) return issueDateStr;

  let daysToAdd = 0;
  switch (terms) {
    case 'due_on_receipt':
      daysToAdd = 0;
      break;
    case 'net_7':
      daysToAdd = 7;
      break;
    case 'net_15':
      daysToAdd = 15;
      break;
    case 'net_30':
      daysToAdd = 30;
      break;
    case 'net_60':
      daysToAdd = 60;
      break;
    default:
      return issueDateStr;
  }

  const result = new Date(date);
  result.setDate(result.getDate() + daysToAdd);
  return result.toISOString().split('T')[0];
}
