import { describe, it, expect } from 'vitest';
import { createShift, createShiftPause } from './factories';
import { generatePendingConfirmations } from './confirmationGenerator';

describe('generatePendingConfirmations', () => {
  it('gera confirmations só nos dias active, pula off e avança o cursor mesmo assim', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    const result = generatePendingConfirmations(
      shift, [], '2026-09-05', new Date('2026-09-09T20:00:00')
    );
    // dias pendentes: 06(active) 07(off) 08(active) 09(active seria? 06->par,07->impar,08->par,09->impar->off)
    expect(result.confirmations.map((c) => c.date)).toEqual(['2026-09-06', '2026-09-08']);
    expect(result.newLastSync).toBe('2026-09-09');
  });

  it('nao gera confirmation do dia se o turno diurno ainda nao terminou (antes das 19h)', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    const result = generatePendingConfirmations(
      shift, [], '2026-09-05', new Date('2026-09-06T15:00:00')
    );
    expect(result.confirmations).toHaveLength(0);
    expect(result.newLastSync).toBe('2026-09-05'); // nao avancou, pois nem o dia 06 foi liberado
  });

  it('gera a confirmation assim que o turno diurno passa das 19h', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    const result = generatePendingConfirmations(
      shift, [], '2026-09-05', new Date('2026-09-06T20:00:00')
    );
    expect(result.confirmations).toHaveLength(1);
    expect(result.newLastSync).toBe('2026-09-06');
  });

  it('turno noturno so libera apos as 7h do dia seguinte', () => {
    const shift = createShift({ name: 'N', type: 'night', value: 250, startDate: '2026-09-06', color: '#222' });

    const aindaCedo = generatePendingConfirmations(shift, [], '2026-09-05', new Date('2026-09-07T05:00:00'));
    expect(aindaCedo.confirmations).toHaveLength(0);

    const jaPassou = generatePendingConfirmations(shift, [], '2026-09-05', new Date('2026-09-07T08:00:00'));
    expect(jaPassou.confirmations).toHaveLength(1);
    expect(jaPassou.confirmations[0].value).toBe(250);
    expect(jaPassou.confirmations[0].type).toBe('night');
  });

//   it('pula dias dentro de uma pausa, mas avanca o cursor', () => {
//     const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
//     const pause = createShiftPause({ shiftId: shift.id, startDate: '2026-09-06', endDate: '2026-09-08' });
//     const result = generatePendingConfirmations(
//       shift, [pause], '2026-09-05', new Date('2026-09-10T20:00:00')
//     );
//     console.log(result)
//     expect(result.confirmations).toHaveLength(0); // 06 e 08 seriam active, mas estao pausados; 07,09,10 sao a lógica normal (09 e 10... vamos conferir)
//     expect(result.newLastSync).toBe('2026-09-10');
//   });
  it('pula dias dentro de uma pausa, mas avanca o cursor', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    const pause = createShiftPause({ shiftId: shift.id, startDate: '2026-09-06', endDate: '2026-09-08' });
    const result = generatePendingConfirmations(
        shift, [pause], '2026-09-05', new Date('2026-09-10T20:00:00')
    );

    // 06, 07, 08 -> dentro da pausa, nenhum gera registro
    // 09 -> fora da pausa, mas cai em dia de folga (ímpar)
    // 10 -> fora da pausa, dia de plantão normal (par), e já passou das 19h -> gera confirmation
    expect(result.confirmations).toHaveLength(1);
    expect(result.confirmations[0].date).toBe('2026-09-10');
    expect(result.newLastSync).toBe('2026-09-10');
    });

  it('plantao encerrado (status closed) nao gera nada', () => {
    const shift = createShift({ name: 'A', type: 'day', value: 200, startDate: '2026-09-06', color: '#111' });
    shift.status = 'closed';
    const result = generatePendingConfirmations(shift, [], '2026-09-05', new Date('2026-09-10T20:00:00'));
    expect(result.confirmations).toHaveLength(0);
    expect(result.newLastSync).toBe('2026-09-05'); // nao mexeu em nada
  });
});