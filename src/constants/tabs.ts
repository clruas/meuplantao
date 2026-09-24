import { CalendarDays, CircleDollarSign, Stethoscope, User } from "lucide-react"

interface TabDefinition {
  id: string;
  label: string;
  icon: Icon; // nome do ícone, resolvido pelo componente que renderiza
}

export const APP_TABS: TabDefinition[] = [
  { id: 'calendar', label: 'Plantões', icon: Stethoscope },
  { id: 'report', label: 'Relatório', icon: CircleDollarSign },
  { id: 'user', label: 'Usuário', icon: User },
];