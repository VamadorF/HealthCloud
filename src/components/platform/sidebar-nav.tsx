'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/auth/navigation';
import { ROLE_THEMES, type RoleTone } from '@/components/platform/role-theme';

/** Marcadores de sección activa por rol (pseudo-elemento del enlace). */
const ACTIVE_MARKERS: Record<RoleTone, string> = {
  admin: 'lg:before:bg-role-admin',
  organization: 'lg:before:bg-role-org',
  specialist: 'lg:before:bg-role-spec',
  patient: 'lg:before:bg-role-patient',
};

// Miga de ubicación: "Estás en: Rol / Sección". El segmento de línea en el
// color del rol conecta la miga con la franja de guía del borde izquierdo.
export function LocationCrumb({
  roleLabel,
  items,
  tone,
}: {
  roleLabel: string;
  items: NavItem[];
  tone: RoleTone;
}) {
  const pathname = usePathname();
  const theme = ROLE_THEMES[tone];
  const active = items.find((item) => item.href === pathname);

  return (
    <p className="flex min-w-0 items-center gap-2.5 text-sm text-inkMuted">
      <span aria-hidden="true" className={`h-[3px] w-6 shrink-0 rounded-full ${theme.line}`} />
      <span className="truncate">
        Estás en: <span className={`font-bold ${theme.text}`}>{roleLabel}</span>
        {active ? <span className="font-bold text-ink"> / {active.label}</span> : ''}
      </span>
    </p>
  );
}

/**
 * Navegación principal del rol. En escritorio es una columna dentro de la
 * barra lateral; en pantallas pequeñas se vuelve una fila desplazable.
 * La sección activa se marca con el fondo tenue del rol y, en escritorio,
 * con una barra que apunta hacia la línea de guía.
 */
export function SidebarNav({ items, tone }: { items: NavItem[]; tone: RoleTone }) {
  const pathname = usePathname();
  const theme = ROLE_THEMES[tone];

  return (
    <nav
      aria-label="Secciones de la cuenta"
      className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`relative shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-200 ease-out-soft lg:before:absolute lg:before:bottom-2 lg:before:left-0 lg:before:top-2 lg:before:w-[3px] lg:before:rounded-full lg:before:content-[''] ${
              active
                ? `font-bold text-ink ${theme.softBg} ${ACTIVE_MARKERS[tone]}`
                : 'font-medium text-inkMuted hover:bg-surface hover:text-ink lg:before:bg-transparent'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
