/**
 * Programación clínica de encuestas (PSS-14, PSQI, PCS).
 * Cadencia por defecto: cada 2 meses, salvo activación forzada del especialista.
 */

export type SurveyInstrumentId = 'PSS-14' | 'PSQI' | 'PCS';

export const SURVEY_CADENCE_DAYS = 60; // ~2 meses

export const SURVEY_INSTRUMENTS: Record<
  SurveyInstrumentId,
  { label: string; shortLabel: string; description: string; recall: string; slug: string }
> = {
  'PSS-14': {
    label: 'Escala de Estrés Percibido (PSS-14)',
    shortLabel: 'PSS-14',
    description: 'Estrés percibido en el último mes.',
    recall: 'Último mes',
    slug: 'pss',
  },
  PSQI: {
    label: 'Índice de Calidad del Sueño de Pittsburgh (PSQI)',
    shortLabel: 'PSQI',
    description: 'Calidad del sueño en el último mes.',
    recall: 'Último mes',
    slug: 'psqi',
  },
  PCS: {
    label: 'Escala de Catastrofización del Dolor (PCS)',
    shortLabel: 'PCS',
    description: 'Pensamientos catastróficos ante el dolor.',
    recall: 'Cuando siente dolor',
    slug: 'pcs',
  },
};

export interface InstrumentAssignment {
  enabled: boolean;
  /** Si true, la encuesta queda disponible aunque no hayan pasado 2 meses. */
  forceActive: boolean;
  forceActivatedAt?: string | null;
  lastCompletedAt?: string | null;
  lastScore?: Record<string, unknown> | null;
}

export type SurveyConfig = Partial<Record<SurveyInstrumentId, InstrumentAssignment>>;

export const DEFAULT_ASSIGNMENT: InstrumentAssignment = {
  enabled: true,
  forceActive: false,
  forceActivatedAt: null,
  lastCompletedAt: null,
  lastScore: null,
};

export function defaultSurveyConfig(): SurveyConfig {
  return {
    'PSS-14': { ...DEFAULT_ASSIGNMENT },
    PSQI: { ...DEFAULT_ASSIGNMENT },
    PCS: { ...DEFAULT_ASSIGNMENT },
  };
}

export function mergeSurveyConfig(stored?: SurveyConfig | null): SurveyConfig {
  const defaults = defaultSurveyConfig();
  if (!stored) return defaults;
  return {
    'PSS-14': { ...DEFAULT_ASSIGNMENT, ...stored['PSS-14'] },
    PSQI: { ...DEFAULT_ASSIGNMENT, ...stored.PSQI },
    PCS: { ...DEFAULT_ASSIGNMENT, ...stored.PCS },
  };
}

export function addMonthsApprox(date: Date, days = SURVEY_CADENCE_DAYS): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export type SurveyAvailability =
  | { status: 'disabled'; reason: string }
  | { status: 'available'; reason: string; dueToForce: boolean }
  | { status: 'waiting'; reason: string; nextDueAt: Date; daysRemaining: number };

export function getSurveyAvailability(
  assignment: InstrumentAssignment | undefined | null,
  now = new Date()
): SurveyAvailability {
  const state = { ...DEFAULT_ASSIGNMENT, ...assignment };

  if (!state.enabled) {
    return {
      status: 'disabled',
      reason: 'Desactivada por el especialista.',
    };
  }

  if (state.forceActive) {
    return {
      status: 'available',
      reason: 'Activada por el especialista fuera de cadencia.',
      dueToForce: true,
    };
  }

  if (!state.lastCompletedAt) {
    return {
      status: 'available',
      reason: 'Pendiente de primera respuesta.',
      dueToForce: false,
    };
  }

  const last = new Date(state.lastCompletedAt);
  const nextDue = addMonthsApprox(last);
  if (now >= nextDue) {
    return {
      status: 'available',
      reason: 'Corresponde por cadencia de 2 meses.',
      dueToForce: false,
    };
  }

  const ms = nextDue.getTime() - now.getTime();
  const daysRemaining = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  return {
    status: 'waiting',
    reason: `Próxima ventana en ${daysRemaining} día${daysRemaining === 1 ? '' : 's'}.`,
    nextDueAt: nextDue,
    daysRemaining,
  };
}

export function isSurveyAvailableForPatient(
  assignment: InstrumentAssignment | undefined | null,
  now = new Date()
): boolean {
  return getSurveyAvailability(assignment, now).status === 'available';
}

export const SURVEY_STORAGE_KEY = 'healthcloud:survey-assignments';
