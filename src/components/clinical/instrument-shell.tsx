'use client';

/**
 * Envoltorio visual compartido para instrumentos clínicos (PSS, PSQI…).
 * Lenguaje de "señalética clínica": rótulos Archivo, franja de progreso, panel de score.
 */

export function InstrumentShell({
  eyebrow = 'Instrumento clínico',
  title,
  subtitle,
  progressLabel,
  progressValue,
  progressMax,
  children,
  scorePanel,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  progressLabel?: string;
  progressValue: number;
  progressMax: number;
  children: React.ReactNode;
  scorePanel: React.ReactNode;
}) {
  const pct = progressMax ? (progressValue / progressMax) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <header className="relative border-b border-line px-5 py-5 sm:px-6">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-role-spec"
        />
        <div className="flex flex-wrap items-start justify-between gap-3 pl-2">
          <div className="min-w-0">
            <p className="signage-label text-brand-mid">{eyebrow}</p>
            <h3 className="mt-1 font-display text-xl text-ink text-balance">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-inkMuted">{subtitle}</p>
          </div>
          <div className="rounded-lg border border-line bg-canvas px-3 py-2 text-right">
            <p className="signage-label text-inkMuted">{progressLabel ?? 'Progreso'}</p>
            <p className="mt-1 font-display text-lg tabular-nums text-ink">
              {progressValue}
              <span className="text-sm font-normal text-inkMuted">/{progressMax}</span>
            </p>
          </div>
        </div>
        <div className="mt-4 ml-2 h-1.5 overflow-hidden rounded-full bg-sunken">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-200 ease-out-soft"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">{children}</div>
        <aside className="border-t border-line bg-canvas/60 lg:border-l lg:border-t-0">
          <div className="sticky top-4 space-y-4 p-5">{scorePanel}</div>
        </aside>
      </div>
    </div>
  );
}

export function InstrumentSection({
  station,
  title,
  description,
  children,
}: {
  station: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line px-5 py-6 last:border-b-0 sm:px-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-light font-display text-xs text-brand-mid">
          {station}
        </span>
        <div>
          <h4 className="font-display text-base text-ink">{title}</h4>
          {description && (
            <p className="mt-0.5 text-sm text-inkMuted">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export function LikertOption({
  selected,
  value,
  label,
  inputId,
  name,
  required,
  onChange,
}: {
  selected: boolean;
  value: number;
  label: string;
  inputId: string;
  name: string;
  required?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={inputId}
      className={`relative flex min-h-[4.25rem] cursor-pointer flex-col items-center justify-center rounded-lg border px-1 py-2 text-center transition-colors duration-150 ease-out-soft ${
        selected
          ? 'border-brand/40 bg-brand-light text-brand-mid'
          : 'border-line bg-sunken/70 text-inkMuted hover:border-lineStrong hover:bg-surface hover:text-ink'
      }`}
    >
      <input
        id={inputId}
        type="radio"
        className="sr-only"
        name={name}
        value={value}
        checked={selected}
        required={required}
        onChange={onChange}
      />
      <span className="font-display text-sm tabular-nums">{value}</span>
      <span className="mt-1 text-[0.65rem] font-medium leading-tight">{label}</span>
    </label>
  );
}
