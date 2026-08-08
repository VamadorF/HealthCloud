/**
 * Catálogo de widgets personalizables por rol.
 * El contenido principal de cada pantalla (p. ej. el cronograma del especialista)
 * no es un widget: permanece siempre visible. Solo se pueden ocultar bloques
 * secundarios que rellenan el dashboard.
 */

export type DashboardRole = 'admin' | 'organization' | 'specialist' | 'patient';

export interface WidgetDefinition {
  id: string;
  label: string;
  description: string;
  /** Si es true, el widget aparece activado por defecto. */
  defaultVisible: boolean;
}

export const WIDGET_CATALOG: Record<DashboardRole, WidgetDefinition[]> = {
  specialist: [
    {
      id: 'specialist.daySummary',
      label: 'Resumen del día',
      description: 'Indicadores de jornada: sala de espera, pendientes y huecos.',
      defaultVisible: false,
    },
    {
      id: 'specialist.nextStep',
      label: 'Atención en curso',
      description: 'Paciente actual con acción para continuar la consulta.',
      defaultVisible: true,
    },
  ],
  patient: [
    {
      id: 'patient.metrics',
      label: 'Indicadores de actividad',
      description: 'Consultas, síntomas y medicación en cifras.',
      defaultVisible: false,
    },
    {
      id: 'patient.upcomingAppointments',
      label: 'Próximas citas',
      description: 'Lista de citas confirmadas o pendientes.',
      defaultVisible: true,
    },
    {
      id: 'patient.quickActions',
      label: 'Acciones rápidas',
      description: 'Atajos a síntomas, historial y solicitud de hora.',
      defaultVisible: true,
    },
    {
      id: 'patient.activity',
      label: 'Resumen de actividad',
      description: 'Totales de citas, reportes y consultas.',
      defaultVisible: true,
    },
  ],
  admin: [
    {
      id: 'admin.stats',
      label: 'Indicadores globales',
      description: 'Organizaciones, usuarios y citas de la plataforma.',
      defaultVisible: true,
    },
  ],
  organization: [
    {
      id: 'org.stats',
      label: 'Indicadores del centro',
      description: 'Especialistas, pacientes y actividad del centro.',
      defaultVisible: true,
    },
  ],
};

export const WIDGET_STORAGE_KEY = 'healthcloud:dashboard-widgets';

export type WidgetVisibilityMap = Record<string, boolean>;

export function defaultVisibilityForRole(role: DashboardRole): WidgetVisibilityMap {
  const map: WidgetVisibilityMap = {};
  for (const widget of WIDGET_CATALOG[role]) {
    map[widget.id] = widget.defaultVisible;
  }
  return map;
}

export function mergeVisibility(
  role: DashboardRole,
  stored: Partial<WidgetVisibilityMap> | null | undefined
): WidgetVisibilityMap {
  const defaults = defaultVisibilityForRole(role);
  if (!stored) return defaults;
  const next = { ...defaults };
  for (const widget of WIDGET_CATALOG[role]) {
    if (typeof stored[widget.id] === 'boolean') {
      next[widget.id] = stored[widget.id] as boolean;
    }
  }
  return next;
}
