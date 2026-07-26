import Link from 'next/link';
import { User, UserRole } from '@prisma/client';
import { getRoleLabel, getRoleNav } from '@/lib/auth/navigation';
import { PillNav, LocationCrumb } from '@/components/platform/sidebar-nav';
import { AccessibilityControls } from '@/components/platform/accessibility';

const ROLE_CONTEXT: Record<UserRole, string> = {
  ADMIN: 'Panel maestro de administración',
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

export function PlatformShell({ user, title, description, children }: PlatformShellProps) {
  const nav = getRoleNav(user.role);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Cabecera */}
      <header className="border-b border-lineStrong">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <Link href="/" className="font-display text-lg text-ink">
              HealthCloud
            </Link>
            <p className="mt-1 text-sm text-inkMuted">{ROLE_CONTEXT[user.role]}</p>
          </div>
          <div className="text-sm text-inkMuted sm:text-right">
            <p>{user.fullName ?? user.email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 sm:justify-end">
              <AccessibilityControls />
              <Link
                href="/profile"
                className="font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:text-ink"
              >
                Mi cuenta
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:text-ink"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 py-9 sm:px-8">
        {/* Tarjeta hero: ubicación, título y navegación por secciones */}
        <div className="rounded-2xl border border-line bg-surface px-6 py-6 sm:px-8">
          <LocationCrumb roleLabel={getRoleLabel(user.role)} items={nav} />
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-[34px]">{title}</h1>
          {description && (
            <p className="mt-3 max-w-3xl text-base leading-6 text-inkMuted">{description}</p>
          )}
          <PillNav items={nav} />
        </div>

        <div className="mt-6">{children}</div>
      </main>
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
    <div className={`rounded-2xl border border-line bg-surface ${className}`}>
      {children}
    </div>
  );
}

// "Surface" del prototipo: tarjeta con fila de título y contenido a sangre.
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
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex min-h-[68px] items-center justify-between gap-4 border-b border-line px-6 py-3">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-lineStrong bg-surface/50 px-6 py-10 text-center text-sm text-inkMuted">
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

// "Metric" del prototipo: etiqueta arriba, valor grande con detalle a la derecha.
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-bold text-inkMuted">{label}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-[32px] font-bold leading-none tracking-[-0.04em] text-ink">{value}</p>
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
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${colors[role]}`}
    >
      {getRoleLabel(role)}
    </span>
  );
}

const STATUS_TONES: Record<string, string> = {
  // Positivos
  ACTIVE: 'bg-emerald-50 text-[#176151]',
  CONFIRMED: 'bg-emerald-50 text-[#176151]',
  COMPLETED: 'bg-emerald-50 text-[#176151]',
  ACCEPTED: 'bg-emerald-50 text-[#176151]',
  // En espera
  PENDING: 'bg-amber-50 text-[#8a5e16]',
  REQUESTED: 'bg-amber-50 text-[#8a5e16]',
  IN_PROGRESS: 'bg-brand-light text-brand-mid',
  // Negativos
  BLOCKED: 'bg-red-50 text-accent',
  CANCELLED: 'bg-red-50 text-accent',
  REMOVED: 'bg-red-50 text-accent',
  EXPIRED: 'bg-red-50 text-accent',
  REVOKED: 'bg-red-50 text-accent',
  // Urgencia
  LOW: 'bg-emerald-50 text-[#176151]',
  MEDIUM: 'bg-amber-50 text-[#8a5e16]',
  HIGH: 'bg-amber-50 text-[#8a5e16]',
  EMERGENCY: 'bg-red-50 text-accent',
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
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
        STATUS_TONES[status] ?? 'bg-canvas text-inkMuted'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/**
 * Tabla de datos del prototipo: cabecera sobre fondo tenue, filas con
 * divisores y hover sutil. La primera columna va en negrita como ancla
 * de lectura; el resto en tono secundario.
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
    return <p className="px-6 py-10 text-center text-sm text-inkMuted">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[660px] text-left">
        <thead className="bg-[#f7f9f7] text-sm text-inkMuted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-3.5 font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.key} className="transition-colors duration-200 ease-out-soft hover:bg-[#fafbfa]">
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className={`px-6 py-4 text-sm ${index === 0 ? 'font-bold text-ink' : 'text-inkMuted'}`}
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
    <div className={`border-b border-line px-6 py-4 transition-colors duration-200 ease-out-soft last:border-b-0 hover:bg-[#fafbfa] ${className}`}>
      {children}
    </div>
  );
}
