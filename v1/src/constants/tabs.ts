export interface TabDefinition {
  id: string;
  label: string;
  icon: string; // nome do ícone, resolvido pelo componente que renderiza
}

/** Lista de dados, não JSX — acrescentar uma aba nova (ex: "Usuário") é só um item a mais aqui. */
export const APP_TABS: TabDefinition[] = [
  { id: 'calendar', label: 'Plantões', icon: 'calendar' },
  { id: 'report', label: 'Relatório', icon: 'bar-chart' },
];