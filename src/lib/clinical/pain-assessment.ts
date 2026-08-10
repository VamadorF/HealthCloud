/**
 * Evaluación estructurada del dolor (anamnesis clínica).
 * Aparición · localización · intensidad EVA/ENA · características ·
 * irradiación · factores que alivian o agravan.
 */

export const PAIN_CHARACTERISTICS = [
  { id: 'arde', label: 'Arde' },
  { id: 'pica', label: 'Pica' },
  { id: 'punzante', label: 'Punzante' },
  { id: 'opresivo', label: 'Opresivo' },
  { id: 'sordo', label: 'Sordo' },
  { id: 'tirante', label: 'Tirante' },
  { id: 'electrico', label: 'Eléctrico' },
] as const;

export type PainCharacteristicId = (typeof PAIN_CHARACTERISTICS)[number]['id'];

export const PAIN_RADIATION_OPTIONS = [
  { id: 'none', label: 'No irradia' },
  { id: 'up', label: 'Sube' },
  { id: 'down', label: 'Baja' },
  { id: 'both', label: 'Sube y baja' },
  { id: 'other', label: 'Hacia otra zona' },
] as const;

export type PainRadiationId = (typeof PAIN_RADIATION_OPTIONS)[number]['id'];

export const BODY_REGION_LABELS: Record<string, string> = {
  cabeza: 'Cabeza',
  cuello: 'Cuello',
  torax: 'Tórax',
  abdomen: 'Abdomen',
  espalda: 'Espalda',
  brazo_izq: 'Brazo izq.',
  brazo_der: 'Brazo der.',
  pierna_izq: 'Pierna izq.',
  pierna_der: 'Pierna der.',
  generalizado: 'Generalizado',
};

export interface PainAssessmentAnswers {
  /** Cuándo comenzó (fecha aproximada o texto libre). */
  onset: string;
  /** Fecha ISO opcional si el paciente elige calendario. */
  onsetDate: string | null;
  locations: string[];
  /** Intensidad EVA / ENA 0–10. */
  intensityEva: number | null;
  characteristics: PainCharacteristicId[];
  radiation: PainRadiationId | null;
  radiationDetail: string;
  /** Qué lo alivia. */
  relieves: string;
  /** Qué lo agrava. */
  aggravates: string;
}

export const EMPTY_PAIN_ASSESSMENT: PainAssessmentAnswers = {
  onset: '',
  onsetDate: null,
  locations: [],
  intensityEva: null,
  characteristics: [],
  radiation: null,
  radiationDetail: '',
  relieves: '',
  aggravates: '',
};

export function isPainAssessmentComplete(answers: PainAssessmentAnswers): boolean {
  return Boolean(
    answers.onset.trim() &&
      answers.locations.length > 0 &&
      answers.intensityEva != null &&
      answers.characteristics.length > 0 &&
      answers.radiation
  );
}

export function summarizePainAssessment(answers: PainAssessmentAnswers): string {
  const eva = answers.intensityEva != null ? `EVA ${answers.intensityEva}/10` : 'Sin EVA';
  const locs = answers.locations
    .map((id) => BODY_REGION_LABELS[id] ?? id)
    .slice(0, 3)
    .join(', ');
  const chars = answers.characteristics
    .map((id) => PAIN_CHARACTERISTICS.find((c) => c.id === id)?.label ?? id)
    .slice(0, 3)
    .join(', ');
  return `${eva}${locs ? ` · ${locs}` : ''}${chars ? ` · ${chars}` : ''}`;
}

export function painAssessmentScorePayload(answers: PainAssessmentAnswers) {
  return {
    kind: 'pain-assessment',
    onset: answers.onset.trim(),
    onsetDate: answers.onsetDate,
    locations: answers.locations,
    intensityEva: answers.intensityEva,
    characteristics: answers.characteristics,
    radiation: answers.radiation,
    radiationDetail: answers.radiationDetail.trim(),
    relieves: answers.relieves.trim(),
    aggravates: answers.aggravates.trim(),
    bandLabel:
      answers.intensityEva == null
        ? undefined
        : answers.intensityEva <= 3
          ? 'Dolor leve'
          : answers.intensityEva <= 6
            ? 'Dolor moderado'
            : 'Dolor severo',
  };
}
