import Link from 'next/link';
import { DemoRole, DEMO_NAV, DEMO_USERS } from '@/lib/mock/demo-data';
import { SidebarNav, LocationCrumb } from '@/components/platform/sidebar-nav';
import { ROLE_THEMES } from '@/components/platform/role-theme';
import { AccessibilityControls } from '@/components/platform/accessibility';
import { GuidedTour } from '@/components/platform/guided-tour';

interface DemoShellProps {
  role: DemoRole;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ROLE_CONTEXT: Record<DemoRole, string> = {
  admin: 'Administración general',
  organization: 'Cuenta institucional',
  specialist: 'Cuenta profesional',
  patient: 'Cuenta personal',
};

/**
 * Versión de demostración del shell de "señalética clínica": misma franja de
 * guía por rol y barra lateral que el PlatformShell, con un selector para
 * cambiar de línea (de rol) sin salir de la demo.
 */
export function DemoShell({ role, title, subtitle, children }: DemoShellProps) {
  const user = DEMO_USERS[role];
  const nav = DEMO_NAV[role];
  const theme = ROLE_THEMES[role];

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
          <p className={`signage-label mt-1.5 ${theme.text}`}>{ROLE_CONTEXT[role]}</p>
        </div>

        <SidebarNav items={nav} tone={role} />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
            <p className="truncate text-xs text-inkMuted">
              {user.context} · Vista de demostración
            </p>
          </div>
          <RoleSwitcher current={role} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header
          data-tour="header"
          className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:px-8"
        >
          <LocationCrumb roleLabel={user.roleLabel} items={nav} tone={role} />
          <div className="flex shrink-0 items-center gap-2">
            <GuidedTour role={role} roleLabel={user.roleLabel} />
            <AccessibilityControls />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-[1.75rem] leading-tight text-ink sm:text-[2rem]">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-base leading-6 text-inkMuted">{subtitle}</p>}
          </div>
          <div data-tour="content" className="mt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Cambiar de rol es cambiar de línea: cada opción lleva su color de guía.
function RoleSwitcher({ current }: { current: DemoRole }) {
  const roles: { key: DemoRole; label: string; line: string }[] = [
    { key: 'admin', label: 'Admin', line: 'bg-role-admin' },
    { key: 'organization', label: 'Org', line: 'bg-role-org' },
    { key: 'specialist', label: 'Esp.', line: 'bg-role-spec' },
    { key: 'patient', label: 'Pac.', line: 'bg-role-patient' },
  ];

  return (
    <div className="flex shrink-0 gap-1 rounded-lg border border-line bg-sunken/60 p-1 text-xs">
      {roles.map((r) => (
        <Link
          key={r.key}
          href={`/demo/${r.key}`}
          aria-current={current === r.key ? 'page' : undefined}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md px-2 py-1.5 font-bold transition-colors duration-200 ease-out-soft ${
            current === r.key ? 'bg-surface text-ink shadow-card' : 'text-inkMuted hover:text-ink'
          }`}
        >
          {r.label}
          <span aria-hidden="true" className={`h-[3px] w-5 rounded-full ${r.line}`} />
        </Link>
      ))}
    </div>
  );
}

export function MetricGrid({ items }: { items: { label: string; value: string; delta?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-line bg-surface p-5 shadow-card">
          <p className="signage-label text-inkMuted">{item.label}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="font-display text-[1.875rem] leading-none tracking-tight text-ink tabular-nums">
              {item.value}
            </p>
            {item.delta && (
              <p className="max-w-[112px] text-right text-sm leading-5 text-inkMuted">{item.delta}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  action,
  flush = false,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  /** Contenido a sangre, sin relleno: para tablas y listas con divisores. */
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="flex min-h-[56px] items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 className="signage-label text-inkMuted">{title}</h2>
        {action}
      </div>
      {flush ? children : <div className="p-6">{children}</div>}
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Activa: 'bg-ok-soft text-ok',
    Activo: 'bg-ok-soft text-ok',
    Confirmada: 'bg-ok-soft text-ok',
    Pendiente: 'bg-warn-soft text-warn',
    Solicitada: 'bg-warn-soft text-warn',
    Revisión: 'bg-warn-soft text-warn',
    Invitada: 'bg-warn-soft text-warn',
    Invitado: 'bg-warn-soft text-warn',
    'En sala': 'bg-brand-light text-brand-mid',
    Media: 'bg-warn-soft text-warn',
    Baja: 'bg-ok-soft text-ok',
    Seguimiento: 'bg-ok-soft text-ok',
    Crónico: 'bg-warn-soft text-warn',
    Nuevo: 'bg-brand-light text-brand-mid',
  };

  return (
    <span
      className={`inline-flex h-fit shrink-0 self-start whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold ${
        styles[status] ?? 'bg-sunken text-inkMuted'
      }`}
    >
      {status}
    </span>
  );
}

export function BarChart({
  data,
  keys,
}: {
  data: Record<string, string | number>[];
  keys: { key: string; label: string; color: string }[];
}) {
  const max = Math.max(
    ...data.flatMap((row) => keys.map((k) => Number(row[k.key]) || 0))
  );

  return (
    <div className="space-y-4">
      {data.map((row) => (
        <div key={String(row.week)}>
          <div className="mb-2 flex justify-between text-xs text-inkMuted tabular-nums">
            <span>{row.week}</span>
          </div>
          <div className="flex h-8 gap-1">
            {keys.map((k) => {
              const val = Number(row[k.key]) || 0;
              const width = max ? (val / max) * 100 : 0;
              return (
                <div
                  key={k.key}
                  className={`${k.color} rounded-sm transition-all duration-300 ease-out-soft`}
                  style={{ width: `${width}%` }}
                  title={`${k.label}: ${val}`}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex gap-4 text-xs text-inkMuted">
        {keys.map((k) => (
          <span key={k.key} className="flex items-center gap-1.5">
            <span className={`inline-block h-[3px] w-4 rounded-full ${k.color}`} />
            {k.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TimelineItem({
  time,
  title,
  meta,
  status,
}: {
  time: string;
  title: string;
  meta: string;
  status?: string;
}) {
  return (
    <div className="flex gap-4 border-l-2 border-brand-soft pl-5 pb-6 last:pb-0">
      <div className="flex-1">
        <p className="font-display text-xs font-semibold text-brand-mid tabular-nums">{time}</p>
        <p className="mt-1 font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-inkMuted">{meta}</p>
      </div>
      {status && <StatusPill status={status} />}
    </div>
  );
}
