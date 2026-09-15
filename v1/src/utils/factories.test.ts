import { describe, it, expect } from 'vitest';
import { createConfirmation, createShiftPause, createCoverage } from './factories';

describe('createConfirmation', () => {
  it('força countsAsEarnings = false para internação, mesmo se o input tentar mudar isso', () => {
    const c = createConfirmation({
      shiftId: 'shift-1',
      date: '2026-09-06',
      type: 'day',
      value: 200,
      status: 'hospitalization',
      countsAsEarnings: true, // tentativa inválida, deve ser ignorada
    });
    expect(c.countsAsEarnings).toBe(false);
  });

  it('marca completed como countsAsEarnings = true automaticamente', () => {
    const c = createConfirmation({
      shiftId: 'shift-1',
      date: '2026-09-06',
      type: 'night',
      value: 250,
      status: 'completed',
    });
    expect(c.countsAsEarnings).toBe(true);
  });

  it('exige countsAsEarnings explícito para falta', () => {
    expect(() =>
      createConfirmation({
        shiftId: 'shift-1',
        date: '2026-09-06',
        type: 'day',
        value: 200,
        status: 'absence',
      })
    ).toThrow();
  });

  it('exige swapCoworkerName quando status é troca', () => {
    expect(() =>
      createConfirmation({
        shiftId: 'shift-1',
        date: '2026-09-06',
        type: 'day',
        value: 200,
        status: 'swap',
        countsAsEarnings: true,
      })
    ).toThrow();
  });
});

describe('createShiftPause', () => {
  it('rejeita data de fim anterior à data de início', () => {
    expect(() =>
      createShiftPause({
        shiftId: 'shift-1',
        startDate: '2026-09-10',
        endDate: '2026-09-01',
      })
    ).toThrow();
  });
});

describe('createCoverage', () => {
  it('rejeita valor negativo', () => {
    expect(() =>
      createCoverage({ name: 'Cobertura extra', type: 'night', value: -50, date: '2026-09-06' })
    ).toThrow();
  });
});