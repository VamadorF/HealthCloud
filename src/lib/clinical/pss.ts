/**
 * Escala de Estrés Percibido (PSS-14)
 * Versión española 2.0 de Cohen, Kamarck & Mermelstein (1983),
 * adaptada por Dr. Eduardo Remor.
 *
 * Likert 0–4. Ítems invertidos: 4, 5, 6, 7, 9, 10 y 13 (1-indexados).
 * Total: 0–56. A mayor puntuación, mayor estrés percibido.
 */

export const PSS_FREQUENCY_LABELS = [
  'Nunca',
  'Casi nunca',
  'De vez en cuando',
  'A menudo',
  'Muy a menudo',
] as const;

export type PssFrequency = 0 | 1 | 2 | 3 | 4;

/** Índices 0-based de ítems con puntuación invertida. */
export const PSS_REVERSE_INDEXES = [3, 4, 5, 6, 8, 9, 12] as const;

export interface PssItem {
  id: number;
  text: string;
  reverse: boolean;
}

export const PSS_ITEMS: PssItem[] = [
  {
    id: 1,
    text: 'En el último mes, ¿con qué frecuencia ha estado afectado por algo que ha ocurrido inesperadamente?',
    reverse: false,
  },
  {
    id: 2,
    text: 'En el último mes, ¿con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?',
    reverse: false,
  },
  {
    id: 3,
    text: 'En el último mes, ¿con qué frecuencia se ha sentido nervioso o estresado?',
    reverse: false,
  },
  {
    id: 4,
    text: 'En el último mes, ¿con qué frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?',
    reverse: true,
  },
  {
    id: 5,
    text: 'En el último mes, ¿con qué frecuencia ha sentido que ha afrontado efectivamente los cambios importantes que han estado ocurriendo en su vida?',
    reverse: true,
  },
  {
    id: 6,
    text: 'En el último mes, ¿con qué frecuencia ha estado seguro sobre su capacidad para manejar sus problemas personales?',
    reverse: true,
  },
  {
    id: 7,
    text: 'En el último mes, ¿con qué frecuencia ha sentido que las cosas le van bien?',
    reverse: true,
  },
  {
    id: 8,
    text: 'En el último mes, ¿con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?',
    reverse: false,
  },
  {
    id: 9,
    text: 'En el último mes, ¿con qué frecuencia ha podido controlar las dificultades de su vida?',
    reverse: true,
  },
  {
    id: 10,
    text: 'En el último mes, ¿con qué frecuencia ha sentido que tenía todo bajo control?',
    reverse: true,
  },
  {
    id: 11,
    text: 'En el último mes, ¿con qué frecuencia ha estado enfadado porque las cosas que le han ocurrido estaban fuera de su control?',
    reverse: false,
  },
  {
    id: 12,
    text: 'En el último mes, ¿con qué frecuencia ha pensado sobre las cosas que le quedan por hacer?',
    reverse: false,
  },
  {
    id: 13,
    text: 'En el último mes, ¿con qué frecuencia ha podido controlar la forma de pasar el tiempo?',
    reverse: true,
  },
  {
    id: 14,
    text: 'En el último mes, ¿con qué frecuencia ha sentido que las dificultades se acumulan tanto que no puede superarlas?',
    reverse: false,
  },
];

export type PssBand = 'low' | 'moderate' | 'high' | 'veryHigh';

export interface PssScoreResult {
  total: number;
  max: number;
  answered: number;
  complete: boolean;
  band: PssBand | null;
  bandLabel: string | null;
  /** Valor medio 0–4 para lectura clínica proporcional. */
  mean: number | null;
}

export function scorePssItem(raw: number, reverse: boolean): number {
  const clamped = Math.min(4, Math.max(0, raw));
  return reverse ? 4 - clamped : clamped;
}

export function computePssScore(answers: Array<number | null | undefined>): PssScoreResult {
  let total = 0;
  let answered = 0;

  PSS_ITEMS.forEach((item, index) => {
    const raw = answers[index];
    if (raw == null || Number.isNaN(raw)) return;
    answered += 1;
    total += scorePssItem(Number(raw), item.reverse);
  });

  const complete = answered === PSS_ITEMS.length;
  const mean = answered > 0 ? total / answered : null;
  const band = complete ? bandForTotal(total) : null;

  return {
    total,
    max: 56,
    answered,
    complete,
    band,
    bandLabel: band ? PSS_BAND_LABELS[band] : null,
    mean,
  };
}

/**
 * Bandas orientativas para apoyo clínico (no son puntos de corte diagnósticos
 * oficiales de Cohen). Se usan solo como referencia visual en la UI.
 */
export function bandForTotal(total: number): PssBand {
  if (total <= 18) return 'low';
  if (total <= 28) return 'moderate';
  if (total <= 38) return 'high';
  return 'veryHigh';
}

export const PSS_BAND_LABELS: Record<PssBand, string> = {
  low: 'Estrés percibido bajo',
  moderate: 'Estrés percibido moderado',
  high: 'Estrés percibido alto',
  veryHigh: 'Estrés percibido muy alto',
};

export const PSS_BAND_TONES: Record<PssBand, string> = {
  low: 'bg-ok-soft text-ok',
  moderate: 'bg-warn-soft text-warn',
  high: 'bg-warn-soft text-warn',
  veryHigh: 'bg-accent-soft text-accent',
};

export interface PssClinicalPayload {
  instrument: 'PSS-14';
  version: 'Remor-ES-2.0';
  answers: number[];
  total: number;
  band: PssBand;
  bandLabel: string;
  recordedAt: string;
}

export function buildPssPayload(answers: number[]): PssClinicalPayload | null {
  const result = computePssScore(answers);
  if (!result.complete || !result.band || !result.bandLabel) return null;
  return {
    instrument: 'PSS-14',
    version: 'Remor-ES-2.0',
    answers: answers.map((a) => Math.min(4, Math.max(0, Number(a)))),
    total: result.total,
    band: result.band,
    bandLabel: result.bandLabel,
    recordedAt: new Date().toISOString(),
  };
}
