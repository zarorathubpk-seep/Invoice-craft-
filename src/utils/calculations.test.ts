import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInvoiceTotals, calculateLineTotal, roundToDecimals, formatCurrency, computeDueDate } from './calculations.ts';
import type { LineItem, DiscountConfig, TaxConfig } from '../types/invoice.ts';

test('roundToDecimals rounds correctly without floating-point errors', () => {
  assert.equal(roundToDecimals(0.1 + 0.2, 2), 0.3);
  assert.equal(roundToDecimals(10.555, 2), 10.56);
  assert.equal(roundToDecimals(10.554, 2), 10.55);
});

test('calculateLineTotal handles quantity, rate, and line discounts', () => {
  const item1: LineItem = {
    id: '1',
    name: 'Website Design',
    description: 'Custom UI design',
    quantity: 2,
    unit: 'hours',
    rate: 150,
  };
  assert.equal(calculateLineTotal(item1), 300);

  const itemWithDiscount: LineItem = {
    id: '2',
    name: 'Logo Design',
    description: 'Brand identity',
    quantity: 1,
    unit: 'project',
    rate: 200,
    discountPercent: 10,
  };
  assert.equal(calculateLineTotal(itemWithDiscount), 180);
});

test('Part 13 benchmark test case from specification', () => {
  // Test from prompt requirements:
  // - 2 items at $125 each ($250)
  // - 1 item at $50 ($50)
  // - 10% document discount (-$30 => discounted subtotal $270)
  // - 5% tax on the discounted subtotal ($13.50)
  // - $10 shipping excluded from the tax base
  // Expected total: $293.50
  const items: LineItem[] = [
    { id: '1', name: 'Item A', description: '', quantity: 2, unit: 'units', rate: 125 },
    { id: '2', name: 'Item B', description: '', quantity: 1, unit: 'units', rate: 50 },
  ];

  const discount: DiscountConfig = {
    type: 'percentage',
    value: 10,
  };

  const tax: TaxConfig = {
    name: 'Sales Tax',
    rate: 5,
    isInclusive: false,
    enabled: true,
  };

  const shipping = 10;
  const amountPaid = 0;

  const result = calculateInvoiceTotals(items, discount, tax, shipping, amountPaid);

  assert.equal(result.subtotal, 300.00);
  assert.equal(result.discountAmount, 30.00);
  assert.equal(result.discountedSubtotal, 270.00);
  assert.equal(result.taxAmount, 13.50);
  assert.equal(result.shippingFee, 10.00);
  assert.equal(result.grandTotal, 293.50);
  assert.equal(result.balanceDue, 293.50);
});

test('calculateInvoiceTotals with inclusive tax and partial payment', () => {
  const items: LineItem[] = [
    { id: '1', name: 'Consulting', description: '', quantity: 10, unit: 'hours', rate: 100 },
  ];

  const discount: DiscountConfig = {
    type: 'fixed',
    value: 100, // subtotal $1000 - $100 = $900
  };

  const tax: TaxConfig = {
    name: 'VAT',
    rate: 20,
    isInclusive: true, // tax is inside the $900
    enabled: true,
  };

  const result = calculateInvoiceTotals(items, discount, tax, 0, 400);

  assert.equal(result.subtotal, 1000);
  assert.equal(result.discountAmount, 100);
  assert.equal(result.discountedSubtotal, 900);
  // inclusive VAT 20%: 900 - (900 / 1.2) = 900 - 750 = 150
  assert.equal(result.taxAmount, 150);
  assert.equal(result.taxableAmount, 750);
  assert.equal(result.grandTotal, 900);
  assert.equal(result.amountPaid, 400);
  assert.equal(result.balanceDue, 500);
});

test('formatCurrency formats various currencies correctly', () => {
  assert.equal(formatCurrency(293.5, 'USD'), '$293.50');
  assert.equal(formatCurrency(1500, 'EUR'), '€1,500.00');
  assert.equal(formatCurrency(25000, 'PKR'), 'Rs. 25,000.00');
  assert.equal(formatCurrency(500, 'AED'), 'AED 500.00');
});

test('computeDueDate calculates proper payment terms dates', () => {
  const base = '2026-10-01';
  assert.equal(computeDueDate(base, 'due_on_receipt'), '2026-10-01');
  assert.equal(computeDueDate(base, 'net_7'), '2026-10-08');
  assert.equal(computeDueDate(base, 'net_30'), '2026-10-31');
});
