import Link from 'next/link';
import { User, UserRole } from '@prisma/client';
import { getRoleLabel, getRoleNav } from '@/lib/auth/navigation';
import { SidebarNav, LocationCrumb } from '@/components/platform/sidebar-nav';
import { ROLE_THEMES } from '@/components/platform/role-theme';
import { AccessibilityControls } from '@/components/platform/accessibility';
import { GuidedTour } from '@/components/platform/guided-tour';
import { getTourRole } from '@/lib/tour/steps';

const ROLE_CONTEXT: Record<UserRole, string> = {
  ADMIN: 'Administración general',
  ORGANIZATION: 'Cuenta institucional',
  SPECIALIST: 'Cuenta profesional',
  PATIENT: 'Cuenta personal',
};

interface PlatformShellProps {
  user: User;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Estructura de "señalética clínica": la franja de color del rol recorre el
 * borde izquierdo (como la línea pintada en el pasillo de un hospital), la
 * barra lateral es el mapa del edificio y la cabecera confirma la ubicación.
 */
export function PlatformShell({ user, title, description, children }: PlatformShellProps) {
  const nav = getRoleNav(user.role);
  const tone = getTourRole(user.role);
  const theme = ROLE_THEMES[tone];

  return (
    <div className="relative min-h-screen bg-canvas lg:flex">
      {/* Línea de guía del rol */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 z-20 w-1 ${theme.line}`} />

      <aside
        data-tour="nav"
        className="flex flex-col gap-5 border-b border-line px-5 pb-4 pt-5 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:overflow-x-hidden lg:border-b-0 lg:border-r lg:px-6 lg:pb-6 lg:pt-7"
      >
        <div>
          <Link href="/" className="font-display text-lg text-ink">
            HealthCloud
          </Link>
          <p className={`signage-label mt-1.5 ${theme.text}`}>{ROLE_CONTEXT[user.role]}</p>
        </div>

        <SidebarNav items={nav} tone={tone} />

        <div className="flex items-center justify-between gap-4 border-t border-line pt-4 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-3">
          <p className="min-w-0 truncate text-sm font-bold text-ink">
            {user.fullName ?? user.email}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/profile"
              className="text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:text-ink"
            >
              Mi cuenta
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-bold text-inkMuted transition-colors duration-200 ease-out-soft hover:text-ink"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header
          data-tour="header"
          className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:px-8"
        >
          <LocationCrumb roleLabel={getRoleLabel(user.role)} items={nav} tone={tone} />
          <div className="flex shrink-0 items-center gap-2">
            <GuidedTour role={tone} roleLabel={getRoleLabel(user.role)} />
            <AccessibilityControls />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-[1.75rem] leading-tight text-ink sm:text-[2rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-base leading-6 text-inkMuted">{description}</p>
            )}
          </div>
          <div data-tour="content" className="mt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-line bg-surface shadow-card ${className}`}>
      {children}
    </div>
  );
}

// "Surface" del prototipo: tarjeta con fila de título y contenido a sangre.
// El título va como rótulo de señalética: corto, en mayúsculas, con tracking.
export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="flex min-h-[56px] items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 className="signage-label text-inkMuted">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-lineStrong bg-surface/50 px-6 py-10 text-center text-sm text-inkMuted">
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

// Placa de métrica: rótulo arriba, cifra grande en Archivo con números
// tabulares, detalle a la derecha en tono secundario.
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="signage-label text-inkMuted">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="font-display text-[1.875rem] leading-none tracking-tight text-ink tabular-nums">
          {value}
        </p>
        {hint && <p className="max-w-[112px] text-right text-sm leading-5 text-inkMuted">{hint}</p>}
      </div>
    </Card>
  );
}

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const colors: Record<UserRole, string> = {
    ADMIN: 'bg-role-admin/10 text-role-admin',
    ORGANIZATION: 'bg-role-org/10 text-role-org',
    SPECIALIST: 'bg-role-spec/10 text-role-spec',
    PATIENT: 'bg-role-patient/10 text-role-patient',
  };

  return (
    <span
      className={`inline-flex h-fit shrink-0 self-start whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold ${colors[role]}`}
    >
      {getRoleLabel(role)}
    </span>
  );
}

const STATUS_TONES: Record<string, string> = {
  // Positivos
  ACTIVE: 'bg-ok-soft text-ok',
  CONFIRMED: 'bg-ok-soft text-ok',
  COMPLETED: 'bg-ok-soft text-ok',
  ACCEPTED: 'bg-ok-soft text-ok',
  // En espera
  PENDING: 'bg-warn-soft text-warn',
  REQUESTED: 'bg-warn-soft text-warn',
  IN_PROGRESS: 'bg-brand-light text-brand-mid',
  // Negativos
  BLOCKED: 'bg-accent-soft text-accent',
  CANCELLED: 'bg-accent-soft text-accent',
  REMOVED: 'bg-accent-soft text-accent',
  EXPIRED: 'bg-accent-soft text-accent',
  REVOKED: 'bg-accent-soft text-accent',
  // Urgencia
  LOW: 'bg-ok-soft text-ok',
  MEDIUM: 'bg-warn-soft text-warn',
  HIGH: 'bg-warn-soft text-warn',
  EMERGENCY: 'bg-accent-soft text-accent',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activa',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Realizada',
  ACCEPTED: 'Aceptada',
  PENDING: 'Pendiente',
  REQUESTED: 'Solicitada',
  IN_PROGRESS: 'En curso',
  BLOCKED: 'Bloqueada',
  CANCELLED: 'Cancelada',
  REMOVED: 'Removido',
  EXPIRED: 'Expirada',
  REVOKED: 'Revocada',
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  EMERGENCY: 'Emergencia',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex h-fit shrink-0 self-start whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold ${
        STATUS_TONES[status] ?? 'bg-sunken text-inkMuted'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/**
 * Tabla de datos del prototipo: cabecera como rótulo de señalética sobre
 * fondo hundido, filas con divisores y hover sutil. La primera columna va
 * en negrita como ancla de lectura; el resto en tono secundario.
 */
export function DataTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: { key: string; cells: React.ReactNode[] }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-inkMuted">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[660px] text-left">
        <thead className="bg-sunken/60">
          <tr>
            {headers.map((header) => (
              <th key={header} className="signage-label px-5 py-3 text-inkMuted">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr
              key={row.key}
              className="transition-colors duration-200 ease-out-soft hover:bg-canvas/60"
            >
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className={`px-5 py-3.5 text-sm ${
                    index === 0 ? 'font-bold text-ink' : 'text-inkMuted'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Fila de lista al estilo del prototipo: contenido a sangre con divisores.
export function Row({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border-b border-line px-5 py-4 transition-colors duration-200 ease-out-soft last:border-b-0 hover:bg-canvas/60 ${className}`}
    >
      {children}
    </div>
  );
}
