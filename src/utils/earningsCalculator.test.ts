import { describe, it, expect } from 'vitest';
import { createConfirmation, createCoverage, createShiftPause } from './factories';
import { calculateEarningsForPeriod } from './earningsCalculator';

describe('calculateEarningsForPeriod', () => {
  it('soma normalmente confirmations completed', () => {
    const c1 = createConfirmation({ shiftId: 's1', date: '2026-09-06', type: 'day', value: 200, status: 'completed' });
    const c2 = createConfirmation({ shiftId: 's1', date: '2026-09-08', type: 'day', value: 200, status: 'completed' });
    const result = calculateEarningsForPeriod([c1, c2], [], [], '2026-09-01', '2026-09-30');
    expect(result.total).toBe(400);
    expect(result.byShift['s1']).toEqual({ realizedDays: 2, total: 400 });
  });

  it('falta com countsAsEarnings true conta normal; false exclui do total mas conta o dia', () => {
    const contaComoNormal = createConfirmation({
      shiftId: 's1', date: '2026-09-06', type: 'day', value: 200, status: 'absence', countsAsEarnings: true,
    });
    const naoConta = createConfirmation({
      shiftId: 's1', date: '2026-09-08', type: 'day', value: 200, status: 'absence', countsAsEarnings: false,
    });
    const result = calculateEarningsForPeriod([contaComoNormal, naoConta], [], [], '2026-09-01', '2026-09-30');
    expect(result.total).toBe(200);
    expect(result.absenceDays).toBe(2);
  });

  it('internacao nunca conta, mesmo se o dado vier com countsAsEarnings true (ex: JSON corrompido)', () => {
    const internacao = createConfirmation({
      shiftId: 's1', date: '2026-09-06', type: 'day', value: 200, status: 'hospitalization',
    });
    // força manualmente um dado inconsistente, simulando um JSON importado malformado
    (internacao as any).countsAsEarnings = true;

    const result = calculateEarningsForPeriod([internacao], [], [], '2026-09-01', '2026-09-30');
    expect(result.total).toBe(0);
    expect(result.hospitalizationDays).toBe(1);
  });

  it('soma cobertura separadamente e inclui no total geral', () => {
    const coverage = createCoverage({ name: 'Extra', type: 'night', value: 300, date: '2026-09-10' });
    const result = calculateEarningsForPeriod([], [coverage], [], '2026-09-01', '2026-09-30');
    expect(result.coverageDays).toBe(1);
    expect(result.coverageTotal).toBe(300);
    expect(result.total).toBe(300);
  });

  it('inclui confirmations exatamente nas bordas do periodo', () => {
    const noInicio = createConfirmation({ shiftId: 's1', date: '2026-09-01', type: 'day', value: 100, status: 'completed' });
    const noFim = createConfirmation({ shiftId: 's1', date: '2026-09-30', type: 'day', value: 100, status: 'completed' });
    const result = calculateEarningsForPeriod([noInicio, noFim], [], [], '2026-09-01', '2026-09-30');
    expect(result.total).toBe(200);
  });

  it('conta so a intersecao de uma pausa parcialmente sobreposta ao periodo', () => {
    const pause = createShiftPause({ shiftId: 's1', startDate: '2026-08-25', endDate: '2026-09-05' });
    const result = calculateEarningsForPeriod([], [], [pause], '2026-09-01', '2026-09-30');
    expect(result.pauseDays).toBe(5); // 01,02,03,04,05
  });

  it('separa corretamente o total por multiplos shifts', () => {
    const a = createConfirmation({ shiftId: 's1', date: '2026-09-06', type: 'day', value: 200, status: 'completed' });
    const b = createConfirmation({ shiftId: 's2', date: '2026-09-06', type: 'night', value: 250, status: 'completed' });
    const result = calculateEarningsForPeriod([a, b], [], [], '2026-09-01', '2026-09-30');
    expect(result.byShift['s1'].total).toBe(200);
    expect(result.byShift['s2'].total).toBe(250);
    expect(result.total).toBe(450);
  });

  it('periodo sem nenhum dado retorna tudo zerado', () => {
    const result = calculateEarningsForPeriod([], [], [], '2026-09-01', '2026-09-30');
    expect(result.total).toBe(0);
    expect(result.pauseDays).toBe(0);
  });
});