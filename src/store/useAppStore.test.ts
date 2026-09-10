import { beforeEach, describe, expect, it, vi } from 'vitest';

// localStorage fake em memória — só para o persist ter onde gravar
// durante o teste (ver seção 3.6: não vale trocar o environment do
// Vitest inteiro para jsdom só por causa disso)
function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMemoryStorage());
  vi.resetModules(); // cada teste importa uma instância nova do store
});

describe('addShift', () => {
  it('cadastra um plantão sem conflito', async () => {
    const { useAppStore } = await import('./useAppStore');
    const result = useAppStore.getState().addShift({
      name: 'Plantão Daniel',
      type: 'day',
      value: 200,
      startDate: '2026-09-01',
      color: '#3498db',
    });
    expect(result.success).toBe(true);
    expect(useAppStore.getState().shifts).toHaveLength(1);
  });

  it('rejeita um segundo plantão do mesmo tipo e mesma paridade', async () => {
    const { useAppStore } = await import('./useAppStore');
    useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    });
    const result = useAppStore.getState().addShift({
      name: 'Plantão B', type: 'day', value: 180, startDate: '2026-09-03', color: '#222',
    });
    expect(result.success).toBe(false);
  });

  it('propaga erro de validação da factory sem lançar exceção', async () => {
    const { useAppStore } = await import('./useAppStore');
    const result = useAppStore.getState().addShift({
      name: 'Inválido', type: 'day', value: -50, startDate: '2026-09-01', color: '#111',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateShift', () => {
  it('permite trocar cor sem revalidar conflito', async () => {
    const { useAppStore } = await import('./useAppStore');
    const { data: id } = useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    }) as { success: true; data: string };

    const result = useAppStore.getState().updateShift(id, { color: '#eeeeee' });
    expect(result.success).toBe(true);
  });

  it('revalida conflito ao mudar startDate para uma data conflitante', async () => {
    const { useAppStore } = await import('./useAppStore');
    useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    });
    const { data: idB } = useAppStore.getState().addShift({
      name: 'Plantão B', type: 'night', value: 180, startDate: '2026-09-02', color: '#222',
    }) as { success: true; data: string };

    const result = useAppStore.getState().updateShift(idB, { type: 'day', startDate: '2026-09-03' });
    expect(result.success).toBe(false);
  });
});

describe('deleteShift', () => {
  it('remove o plantão, suas confirmations e suas pauses', async () => {
    const { useAppStore } = await import('./useAppStore');
    const { data: id } = useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    }) as { success: true; data: string };

    useAppStore.getState().addShiftPause({ shiftId: id, startDate: '2026-09-10', endDate: '2026-09-15' });
    useAppStore.getState().runCatchUp(new Date('2026-09-05T20:00:00'));

    useAppStore.getState().deleteShift(id);

    const state = useAppStore.getState();
    expect(state.shifts).toHaveLength(0);
    expect(state.confirmations.filter((c) => c.shiftId === id)).toHaveLength(0);
    expect(state.pauses.filter((p) => p.shiftId === id)).toHaveLength(0);
    expect(state.lastSyncByShift[id]).toBeUndefined();
  });

  it('retorna erro ao tentar excluir plantão inexistente', async () => {
    const { useAppStore } = await import('./useAppStore');
    const result = useAppStore.getState().deleteShift('id-que-nao-existe');
    expect(result.success).toBe(false);
  });
});

describe('addCoverage', () => {
  it('rejeita cobertura sem plantão no turno oposto', async () => {
    const { useAppStore } = await import('./useAppStore');
    const result = useAppStore.getState().addCoverage({
      name: 'Cobertura avulsa', type: 'night', value: 150, date: '2026-09-01',
    });
    expect(result.success).toBe(false);
  });

  it('aceita cobertura válida no turno oposto a um plantão ativo', async () => {
    const { useAppStore } = await import('./useAppStore');
    useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    });
    const result = useAppStore.getState().addCoverage({
      name: 'Cobertura avulsa', type: 'night', value: 150, date: '2026-09-01',
    });
    expect(result.success).toBe(true);
  });
});

describe('runCatchUp', () => {
  it('gera confirmations só para shifts ativos, ignorando encerrados', async () => {
    const { useAppStore } = await import('./useAppStore');
    const { data: id } = useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    }) as { success: true; data: string };
    useAppStore.getState().closeShift(id);

    useAppStore.getState().runCatchUp(new Date('2026-09-05T20:00:00'));

    expect(useAppStore.getState().confirmations).toHaveLength(0);
  });

  it('avança o cursor de sincronização do shift processado', async () => {
    const { useAppStore } = await import('./useAppStore');
    const { data: id } = useAppStore.getState().addShift({
      name: 'Plantão A', type: 'day', value: 200, startDate: '2026-09-01', color: '#111',
    }) as { success: true; data: string };

    const before = useAppStore.getState().lastSyncByShift[id];
    useAppStore.getState().runCatchUp(new Date('2026-09-05T20:00:00'));
    const after = useAppStore.getState().lastSyncByShift[id];

    expect(after).not.toBe(before);
  });
});