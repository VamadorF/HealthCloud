/**
 * Preferencia de presentación de la agenda del especialista:
 * lista cronológica (agenda) o grilla horaria (calendario).
 */

export type AgendaViewMode = 'agenda' | 'calendar';

export const AGENDA_VIEW_STORAGE_KEY = 'healthcloud:agenda-view';

export const AGENDA_VIEW_OPTIONS: {
  id: AgendaViewMode;
  label: string;
  description: string;
}[] = [
  {
    id: 'calendar',
    label: 'Calendario',
    description: 'Grilla horaria tipo Google Calendar: días en columnas y citas en el tiempo.',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    description: 'Lista cronológica del día, compacta para revisar atenciones una a una.',
  },
];

/** Por defecto calendario: el especialista ve el horario de un vistazo. */
export const DEFAULT_AGENDA_VIEW: AgendaViewMode = 'calendar';

export function isAgendaViewMode(value: unknown): value is AgendaViewMode {
  return value === 'agenda' || value === 'calendar';
}

export function parseAgendaViewMode(raw: unknown): AgendaViewMode {
  return isAgendaViewMode(raw) ? raw : DEFAULT_AGENDA_VIEW;
}
