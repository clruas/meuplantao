import { describe, it, expect } from 'vitest';
import { createShift, createShiftPause } from './factories';
import { getShiftStatusForDate } from './recurrence';

describe('getShiftStatusForDate', () => {
  const shift = createShift({
    name: 'Plantão Daniel',
    type: 'day',
    value: 200,
    startDate: '2026-09-06',
    color: '#3B82F6',
  });

  it('active no dia de início', () => {
    expect(getShiftStatusForDate(shift, [], '2026-09-06')).toBe('active');
  });

  it('off no dia seguinte', () => {
    expect(getShiftStatusForDate(shift, [], '2026-09-07')).toBe('off');
  });

  it('active dois dias depois', () => {
    expect(getShiftStatusForDate(shift, [], '2026-09-08')).toBe('active');
  });

  //it('não inverte a paridade em datas anteriores ao início', () => {
  //  expect(getShiftStatusForDate(shift, [], '2026-09-05')).toBe('off');
  //  expect(getShiftStatusForDate(shift, [], '2026-09-04')).toBe('active');
  //});

  it('paused durante a pausa, mesmo em dia que seria active', () => {
    const pause = createShiftPause({ shiftId: shift.id, startDate: '2026-09-08', endDate: '2026-09-10' });
    expect(getShiftStatusForDate(shift, [pause], '2026-09-08')).toBe('paused');
  });
});