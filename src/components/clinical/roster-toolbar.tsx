'use client';

import { fieldStyles } from '@/components/ui/input';

export type RosterFilterOption = {
  id: string;
  label: string;
  count?: number;
};

/**
 * Barra densa de búsqueda + chips de filtro para rosters clínicos.
 */
export function RosterToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar paciente…',
  filters,
  activeFilter,
  onFilterChange,
  resultLabel,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: RosterFilterOption[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  resultLabel: string;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-line bg-surface px-4 py-4 shadow-card sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-inkMuted"
          >
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={`${fieldStyles} pl-9`}
          />
        </label>
        <p className="shrink-0 text-xs tabular-nums text-inkMuted sm:text-right">{resultLabel}</p>
      </div>

      {filters.length > 1 ? (
        <div role="group" aria-label="Filtros" className="flex flex-wrap gap-1.5">
          {filters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => onFilterChange(filter.id)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out-soft ${
                  active
                    ? 'bg-brand text-white'
                    : 'bg-sunken text-inkMuted hover:bg-brand-light hover:text-brand-mid'
                }`}
              >
                {filter.label}
                {typeof filter.count === 'number' ? (
                  <span className="ml-1 tabular-nums opacity-80">{filter.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/** Layout lista + detalle para paneles densos. */
export function RosterSplit({
  list,
  detail,
  listWidthClass = 'lg:w-[320px]',
}: {
  list: React.ReactNode;
  detail: React.ReactNode;
  listWidthClass?: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
      <div className={`min-w-0 shrink-0 ${listWidthClass}`}>{list}</div>
      <div className="min-w-0 flex-1">{detail}</div>
    </div>
  );
}
