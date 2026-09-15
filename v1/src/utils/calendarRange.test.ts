import { describe, expect, it } from "vitest";
import { createCoverage, createShift } from "./factories";
import { buildCalendarRange } from "./calendarRange";

describe('buildCalendarRange', () => {
  it('retorna um dia por data no range, inclusive nas pontas', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    const result = buildCalendarRange([shift], [], [], [], '2026-09-06', '2026-09-08');
    expect(result).toHaveLength(3);
    expect(result[0].activeShifts).toHaveLength(1);
    expect(result[1].activeShifts).toHaveLength(0); // folga
    expect(result[2].activeShifts).toHaveLength(1);
  });

  it('inclui até 2 shifts ativos no mesmo dia (dia + noite)', () => {
    const day = createShift({ name: 'Dia', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    const night = createShift({ name: 'Noite', type: 'night', value: 250, startDate: '2026-09-06', color: '#222' });
    const result = buildCalendarRange([day, night], [], [], [], '2026-09-06', '2026-09-06');
    expect(result[0].activeShifts).toHaveLength(2);
  });

  it('anexa a coverage do dia quando existir', () => {
    const coverage = createCoverage({ name: 'Extra', type: 'night', value: 300, date: '2026-09-06' });
    const result = buildCalendarRange([], [], [coverage], [], '2026-09-06', '2026-09-06');
    expect(result[0].coverage).toEqual(coverage);
  });

  it('shift encerrado (status closed) não aparece como ativo', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    shift.status = 'closed';
    const result = buildCalendarRange([shift], [], [], [], '2026-09-06', '2026-09-06');
    expect(result[0].activeShifts).toHaveLength(0);
  });
});
