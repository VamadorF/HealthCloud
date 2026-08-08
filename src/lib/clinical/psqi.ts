/**
 * Índice de Calidad del Sueño de Pittsburgh (PSQI)
 * Buysse et al. (1989). Estructura alineada a la calculadora clínica
 * (ventana de sueño + alteraciones + resumen) con scoring de 7 componentes (0–21).
 */

export const PSQI_FREQ_LABELS = [
  'Ninguna vez en el último mes',
  'Menos de una vez por semana',
  'Una o dos veces por semana',
  'Tres o más veces por semana',
] as const;

export const PSQI_QUALITY_LABELS = [
  'Muy buena',
  'Bastante buena',
  'Bastante mala',
  'Muy mala',
] as const;

export const PSQI_ENTHUSIASM_LABELS = [
  'Ningún problema',
  'Solo un problema leve',
  'Algo de problema',
  'Un problema muy grande',
] as const;

export const PSQI_DISTURBANCES = [
  { id: 'a', text: '…no podías quedarte dormido en 30 minutos' },
  { id: 'b', text: '…te despertabas a media noche o de madrugada' },
  { id: 'c', text: '…tenías que levantarte al baño' },
  { id: 'd', text: '…no podías respirar con comodidad' },
  { id: 'e', text: '…tosías o roncabas fuerte' },
  { id: 'f', text: '…tenías frío' },
  { id: 'g', text: '…tenías calor' },
  { id: 'h', text: '…tenías pesadillas' },
  { id: 'i', text: '…tenías dolor' },
  { id: 'j', text: '…otro(s) motivo(s)' },
] as const;

export type PsqiFreq = 0 | 1 | 2 | 3;

export interface PsqiAnswers {
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  latencyMinutes: number | null;
  hoursSlept: number | null;
  disturbances: Array<PsqiFreq | null>; // 10 items a–j
  sleepQuality: PsqiFreq | null;
  medication: PsqiFreq | null;
  stayAwake: PsqiFreq | null;
  enthusiasm: PsqiFreq | null;
}

export const EMPTY_PSQI_ANSWERS: PsqiAnswers = {
  bedtime: '23:00',
  wakeTime: '07:00',
  latencyMinutes: null,
  hoursSlept: null,
  disturbances: Array.from({ length: 10 }, () => null),
  sleepQuality: null,
  medication: null,
  stayAwake: null,
  enthusiasm: null,
};

export type PsqiBand = 'good' | 'poor';

export interface PsqiComponentScore {
  id: string;
  label: string;
  score: number;
}

export interface PsqiScoreResult {
  complete: boolean;
  global: number;
  max: number;
  band: PsqiBand | null;
  bandLabel: string | null;
  components: PsqiComponentScore[];
  efficiencyPercent: number | null;
  hoursInBed: number | null;
}

function parseTimeToHours(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h + m / 60;
}

/** Horas en cama considerando cruce de medianoche. */
export function hoursInBed(bedtime: string, wakeTime: string): number | null {
  const bed = parseTimeToHours(bedtime);
  const wake = parseTimeToHours(wakeTime);
  if (bed == null || wake == null) return null;
  let diff = wake - bed;
  if (diff <= 0) diff += 24;
  return diff;
}

function latencyComponentScore(minutes: number): number {
  if (minutes <= 15) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  return 3;
}

function durationComponentScore(hours: number): number {
  if (hours > 7) return 0;
  if (hours >= 6) return 1;
  if (hours >= 5) return 2;
  return 3;
}

function efficiencyComponentScore(percent: number): number {
  if (percent > 85) return 0;
  if (percent >= 75) return 1;
  if (percent >= 65) return 2;
  return 3;
}

function mapSumTo03(sum: number, bands: [number, number, number]): number {
  if (sum <= 0) return 0;
  if (sum <= bands[0]) return 1;
  if (sum <= bands[1]) return 2;
  return 3;
}

export function computePsqiScore(answers: PsqiAnswers): PsqiScoreResult {
  const hib = hoursInBed(answers.bedtime, answers.wakeTime);
  const latency = answers.latencyMinutes;
  const slept = answers.hoursSlept;
  const dist = answers.disturbances;

  const windowComplete =
    hib != null &&
    latency != null &&
    !Number.isNaN(latency) &&
    slept != null &&
    !Number.isNaN(slept) &&
    slept > 0;

  const distComplete = dist.every((d) => d != null);
  const summaryComplete =
    answers.sleepQuality != null &&
    answers.medication != null &&
    answers.stayAwake != null &&
    answers.enthusiasm != null;

  const complete = Boolean(windowComplete && distComplete && summaryComplete);

  if (!complete || hib == null || latency == null || slept == null) {
    return {
      complete: false,
      global: 0,
      max: 21,
      band: null,
      bandLabel: null,
      components: [],
      efficiencyPercent: hib && slept ? Math.min(100, (slept / hib) * 100) : null,
      hoursInBed: hib,
    };
  }

  const efficiency = Math.min(100, (slept / hib) * 100);

  // C1: calidad subjetiva (Q6)
  const c1 = answers.sleepQuality as number;

  // C2: latencia = score(minutos) + Q5a, mapeado a 0–3
  const c2raw = latencyComponentScore(latency) + (dist[0] as number);
  const c2 = mapSumTo03(c2raw, [2, 4, 6]);

  // C3: duración
  const c3 = durationComponentScore(slept);

  // C4: eficiencia
  const c4 = efficiencyComponentScore(efficiency);

  // C5: alteraciones Q5b–j (sin 5a)
  const c5sum = dist.slice(1).reduce<number>((acc, v) => acc + (v as number), 0);
  const c5 = mapSumTo03(c5sum, [9, 18, 27]);

  // C6: medicación
  const c6 = answers.medication as number;

  // C7: disfunción diurna
  const c7raw = (answers.stayAwake as number) + (answers.enthusiasm as number);
  const c7 = mapSumTo03(c7raw, [2, 4, 6]);

  const components: PsqiComponentScore[] = [
    { id: 'c1', label: 'Calidad subjetiva', score: c1 },
    { id: 'c2', label: 'Latencia', score: c2 },
    { id: 'c3', label: 'Duración', score: c3 },
    { id: 'c4', label: 'Eficiencia', score: c4 },
    { id: 'c5', label: 'Alteraciones', score: c5 },
    { id: 'c6', label: 'Medicación', score: c6 },
    { id: 'c7', label: 'Disfunción diurna', score: c7 },
  ];

  const global = components.reduce((acc, c) => acc + c.score, 0);
  const band: PsqiBand = global > 5 ? 'poor' : 'good';

  return {
    complete: true,
    global,
    max: 21,
    band,
    bandLabel: band === 'good' ? 'Buen dormidor' : 'Mala calidad de sueño',
    components,
    efficiencyPercent: Math.round(efficiency),
    hoursInBed: Math.round(hib * 10) / 10,
  };
}

export const PSQI_BAND_TONES: Record<PsqiBand, string> = {
  good: 'bg-ok-soft text-ok',
  poor: 'bg-warn-soft text-warn',
};
