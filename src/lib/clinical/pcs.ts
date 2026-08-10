/**
 * Escala de Catastrofización del Dolor (PCS)
 * Sullivan, Bishop & Pivik (1995). Versión española clínica (13 ítems).
 * Likert 0–4. Total 0–52. >30 = catastrofización clínicamente significativa.
 *
 * Subescalas (1-indexadas):
 * - Rumiación: 8, 9, 10, 11
 * - Magnificación: 6, 7, 13
 * - Impotencia / desesperanza: 1, 2, 3, 4, 5, 12
 */

export const PCS_FREQUENCY_LABELS = [
  'En absoluto',
  'Un poco',
  'Moderadamente',
  'Bastante',
  'Siempre',
] as const;

export type PcsFrequency = 0 | 1 | 2 | 3 | 4;

export type PcsSubscale = 'rumination' | 'magnification' | 'helplessness';

export interface PcsItem {
  id: number;
  text: string;
  subscale: PcsSubscale;
}

export const PCS_ITEMS: PcsItem[] = [
  {
    id: 1,
    text: 'Estoy preocupado todo el tiempo pensando si el dolor desaparecerá',
    subscale: 'helplessness',
  },
  {
    id: 2,
    text: 'Siento que ya no puedo más',
    subscale: 'helplessness',
  },
  {
    id: 3,
    text: 'Es terrible y pienso que esto ya no va a mejorar nunca',
    subscale: 'helplessness',
  },
  {
    id: 4,
    text: 'Es horrible y siento que esto es más fuerte que yo',
    subscale: 'helplessness',
  },
  {
    id: 5,
    text: 'Siento que no puedo soportarlo más',
    subscale: 'helplessness',
  },
  {
    id: 6,
    text: 'Temo que el dolor empeore',
    subscale: 'magnification',
  },
  {
    id: 7,
    text: 'No dejo de pensar en otras situaciones en las que experimento dolor',
    subscale: 'magnification',
  },
  {
    id: 8,
    text: 'Deseo desesperadamente que desaparezca el dolor',
    subscale: 'rumination',
  },
  {
    id: 9,
    text: 'No puedo apartar el dolor de mi mente',
    subscale: 'rumination',
  },
  {
    id: 10,
    text: 'No dejo de pensar en lo mucho que me duele',
    subscale: 'rumination',
  },
  {
    id: 11,
    text: 'No dejo de pensar en lo mucho que deseo que desaparezca el dolor',
    subscale: 'rumination',
  },
  {
    id: 12,
    text: 'No hay nada que pueda hacer para aliviar la intensidad del dolor',
    subscale: 'helplessness',
  },
  {
    id: 13,
    text: 'Me pregunto si me puede pasar algo grave',
    subscale: 'magnification',
  },
];

export const PCS_SUBSCALE_META: Record<
  PcsSubscale,
  { label: string; max: number; itemIds: number[] }
> = {
  rumination: { label: 'Rumiación', max: 16, itemIds: [8, 9, 10, 11] },
  magnification: { label: 'Magnificación', max: 12, itemIds: [6, 7, 13] },
  helplessness: { label: 'Impotencia', max: 24, itemIds: [1, 2, 3, 4, 5, 12] },
};

export type PcsBand = 'low' | 'elevated' | 'clinical';

export interface PcsScoreResult {
  total: number;
  max: number;
  answered: number;
  complete: boolean;
  band: PcsBand | null;
  bandLabel: string | null;
  subscales: Record<PcsSubscale, number>;
}

export function computePcsScore(
  answers: Array<number | null | undefined>
): PcsScoreResult {
  let total = 0;
  let answered = 0;
  const subscales: Record<PcsSubscale, number> = {
    rumination: 0,
    magnification: 0,
    helplessness: 0,
  };

  PCS_ITEMS.forEach((item, index) => {
    const raw = answers[index];
    if (raw == null || Number.isNaN(Number(raw))) return;
    const value = Math.min(4, Math.max(0, Number(raw)));
    answered += 1;
    total += value;
    subscales[item.subscale] += value;
  });

  const complete = answered === PCS_ITEMS.length;
  const band = complete ? bandForTotal(total) : null;

  return {
    total,
    max: 52,
    answered,
    complete,
    band,
    bandLabel: band ? PCS_BAND_LABELS[band] : null,
    subscales,
  };
}

/** >30 = clínicamente significativo (Sullivan / Physiotutors). */
export function bandForTotal(total: number): PcsBand {
  if (total > 30) return 'clinical';
  if (total >= 20) return 'elevated';
  return 'low';
}

export const PCS_BAND_LABELS: Record<PcsBand, string> = {
  low: 'Catastrofización baja',
  elevated: 'Catastrofización elevada',
  clinical: 'Nivel clínicamente significativo',
};

export const PCS_BAND_TONES: Record<PcsBand, string> = {
  low: 'bg-ok-soft text-ok',
  elevated: 'bg-warn-soft text-warn',
  clinical: 'bg-accent-soft text-accent',
};
