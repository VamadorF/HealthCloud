export type DemoRole = 'admin' | 'organization' | 'specialist' | 'patient';

export interface DemoUser {
  name: string;
  email: string;
  role: DemoRole;
  roleLabel: string;
  initials: string;
  context: string;
}

export const DEMO_USERS: Record<DemoRole, DemoUser> = {
  admin: {
    name: 'Valentina Rojas',
    email: 'v.rojas@healthcloud.cl',
    role: 'admin',
    roleLabel: 'Administradora',
    initials: 'VR',
    context: 'Operaciones centrales',
  },
  organization: {
    name: 'Clínica Andes Norte',
    email: 'contacto@andesnorte.cl',
    role: 'organization',
    roleLabel: 'Organización',
    initials: 'AN',
    context: 'Centro médico · Providencia',
  },
  specialist: {
    name: 'Dr. Tomás Figueroa',
    email: 't.figueroa@andesnorte.cl',
    role: 'specialist',
    roleLabel: 'Especialista',
    initials: 'TF',
    context: 'Medicina interna',
  },
  patient: {
    name: 'Camila Soto',
    email: 'camila.soto@email.com',
    role: 'patient',
    roleLabel: 'Paciente',
    initials: 'CS',
    context: 'Plan familiar',
  },
};

export const DEMO_NAV: Record<DemoRole, { href: string; label: string }[]> = {
  admin: [
    { href: '/demo/admin', label: 'Resumen' },
    { href: '/demo/admin/organizations', label: 'Organizaciones' },
    { href: '/demo/admin/reports', label: 'Reportes' },
    { href: '/demo/admin/invitations', label: 'Invitaciones' },
    { href: '/demo/admin/settings', label: 'Ajustes' },
  ],
  organization: [
    { href: '/demo/organization', label: 'Resumen' },
    { href: '/demo/organization/profile', label: 'Perfil corporativo' },
    { href: '/demo/organization/specialists', label: 'Especialistas' },
    { href: '/demo/organization/settings', label: 'Ajustes' },
  ],
  specialist: [
    { href: '/demo/specialist', label: 'Agenda' },
    { href: '/demo/specialist/consultations', label: 'Consultas' },
    { href: '/demo/specialist/patients', label: 'Pacientes' },
    { href: '/demo/specialist/settings', label: 'Ajustes' },
  ],
  patient: [
    { href: '/demo/patient', label: 'Inicio' },
    { href: '/demo/patient/appointments', label: 'Mis citas' },
    { href: '/demo/patient/symptoms', label: 'Síntomas' },
    { href: '/demo/patient/surveys', label: 'Encuestas' },
    { href: '/demo/patient/history', label: 'Historial' },
    { href: '/demo/patient/settings', label: 'Ajustes' },
  ],
};

export const ADMIN_STATS = [
  { label: 'Organizaciones activas', value: '24', delta: '+3 este mes' },
  { label: 'Usuarios en plataforma', value: '1.842', delta: '68 en línea ahora' },
  { label: 'Citas esta semana', value: '412', delta: '12% vs semana anterior' },
  { label: 'Tasa de resolución', value: '94%', delta: 'Consultas completadas' },
];

export const ADMIN_ORGS = [
  { name: 'Clínica Andes Norte', city: 'Santiago', specialists: 18, status: 'Activa', since: 'Mar 2024' },
  { name: 'Centro Médico del Valle', city: 'Concepción', specialists: 11, status: 'Activa', since: 'Jun 2024' },
  { name: 'Red Salud Austral', city: 'Puerto Montt', specialists: 7, status: 'Revisión', since: 'Ene 2025' },
  { name: 'Hospital del Cobre', city: 'Calama', specialists: 0, status: 'Invitada', since: 'Abr 2025' },
];

export const ADMIN_REPORT_WEEKS = [
  { week: 'Sem 14', users: 72, appointments: 98, consultations: 81 },
  { week: 'Sem 15', users: 78, appointments: 104, consultations: 89 },
  { week: 'Sem 16', users: 85, appointments: 112, consultations: 95 },
  { week: 'Sem 17', users: 91, appointments: 118, consultations: 102 },
];

export const ORG_SPECIALISTS = [
  { name: 'Dra. Paula Muñoz', specialty: 'Cardiología', patients: 142, status: 'Activa' },
  { name: 'Dr. Tomás Figueroa', specialty: 'Medicina interna', patients: 98, status: 'Activa' },
  { name: 'Dra. Ignacia Leiva', specialty: 'Dermatología', patients: 76, status: 'Activa' },
  { name: 'Dr. Andrés Pino', specialty: 'Traumatología', patients: 0, status: 'Invitado' },
];

export const SPECIALIST_AGENDA = [
  { time: '09:00', patient: 'Camila Soto', reason: 'Control hipertensión', room: 'Box 3', status: 'Confirmada' },
  { time: '09:45', patient: 'Roberto Díaz', reason: 'Seguimiento diabetes', room: 'Box 3', status: 'En sala' },
  { time: '10:30', patient: 'María José Vera', reason: 'Resultados laboratorio', room: 'Box 5', status: 'Confirmada' },
  { time: '11:15', patient: 'Felipe Arancibia', reason: 'Dolor abdominal', room: 'Box 3', status: 'Solicitada' },
];

/** Citas extra de la semana demo para poblar la vista calendario. */
export const SPECIALIST_WEEK_EXTRAS = [
  { dayOffset: 1, time: '09:30', patient: 'Ana Contreras', reason: 'Control post-operatorio', room: 'Box 3', status: 'Confirmada' },
  { dayOffset: 1, time: '11:00', patient: 'Luis Herrera', reason: 'Revisión de exámenes', room: 'Box 3', status: 'Confirmada' },
  { dayOffset: 2, time: '10:00', patient: 'Patricia Núñez', reason: 'Primera consulta', room: 'Box 5', status: 'Solicitada' },
  { dayOffset: 3, time: '15:00', patient: 'Diego Salinas', reason: 'Control crónico', room: 'Box 3', status: 'Confirmada' },
  { dayOffset: -1, time: '16:30', patient: 'Elena Vargas', reason: 'Seguimiento dolor', room: 'Box 3', status: 'Confirmada' },
] as const;

export const PATIENT_APPOINTMENTS = [
  { date: 'Hoy, 09:00', doctor: 'Dr. Tomás Figueroa', place: 'Clínica Andes Norte', status: 'Confirmada' },
  { date: '18 Abr, 11:30', doctor: 'Dra. Paula Muñoz', place: 'Clínica Andes Norte', status: 'Pendiente' },
];

export const PATIENT_HISTORY = [
  { date: '12 Mar 2025', title: 'Control rutinario', doctor: 'Dr. Tomás Figueroa', summary: 'Presión arterial dentro de rango. Se mantiene tratamiento actual.' },
  { date: '28 Ene 2025', title: 'Exámenes de sangre', doctor: 'Dra. Paula Muñoz', summary: 'Perfil lipídico estable. Próximo control en 6 meses.' },
  { date: '05 Nov 2024', title: 'Consulta por migraña', doctor: 'Dr. Tomás Figueroa', summary: 'Cefalea tensional. Recomendación de hidratación y registro de desencadenantes.' },
];

export const PATIENT_SYMPTOMS = [
  {
    date: 'Ayer, 22:14',
    level: 'Media',
    text: 'Dolor de cabeza persistente desde la tarde, sin fiebre.',
    painScore: 5,
    bodyAreas: ['cabeza'],
  },
  {
    date: '03 Abr, 08:02',
    level: 'Baja',
    text: 'Ligera fatiga tras cambio de medicación.',
    painScore: 2,
    bodyAreas: ['generalizado'],
  },
];

export const ARCHITECTURE_LAYERS = [
  {
    title: 'Capa de presentación',
    items: ['Next.js App Router', 'Interfaces por rol', 'Componentes reutilizables'],
    color: 'bg-brand-light border-brand-soft',
  },
  {
    title: 'Capa de aplicación',
    items: ['Server Actions', 'RBAC por rol', 'Validación Zod'],
    color: 'bg-brand-light border-brand-soft',
  },
  {
    title: 'Capa de datos',
    items: ['Prisma ORM', 'PostgreSQL', 'JSON clínico'],
    color: 'bg-white border-line',
  },
  {
    title: 'Servicios externos',
    items: ['Supabase Auth', 'Supabase Storage', 'Resend · Sentry'],
    color: 'bg-white border-line',
  },
];
