/**
 * Programación clínica de encuestas (PSS-14, PSQI, PCS, Dolor).
 *
 * Por defecto están DESACTIVADAS. El especialista decide cuáles activar
 * y cuándo. Cadencia de seguimiento: cada 2 meses tras una respuesta,
 * salvo que el especialista vuelva a abrir la ventana.
 */

import {
  BODY_REGION_LABELS,
  PAIN_CHARACTERISTICS,
} from '@/lib/clinical/pain-assessment';

export type SurveyInstrumentId = 'PSS-14' | 'PSQI' | 'PCS' | 'DOLOR';

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
  DOLOR: {
    label: 'Evaluación del dolor',
    shortLabel: 'Dolor',
    description: 'Aparición, localización, EVA/ENA, características, irradiación y alivio.',
    recall: 'Estado actual del dolor',
    slug: 'dolor',
  },
};

export const SURVEY_INSTRUMENT_IDS = Object.keys(SURVEY_INSTRUMENTS) as SurveyInstrumentId[];

export interface SurveyRecord {
  completedAt: string;
  score: Record<string, unknown>;
  summary?: string;
}

export interface InstrumentAssignment {
  /** El especialista ha asignado esta encuesta al paciente. */
  enabled: boolean;
  /** Abre la ventana ahora, aunque no hayan pasado 2 meses. */
  forceActive: boolean;
  forceActivatedAt?: string | null;
  lastCompletedAt?: string | null;
  lastScore?: Record<string, unknown> | null;
  /** Historial de respuestas del paciente (más reciente primero). */
  history?: SurveyRecord[];
}

export type SurveyConfig = Partial<Record<SurveyInstrumentId, InstrumentAssignment>>;

/** Por defecto: ninguna encuesta activa hasta que el especialista la asigne. */
export const DEFAULT_ASSIGNMENT: InstrumentAssignment = {
  enabled: false,
  forceActive: false,
  forceActivatedAt: null,
  lastCompletedAt: null,
  lastScore: null,
  history: [],
};

export function defaultSurveyConfig(): SurveyConfig {
  return {
    'PSS-14': { ...DEFAULT_ASSIGNMENT, history: [] },
    PSQI: { ...DEFAULT_ASSIGNMENT, history: [] },
    PCS: { ...DEFAULT_ASSIGNMENT, history: [] },
    DOLOR: { ...DEFAULT_ASSIGNMENT, history: [] },
  };
}

export function mergeSurveyConfig(stored?: SurveyConfig | null): SurveyConfig {
  const defaults = defaultSurveyConfig();
  if (!stored) return defaults;
  return {
    'PSS-14': {
      ...DEFAULT_ASSIGNMENT,
      ...stored['PSS-14'],
      history: stored['PSS-14']?.history ?? [],
    },
    PSQI: {
      ...DEFAULT_ASSIGNMENT,
      ...stored.PSQI,
      history: stored.PSQI?.history ?? [],
    },
    PCS: {
      ...DEFAULT_ASSIGNMENT,
      ...stored.PCS,
      history: stored.PCS?.history ?? [],
    },
    DOLOR: {
      ...DEFAULT_ASSIGNMENT,
      ...stored.DOLOR,
      history: stored.DOLOR?.history ?? [],
    },
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
      reason: 'No asignada por el especialista.',
    };
  }

  if (state.forceActive) {
    return {
      status: 'available',
      reason: 'Abierta por el especialista.',
      dueToForce: true,
    };
  }

  if (!state.lastCompletedAt) {
    return {
      status: 'available',
      reason: 'Asignada · pendiente de primera respuesta.',
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
    reason: `Respondida · próxima ventana en ${daysRemaining} día${daysRemaining === 1 ? '' : 's'}.`,
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

/** Añade un registro y cierra la ventana forzada. */
export function appendSurveyRecord(
  assignment: InstrumentAssignment,
  score: Record<string, unknown>,
  summary?: string
): InstrumentAssignment {
  const completedAt = new Date().toISOString();
  const record: SurveyRecord = { completedAt, score, summary };
  const history = [record, ...(assignment.history ?? [])].slice(0, 20);
  return {
    ...assignment,
    lastCompletedAt: completedAt,
    lastScore: score,
    forceActive: false,
    forceActivatedAt: null,
    history,
  };
}

function formatPainScoreSummary(score: Record<string, unknown>): string {
  if (typeof score.intensityEva !== 'number') return 'Dolor';
  const eva = `EVA ${score.intensityEva}/10`;
  const band = typeof score.bandLabel === 'string' ? ` · ${score.bandLabel}` : '';
  const locs = Array.isArray(score.locations)
    ? score.locations
        .map((id) => BODY_REGION_LABELS[String(id)] ?? String(id))
        .slice(0, 2)
        .join(', ')
    : '';
  const chars = Array.isArray(score.characteristics)
    ? score.characteristics
        .map(
          (id) =>
            PAIN_CHARACTERISTICS.find((c) => c.id === id)?.label ?? String(id)
        )
        .slice(0, 2)
        .join(', ')
    : '';
  return `${eva}${band}${locs ? ` · ${locs}` : ''}${chars ? ` · ${chars}` : ''}`;
}

export function formatScoreSummary(
  instrument: SurveyInstrumentId,
  score: Record<string, unknown>
): string {
  if (instrument === 'PSS-14' && typeof score.total === 'number') {
    return `PSS ${score.total}/56${score.bandLabel ? ` · ${score.bandLabel}` : ''}`;
  }
  if (instrument === 'PSQI' && typeof score.global === 'number') {
    return `PSQI ${score.global}/21${score.bandLabel ? ` · ${score.bandLabel}` : ''}`;
  }
  if (instrument === 'PCS' && typeof score.total === 'number') {
    return `PCS ${score.total}/52${score.bandLabel ? ` · ${score.bandLabel}` : ''}`;
  }
  if (instrument === 'DOLOR') {
    return formatPainScoreSummary(score);
  }
  return SURVEY_INSTRUMENTS[instrument].shortLabel;
}

export const SURVEY_STORAGE_KEY = 'healthcloud:survey-assignments';
