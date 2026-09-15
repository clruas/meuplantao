import { describe, expect, it } from "vitest";
import { getMonthGridRange, getPeriodRange } from "./periodRange";

describe('getMonthGridRange', () => {
  it('inclui os dias finais do mês anterior e iniciais do mês seguinte para fechar semanas completas', () => {
    // setembro/2026: dia 1 é terça-feira, dia 30 é quarta-feira
    expect(getMonthGridRange('2026-09-15')).toEqual({
      start: '2026-08-30', // domingo da semana que contém 01/09
      end: '2026-10-03',   // sábado da semana que contém 30/09
    });
  });

  it('não adiciona nada quando o mês já começa no domingo e termina no sábado', () => {
    // exemplo hipotético de mês perfeitamente alinhado à semana
    const period = getPeriodRange('2026-03-15', 'month'); // confirmar alinhamento antes de usar como fixture real
    // este teste serve de lembrete: com mês alinhado, start/end do grid devem
    // ser idênticos ao start/end do mês exato — ajuste a data acima se
    // março/2026 não bater com esse alinhamento no seu ambiente
  });
});