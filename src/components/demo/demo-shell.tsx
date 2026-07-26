import Link from 'next/link';
import { DemoRole, DEMO_NAV, DEMO_USERS } from '@/lib/mock/demo-data';
import { PillNav, LocationCrumb } from '@/components/platform/sidebar-nav';

interface DemoShellProps {
  role: DemoRole;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ROLE_CONTEXT: Record<DemoRole, string> = {
  admin: 'Panel maestro de administración',
  organization: 'Cuenta institucional',
  specialist: 'Cuenta profesional',
  patient: 'Cuenta personal',
};

export function DemoShell({ role, title, subtitle, children }: DemoShellProps) {
  const user = DEMO_USERS[role];
  const nav = DEMO_NAV[role];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Cabecera */}
      <header className="border-b border-lineStrong">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <Link href="/" className="font-display text-lg text-ink">
              HealthCloud
            </Link>
            <p className="mt-1 text-sm text-inkMuted">
              {ROLE_CONTEXT[role]} · Vista de demostración
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-sm text-inkMuted">
              {user.name} · {user.context}
            </p>
            <RoleSwitcher current={role} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 py-9 sm:px-8">
        {/* Tarjeta hero: ubicación, título y navegación por secciones */}
        <div className="rounded-2xl border border-line bg-surface px-6 py-6 sm:px-8">
          <LocationCrumb roleLabel={user.roleLabel} items={nav} />
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-[34px]">{title}</h1>
          {subtitle && (
            <p className="mt-3 max-w-3xl text-base leading-6 text-inkMuted">{subtitle}</p>
          )}
          <PillNav items={nav} />
        </div>

        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

function RoleSwitcher({ current }: { current: DemoRole }) {
  const roles: { key: DemoRole; label: string }[] = [
    { key: 'admin', label: 'Admin' },
    { key: 'organization', label: 'Org' },
    { key: 'specialist', label: 'Esp.' },
    { key: 'patient', label: 'Pac.' },
  ];

  return (
    <div className="flex shrink-0 gap-1 rounded-2xl border border-line bg-surface p-1 text-xs">
      {roles.map((r) => (
        <Link
          key={r.key}
          href={`/demo/${r.key}`}
          className={`rounded-lg px-3 py-1.5 font-bold transition-colors duration-200 ease-out-soft ${
            current === r.key ? 'bg-brand text-white' : 'text-inkMuted hover:text-ink'
          }`}
        >
          {r.label}
        </Link>
      ))}
    </div>
  );
}

export function MetricGrid({ items }: { items: { label: string; value: string; delta?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm font-bold text-inkMuted">{item.label}</p>
          <div className="mt-5 flex items-end justify-between gap-3">
            <p className="text-[32px] font-bold leading-none tracking-[-0.04em] text-ink">
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
      <div className="p-6">{children}</div>
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Activa: 'bg-emerald-50 text-[#176151]',
    Activo: 'bg-emerald-50 text-[#176151]',
    Confirmada: 'bg-emerald-50 text-[#176151]',
    Pendiente: 'bg-amber-50 text-[#8a5e16]',
    Solicitada: 'bg-amber-50 text-[#8a5e16]',
    Revisión: 'bg-amber-50 text-[#8a5e16]',
    Invitada: 'bg-amber-50 text-[#8a5e16]',
    Invitado: 'bg-amber-50 text-[#8a5e16]',
    'En sala': 'bg-brand-light text-brand-mid',
    Media: 'bg-amber-50 text-[#8a5e16]',
    Baja: 'bg-emerald-50 text-[#176151]',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] ?? 'bg-canvas text-inkMuted'}`}>
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
          <div className="mb-2 flex justify-between text-xs text-inkMuted">
            <span>{row.week}</span>
          </div>
          <div className="flex h-8 gap-1">
            {keys.map((k) => {
              const val = Number(row[k.key]) || 0;
              const width = max ? (val / max) * 100 : 0;
              return (
                <div
                  key={k.key}
                  className={`${k.color} transition-all duration-300 ease-out-soft`}
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
            <span className={`inline-block h-2 w-2 rounded-full ${k.color}`} />
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
        <p className="text-xs font-bold text-brand-mid">{time}</p>
        <p className="mt-1 font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-inkMuted">{meta}</p>
      </div>
      {status && <StatusPill status={status} />}
    </div>
  );
}
