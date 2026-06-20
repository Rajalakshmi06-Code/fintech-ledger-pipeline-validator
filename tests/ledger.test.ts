// tests/ledger.test.ts
import { describe, it, expect } from '@jest/globals';
import { validateTransaction } from '../src/ledgerprocessor';

// Import our decoupled external test data payloads
import * as testData from '../data/ledgerTestData.json';

describe('FinTech Ledger Pipeline - Robust Data-Driven Suite', () => {

  it('should pass validation when transaction math matches perfectly matching ledger standards', () => {
    const payload = testData.successfulTransaction;
    
    // Execute business logic check using decoupled configurations
    const result = validateTransaction(payload as any);
    
    expect(result.mathIsValid).toBe(true);
    expect(result.calculatedTotal).toBe(payload.expectedTotal);
    expect(result.errors).toHaveLength(0);
  });

  it('should safely identify and fail validation if there is a ledger mismatch or data leakage', () => {
    const payload = testData.corruptedTransaction;
    
    const result = validateTransaction(payload as any);
    
    expect(result.mathIsValid).toBe(false);
    expect(result.errors[0]).toContain("Financial mismatch!");
  });
});