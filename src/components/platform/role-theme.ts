/**
 * Señalética por rol: como las franjas de color pintadas en los pasillos de
 * un hospital ("siga la línea verde"), cada rol tiene una línea de guía que
 * recorre el borde de la pantalla y marca la sección activa.
 *
 * Vive en un módulo sin 'use client' para poder usarse tanto en componentes
 * de servidor (los shells) como de cliente (la navegación). Tailwind necesita
 * las clases completas de forma estática, por eso el registro enumera cada
 * variante en lugar de interpolar el color.
 */
export type RoleTone = 'admin' | 'organization' | 'specialist' | 'patient';

export interface RoleTheme {
  /** Franja de guía y marcadores sólidos. */
  line: string;
  /** Texto en el color del rol. */
  text: string;
  /** Fondo tenue del rol (sección activa, chips). */
  softBg: string;
}

export const ROLE_THEMES: Record<RoleTone, RoleTheme> = {
  admin: {
    line: 'bg-role-admin',
    text: 'text-role-admin',
    softBg: 'bg-role-admin/10',
  },
  organization: {
    line: 'bg-role-org',
    text: 'text-role-org',
    softBg: 'bg-role-org/10',
  },
  specialist: {
    line: 'bg-role-spec',
    text: 'text-role-spec',
    softBg: 'bg-role-spec/10',
  },
  patient: {
    line: 'bg-role-patient',
    text: 'text-role-patient',
    softBg: 'bg-role-patient/10',
  },
};
