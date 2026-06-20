// src/ledgerProcessor.ts

export interface TransactionPayload {
  transactionId: string;
  currency: string;
  items: Array<{ sku: string; price: number; quantity: number }>;
  discountApplied: number;
  taxRate: number;
  expectedTotal: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
}

export function validateTransaction(payload: TransactionPayload) {
  const errors: string[] = [];
  
  // 1. Calculate base subtotal from items
  const subtotal = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // 2. Subtract discounts
  const discountedSubtotal = subtotal - payload.discountApplied;
  
  // 3. Precise Financial Rounding (prevents float rounding errors in Javascript)
  const calculatedTax = Math.round((discountedSubtotal * payload.taxRate) * 100) / 100;
  const calculatedTotal = Math.round((discountedSubtotal + calculatedTax) * 100) / 100;

  // 4. Assert financial truth
  if (calculatedTotal !== payload.expectedTotal) {
    errors.push(`Financial mismatch! Ledger expected ${payload.expectedTotal} but calculation yielded ${calculatedTotal}`);
  }

  return {
    mathIsValid: errors.length === 0,
    calculatedTotal,
    errors
  };
}