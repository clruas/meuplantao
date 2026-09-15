// src/utils/calculationEngine.integration.test.ts
import { describe, it, expect } from 'vitest';
import { createShift, createShiftPause, createCoverage } from './factories';
import { wouldCreateConflict } from './conflictDetection';
import { canCreateCoverage } from './coverageValidation';
import { generatePendingConfirmations } from './confirmationGenerator';
import { buildCalendarRange } from './calendarRange';
import { calculateEarningsForPeriod } from './earningsCalculator';

describe('Motor de cálculo — cenário de integração (2 semanas)', () => {
  it('gera calendário e ganhos corretos combinando plantões, pausa, cobertura e exceções', () => {
    // ---------- 1. ARRANGE: monta o cenário com as entidades reais ----------
    const shiftA = createShift({ name: 'Plantão Diurno', type: 'day', value: 200, startDate: '2026-09-01', color: '#3B82F6' });
    const shiftB = createShift({ name: 'Plantão Noturno', type: 'night', value: 250, startDate: '2026-09-01', color: '#8B5CF6' });
    const pauseA = createShiftPause({ shiftId: shiftA.id, startDate: '2026-09-08', endDate: '2026-09-09', reason: 'Férias' });
    
    // ---------- 2. Conflito: uma tentativa de 3º plantão que deveria ser bloqueada ----------
    const tentativaConflitante = createShift({ name: 'Diurno extra', type: 'day', value: 180, startDate: '2026-09-03', color: '#F59E0B' });
    expect(wouldCreateConflict([shiftA, shiftB], tentativaConflitante)).toBe(true);
    // -> bloqueado, então não entra na lista de plantões ativos que seguimos usando:
    const activeShifts = [shiftA, shiftB];
    
    // ---------- 3. Cobertura: no dia 09, A está de pausa, o turno diurno fica livre ----------
    const validacao = canCreateCoverage(activeShifts, [pauseA], [], '2026-09-09', 'day');
    console.log(validacao)
    expect(validacao.allowed).toBe(false);
    const coverage = createCoverage({ name: 'Cobertura extra', type: 'day', value: 180, date: '2026-09-09' });
    
    // ---------- 4. Catch-up: gera as confirmations pendentes das 2 semanas ----------
    const now = new Date('2026-09-15T20:00:00');
    const catchUpA = generatePendingConfirmations(shiftA, [pauseA], '2026-08-31', now);
    const catchUpB = generatePendingConfirmations(shiftB, [], '2026-08-31', now);
    
    
    expect(catchUpA.confirmations.map((c) => c.date)).toEqual([
        '2026-09-01', '2026-09-03', '2026-09-05', '2026-09-07', '2026-09-11', '2026-09-13', '2026-09-15'
    ]); // 09 pulado por causa da pausa
    expect(catchUpB.confirmations.map((c) => c.date)).toEqual([
        '2026-09-01', '2026-09-03', '2026-09-05', '2026-09-07', '2026-09-09', '2026-09-11', '2026-09-13',
    ]); // B não tem pausa, gera normal inclusive no 09
        
    // ---------- 5. Simula edições de status que o usuário faria na UI (fase futura) ----------
    const confirmations = [...catchUpA.confirmations, ...catchUpB.confirmations];

    const falta07 = confirmations.find((c) => c.shiftId === shiftA.id && c.date === '2026-09-07')!;
    falta07.status = 'absence';
    falta07.countsAsEarnings = false; // usuário escolheu não contar

    const internacao13 = confirmations.find((c) => c.shiftId === shiftA.id && c.date === '2026-09-13')!;
    internacao13.status = 'hospitalization';
    internacao13.countsAsEarnings = true; // dado "errado" de propósito — ver explicação abaixo

    const troca11 = confirmations.find((c) => c.shiftId === shiftB.id && c.date === '2026-09-11')!;
    troca11.status = 'swap';
    troca11.countsAsEarnings = true;
    troca11.swapCoworkerName = 'Marcos';

    // ---------- 6. Calendário: confere um dia com 2 plantões e o dia da pausa/cobertura ----------
    const calendar = buildCalendarRange(activeShifts, [pauseA], [coverage], confirmations, '2026-09-01', '2026-09-14');

    const dia01 = calendar.find((d) => d.date === '2026-09-01')!;
    expect(dia01.activeShifts).toHaveLength(2); // A e B ativos juntos
    
    const dia09 = calendar.find((d) => d.date === '2026-09-09')!;
    expect(dia09.activeShifts).toHaveLength(1); // só B, A está pausado
    expect(dia09.activeShifts[0].id).toBe(shiftB.id);
    expect(dia09.coverage?.value).toBe(180);

    const dia02 = calendar.find((d) => d.date === '2026-09-02')!;
    expect(dia02.activeShifts).toHaveLength(0); // folga dos dois
    
    // ---------- 7. Ganhos: soma tudo respeitando as exceções ----------
    const earnings = calculateEarningsForPeriod(confirmations, [coverage], [pauseA], '2026-09-01', '2026-09-14');

    expect(earnings.byShift[shiftA.id]).toEqual({ realizedDays: 4, total: 800 });  // 01,03,05,11
    expect(earnings.byShift[shiftB.id]).toEqual({ realizedDays: 7, total: 1750 }); // todos, inclusive a troca
    expect(earnings.coverageDays).toBe(1);
    expect(earnings.coverageTotal).toBe(180);
    expect(earnings.absenceDays).toBe(1);
    expect(earnings.swapDays).toBe(1);
    expect(earnings.hospitalizationDays).toBe(1);
    expect(earnings.pauseDays).toBe(2); // 08 e 09

    expect(earnings.total).toBe(2730); // 800 (A) + 1750 (B) + 180 (cobertura)
    
  });
});