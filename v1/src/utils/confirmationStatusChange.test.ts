import { describe, it, expect } from 'vitest';
import { applyConfirmationStatusChange } from './confirmationStatusChange';
import type { Confirmation } from '../types';

const baseConfirmation: Confirmation = {
  id: 'c1',
  shiftId: 's1',
  date: '2026-09-10',
  type: 'day',
  value: 200,
  status: 'completed',
  countsAsEarnings: true,
};

describe('applyConfirmationStatusChange', () => {
  it('força countsAsEarnings = false para internação, mesmo se o input tentar mudar isso', () => {
    const result = applyConfirmationStatusChange({
      confirmation: baseConfirmation,
      status: 'hospitalization',
      countsAsEarnings: true,
    });
    expect(result.countsAsEarnings).toBe(false);
  });

  it('exige countsAsEarnings explícito para falta', () => {
    expect(() =>
      applyConfirmationStatusChange({ confirmation: baseConfirmation, status: 'absence' })
    ).toThrow();
  });

  it('exige swapCoworkerName quando status é troca', () => {
    expect(() =>
      applyConfirmationStatusChange({
        confirmation: baseConfirmation,
        status: 'swap',
        countsAsEarnings: true,
      })
    ).toThrow();
  });

  it('permite reverter para completed, restaurando countsAsEarnings = true', () => {
    const excepted = { ...baseConfirmation, status: 'absence' as const, countsAsEarnings: false };
    const result = applyConfirmationStatusChange({ confirmation: excepted, status: 'completed' });
    expect(result.status).toBe('completed');
    expect(result.countsAsEarnings).toBe(true);
  });

  it('nunca altera value, date, type, shiftId ou id', () => {
    const result = applyConfirmationStatusChange({
      confirmation: baseConfirmation,
      status: 'illness',
      countsAsEarnings: false,
    });
    expect(result.value).toBe(200);
    expect(result.date).toBe('2026-09-10');
    expect(result.type).toBe('day');
    expect(result.shiftId).toBe('s1');
    expect(result.id).toBe('c1');
  });
});