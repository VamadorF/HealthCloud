import { UserRole } from '@prisma/client';

export type TourRole = 'admin' | 'organization' | 'specialist' | 'patient';

export interface TourStep {
  title: string;
  body: string;
}

/**
 * Tres pasos por rol, alineados con las tres regiones de la interfaz:
 * cabecera, navegación por secciones y área de contenido.
 */
export const TOUR_STEPS: Record<TourRole, TourStep[]> = {
  admin: [
    {
      title: 'Estás en el panel maestro',
      body: 'La cabecera confirma el acceso de administración global. Desde aquí abres esta guía y los ajustes de lectura.',
    },
    {
      title: 'Navega por el control global',
      body: 'Estas secciones separan el resumen, las organizaciones registradas, los reportes de uso y las invitaciones enviadas.',
    },
    {
      title: 'Revisa y actúa',
      body: 'Aquí aparecen los datos y las acciones de la sección actual. Bloquear una organización o generar un reporte afecta a toda la plataforma.',
    },
  ],
  organization: [
    {
      title: 'Reconoce el espacio institucional',
      body: 'La cabecera identifica la cuenta de tu organización y da acceso a esta guía y a las opciones de lectura.',
    },
    {
      title: 'Gestiona la operación',
      body: 'Estas secciones reúnen la visión general del centro, el perfil corporativo y la plantilla médica.',
    },
    {
      title: 'Revisa los datos de tu centro',
      body: 'En esta área se muestran los indicadores y las acciones de gestión de la sección que has seleccionado.',
    },
  ],
  specialist: [
    {
      title: 'Reconoce tu espacio profesional',
      body: 'La cabecera identifica tu cuenta de especialista y da acceso a esta guía y a las opciones de lectura.',
    },
    {
      title: 'Organiza la jornada',
      body: 'Usa estas secciones para cambiar entre la agenda del día, las consultas clínicas y tus pacientes.',
    },
    {
      title: 'Trabaja sobre la información clínica',
      body: 'Aquí aparecen las atenciones y las acciones disponibles en esta pantalla, como confirmar una cita o registrar una consulta.',
    },
  ],
  patient: [
    {
      title: 'Reconoce tu cuenta',
      body: 'La cabecera confirma que estás en tu cuenta personal. Desde aquí puedes abrir esta guía o ajustar el tamaño del texto.',
    },
    {
      title: 'Elige una sección',
      body: 'Estas opciones te llevan a solicitar una hora, registrar síntomas y revisar tu historial. La opción marcada indica dónde estás ahora.',
    },
    {
      title: 'Consulta tu información',
      body: 'Aquí encontrarás los datos y las acciones de esta pantalla. No se realiza ningún cambio sin tu confirmación.',
    },
  ],
};

const ROLE_MAP: Record<UserRole, TourRole> = {
  ADMIN: 'admin',
  ORGANIZATION: 'organization',
  SPECIALIST: 'specialist',
  PATIENT: 'patient',
};

export function getTourRole(role: UserRole): TourRole {
  return ROLE_MAP[role];
}
