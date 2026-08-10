import type { PcsBand } from '@/lib/clinical/pcs';
import type { PsqiBand } from '@/lib/clinical/psqi';
import type { PssBand } from '@/lib/clinical/pss';

export type DemoConsultationStatus = 'por_registrar' | 'registrada' | 'en_curso';

export type DemoConsultation = {
  id: string;
  patient: string;
  date: string;
  whenLabel: string;
  /** ISO-ish for sorting/filter "hoy" — relative labels stay human. */
  dayOffset: number;
  diagnosis: string;
  notes: string;
  vitals: string;
  status: DemoConsultationStatus;
  reason: string;
  pss?: { total: number; band: PssBand; bandLabel: string };
  psqi?: { global: number; band: PsqiBand; bandLabel: string };
  pcs?: { total: number; band: PcsBand; bandLabel: string };
};

/** Consultas demo suficientes para lista + detalle interactivo. */
export const DEMO_SPECIALIST_CONSULTATIONS: DemoConsultation[] = [
  {
    id: 'c-roberto',
    patient: 'Roberto Díaz',
    date: 'Hoy, 09:45',
    whenLabel: 'Hoy',
    dayOffset: 0,
    diagnosis: 'Diabetes tipo 2 — control trimestral',
    notes: 'HbA1c 6.8%. Mantener metformina 850mg. Reforzar plan alimentario.',
    vitals: 'PA 128/82 · FC 72',
    status: 'en_curso',
    reason: 'Seguimiento diabetes',
    pss: { total: 24, band: 'moderate', bandLabel: 'Estrés percibido moderado' },
    psqi: { global: 8, band: 'poor', bandLabel: 'Mala calidad de sueño' },
    pcs: { total: 34, band: 'clinical', bandLabel: 'Nivel clínicamente significativo' },
  },
  {
    id: 'c-camila',
    patient: 'Camila Soto',
    date: 'Hoy, 09:00',
    whenLabel: 'Hoy',
    dayOffset: 0,
    diagnosis: '',
    notes: '',
    vitals: 'PA 132/84 · FC 76',
    status: 'por_registrar',
    reason: 'Control hipertensión',
  },
  {
    id: 'c-maria',
    patient: 'María José Vera',
    date: 'Hoy, 10:30',
    whenLabel: 'Hoy',
    dayOffset: 0,
    diagnosis: '',
    notes: '',
    vitals: '',
    status: 'por_registrar',
    reason: 'Resultados laboratorio',
  },
  {
    id: 'c-felipe',
    patient: 'Felipe Arancibia',
    date: 'Hoy, 11:15',
    whenLabel: 'Hoy',
    dayOffset: 0,
    diagnosis: '',
    notes: '',
    vitals: '',
    status: 'por_registrar',
    reason: 'Dolor abdominal',
  },
  {
    id: 'c-elena',
    patient: 'Elena Vargas',
    date: 'Ayer, 16:30',
    whenLabel: 'Ayer',
    dayOffset: -1,
    diagnosis: 'Lumbalgia mecánica',
    notes: 'EVA 6/10. Indicar AINE corto y kinesiología. Reevaluar en 2 semanas.',
    vitals: 'PA 120/78 · FC 70',
    status: 'registrada',
    reason: 'Seguimiento dolor',
    pcs: { total: 28, band: 'elevated', bandLabel: 'Nivel elevado' },
  },
  {
    id: 'c-ana',
    patient: 'Ana Contreras',
    date: '3 Ago, 09:30',
    whenLabel: '3 Ago',
    dayOffset: -6,
    diagnosis: 'Control post-operatorio favorable',
    notes: 'Herida limpia. Retiro de puntos en 10 días.',
    vitals: 'PA 118/74 · FC 68',
    status: 'registrada',
    reason: 'Post-operatorio',
  },
  {
    id: 'c-luis',
    patient: 'Luis Herrera',
    date: '3 Ago, 11:00',
    whenLabel: '3 Ago',
    dayOffset: -6,
    diagnosis: 'Hipotiroidismo compensado',
    notes: 'TSH en rango. Mantener levotiroxina.',
    vitals: 'PA 124/80 · FC 64',
    status: 'registrada',
    reason: 'Revisión de exámenes',
  },
  {
    id: 'c-patricia',
    patient: 'Patricia Núñez',
    date: '4 Ago, 10:00',
    whenLabel: '4 Ago',
    dayOffset: -5,
    diagnosis: '',
    notes: '',
    vitals: '',
    status: 'por_registrar',
    reason: 'Primera consulta',
  },
  {
    id: 'c-diego',
    patient: 'Diego Salinas',
    date: '5 Ago, 15:00',
    whenLabel: '5 Ago',
    dayOffset: -4,
    diagnosis: 'EPOC estable',
    notes: 'Sin exacerbaciones. Reforzar inhalador de rescate.',
    vitals: 'SatO₂ 96% · FC 78',
    status: 'registrada',
    reason: 'Control crónico',
  },
  {
    id: 'c-javier',
    patient: 'Javier Moya',
    date: '28 Jul, 11:30',
    whenLabel: '28 Jul',
    dayOffset: -12,
    diagnosis: 'HTA controlada',
    notes: 'Ajuste de dosis de enalapril. Control en 1 mes.',
    vitals: 'PA 136/88 · FC 74',
    status: 'registrada',
    reason: 'Control PA',
  },
  {
    id: 'c-sofia',
    patient: 'Sofía Reyes',
    date: '1 Ago, 14:00',
    whenLabel: '1 Ago',
    dayOffset: -8,
    diagnosis: '',
    notes: '',
    vitals: '',
    status: 'por_registrar',
    reason: 'Ingreso',
    pss: { total: 32, band: 'high', bandLabel: 'Estrés percibido alto' },
  },
  {
    id: 'c-manuel',
    patient: 'Manuel Castro',
    date: '22 Jul, 09:15',
    whenLabel: '22 Jul',
    dayOffset: -18,
    diagnosis: 'ICC compensada',
    notes: 'Sin edema. Mantener diurético. Ecocardio en 6 meses.',
    vitals: 'PA 110/70 · FC 66',
    status: 'registrada',
    reason: 'Cardiología',
  },
  {
    id: 'c-gabriela',
    patient: 'Gabriela Ortiz',
    date: '29 Jul, 16:00',
    whenLabel: '29 Jul',
    dayOffset: -11,
    diagnosis: 'Migraña sin aura',
    notes: 'Iniciar profilaxis. Diario de cefalea.',
    vitals: 'PA 116/72 · FC 70',
    status: 'registrada',
    reason: 'Migraña',
  },
  {
    id: 'c-nicolas',
    patient: 'Nicolás Ríos',
    date: '7 Ago, 10:45',
    whenLabel: '7 Ago',
    dayOffset: -2,
    diagnosis: '',
    notes: '',
    vitals: '',
    status: 'por_registrar',
    reason: 'Asma · primera visita',
  },
];

export const DEMO_CONSULTATION_FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'hoy', label: 'Hoy' },
  { id: 'por_registrar', label: 'Por registrar' },
  { id: 'en_curso', label: 'En curso' },
  { id: 'registrada', label: 'Registradas' },
] as const;

export type DemoConsultationFilterId = (typeof DEMO_CONSULTATION_FILTERS)[number]['id'];
