'use client';

import { useEffect, useState } from 'react';
import {
  AGENDA_VIEW_OPTIONS,
  AGENDA_VIEW_STORAGE_KEY,
  AgendaViewMode,
  DEFAULT_AGENDA_VIEW,
  parseAgendaViewMode,
} from '@/lib/preferences/agenda-view';

function readStored(): AgendaViewMode {
  try {
    return parseAgendaViewMode(window.localStorage.getItem(AGENDA_VIEW_STORAGE_KEY));
  } catch {
    return DEFAULT_AGENDA_VIEW;
  }
}

function writeStored(mode: AgendaViewMode) {
  try {
    window.localStorage.setItem(AGENDA_VIEW_STORAGE_KEY, mode);
  } catch {
    // sin persistencia
  }
  window.dispatchEvent(
    new CustomEvent('healthcloud:agenda-view', { detail: { mode } })
  );
}

/** Preferencia compartida entre Agenda y Ajustes. */
export function useAgendaViewPreference() {
  const [view, setViewState] = useState<AgendaViewMode>(DEFAULT_AGENDA_VIEW);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setViewState(readStored());
    setReady(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === AGENDA_VIEW_STORAGE_KEY) {
        setViewState(parseAgendaViewMode(event.newValue));
      }
    };
    const onCustom = (event: Event) => {
      const mode = (event as CustomEvent<{ mode: AgendaViewMode }>).detail?.mode;
      if (mode) setViewState(mode);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('healthcloud:agenda-view', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('healthcloud:agenda-view', onCustom);
    };
  }, []);

  const setView = (mode: AgendaViewMode) => {
    setViewState(mode);
    writeStored(mode);
  };

  return { view, setView, ready };
}

/** Segmented control Agenda | Calendario. */
export function AgendaViewToggle({
  view,
  onChange,
}: {
  view: AgendaViewMode;
  onChange: (mode: AgendaViewMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Vista de la agenda"
      className="inline-flex rounded-lg border border-line bg-sunken p-0.5"
    >
      {AGENDA_VIEW_OPTIONS.map((option) => {
        const active = view === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-out-soft ${
              active
                ? 'bg-surface text-ink shadow-card'
                : 'text-inkMuted hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Bloque de ajustes: cómo se presenta el cronograma. */
export function AgendaViewSettingsPanel() {
  const { view, setView, ready } = useAgendaViewPreference();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="signage-label text-inkMuted">Vista de la agenda</h2>
        <p className="mt-2 text-sm leading-6 text-inkMuted">
          Elige si el cronograma se muestra como lista o como calendario horario.
          También puedes cambiarlo desde la propia agenda.
        </p>
      </div>

      <fieldset className="space-y-3" disabled={!ready}>
        <legend className="sr-only">Modo de vista de agenda</legend>
        {AGENDA_VIEW_OPTIONS.map((option) => {
          const selected = view === option.id;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer gap-4 rounded-xl border px-5 py-4 transition-colors duration-150 ease-out-soft ${
                selected
                  ? 'border-brand/35 bg-brand-light/50'
                  : 'border-line bg-surface hover:border-lineStrong'
              }`}
            >
              <input
                type="radio"
                name="agendaView"
                value={option.id}
                checked={selected}
                onChange={() => setView(option.id)}
                className="mt-1 h-4 w-4 accent-brand"
              />
              <span className="min-w-0">
                <span className="block font-bold text-ink">{option.label}</span>
                <span className="mt-1 block text-sm text-inkMuted">{option.description}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
