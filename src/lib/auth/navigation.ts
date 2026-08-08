import { UserRole } from '@prisma/client';
import { ROLE_LABELS } from '@/lib/auth/roles';

export interface NavItem {
  href: string;
  label: string;
}

export const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { href: '/admin', label: 'Panel' },
    { href: '/admin/organizations', label: 'Organizaciones' },
    { href: '/admin/reports', label: 'Reportes' },
    { href: '/admin/invitations', label: 'Invitaciones' },
    { href: '/settings', label: 'Ajustes' },
  ],
  ORGANIZATION: [
    { href: '/organization', label: 'Panel' },
    { href: '/organization/profile', label: 'Perfil corporativo' },
    { href: '/organization/specialists', label: 'Especialistas' },
    { href: '/settings', label: 'Ajustes' },
  ],
  SPECIALIST: [
    { href: '/specialist', label: 'Agenda' },
    { href: '/specialist/consultations', label: 'Consultas' },
    { href: '/specialist/patients', label: 'Pacientes' },
    { href: '/settings', label: 'Ajustes' },
  ],
  PATIENT: [
    { href: '/patient', label: 'Inicio' },
    { href: '/patient/appointments', label: 'Solicitar hora' },
    { href: '/patient/symptoms', label: 'Registrar síntomas' },
    { href: '/patient/history', label: 'Historial médico' },
    { href: '/settings', label: 'Ajustes' },
  ],
};

export function getRoleNav(role: UserRole) {
  return ROLE_NAV_ITEMS[role];
}

export function getRoleLabel(role: UserRole) {
  return ROLE_LABELS[role];
}
