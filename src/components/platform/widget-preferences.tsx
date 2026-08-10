'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DashboardRole,
  WIDGET_CATALOG,
  WIDGET_STORAGE_KEY,
  WidgetVisibilityMap,
  mergeVisibility,
} from '@/lib/preferences/dashboard-widgets';

interface WidgetPreferencesContextValue {
  role: DashboardRole;
  visibility: WidgetVisibilityMap;
  isVisible: (id: string) => boolean;
  setVisible: (id: string, visible: boolean) => void;
  reset: () => void;
  ready: boolean;
}

const WidgetPreferencesContext = createContext<WidgetPreferencesContextValue | null>(null);

function readStored(role: DashboardRole): WidgetVisibilityMap {
  try {
    const raw = window.localStorage.getItem(WIDGET_STORAGE_KEY);
    if (!raw) return mergeVisibility(role, null);
    const parsed = JSON.parse(raw) as Record<string, Partial<WidgetVisibilityMap>>;
    return mergeVisibility(role, parsed[role]);
  } catch {
    return mergeVisibility(role, null);
  }
}

function writeStored(role: DashboardRole, visibility: WidgetVisibilityMap) {
  try {
    const raw = window.localStorage.getItem(WIDGET_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, WidgetVisibilityMap>) : {};
    parsed[role] = visibility;
    window.localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Sin localStorage los ajustes duran solo esta sesión.
  }
}

export function WidgetPreferencesProvider({
  role,
  children,
}: {
  role: DashboardRole;
  children: React.ReactNode;
}) {
  const [visibility, setVisibility] = useState<WidgetVisibilityMap>(() =>
    mergeVisibility(role, null)
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setVisibility(readStored(role));
    setReady(true);
  }, [role]);

  useEffect(() => {
    if (!ready) return;
    writeStored(role, visibility);
  }, [ready, role, visibility]);

  const value = useMemo<WidgetPreferencesContextValue>(
    () => ({
      role,
      visibility,
      ready,
      isVisible: (id: string) => visibility[id] !== false,
      setVisible: (id, visible) =>
        setVisibility((current) => ({ ...current, [id]: visible })),
      reset: () => setVisibility(mergeVisibility(role, null)),
    }),
    [role, visibility, ready]
  );

  return (
    <WidgetPreferencesContext.Provider value={value}>
      {children}
    </WidgetPreferencesContext.Provider>
  );
}

export function useWidgetPreferences() {
  const ctx = useContext(WidgetPreferencesContext);
  if (!ctx) {
    throw new Error('useWidgetPreferences debe usarse dentro de WidgetPreferencesProvider');
  }
  return ctx;
}

/** Oculta el bloque si el usuario lo desactivó en Ajustes. */
export function WidgetGate({
  id,
  children,
  fallback = null,
}: {
  id: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isVisible, ready } = useWidgetPreferences();
  // Evita parpadeo: hasta cargar preferencias usamos el valor por defecto del catálogo.
  if (!ready) {
    const def = Object.values(WIDGET_CATALOG)
      .flat()
      .find((w) => w.id === id);
    if (def && !def.defaultVisible) return <>{fallback}</>;
  }
  if (!isVisible(id)) return <>{fallback}</>;
  return <>{children}</>;
}

/** Panel de toggles para la página de Ajustes. */
export function WidgetSettingsPanel({ role }: { role: DashboardRole }) {
  const { visibility, setVisible, reset } = useWidgetPreferences();
  const widgets = WIDGET_CATALOG[role];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="signage-label text-inkMuted">Widgets del panel</h2>
          <p className="mt-2 text-sm leading-6 text-inkMuted">
            Elige qué bloques secundarios ves en tu inicio. La agenda y el cronograma
            clínicos siempre permanecen visibles.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="shrink-0 text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:text-ink"
        >
          Restablecer
        </button>
      </div>

      <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
        {widgets.map((widget) => {
          const checked = visibility[widget.id] !== false;
          return (
            <li key={widget.id} className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-bold text-ink">{widget.label}</p>
                <p className="mt-1 text-sm text-inkMuted">{widget.description}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center pt-0.5">
                <span className="sr-only">Mostrar {widget.label}</span>
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={(event) => setVisible(widget.id, event.target.checked)}
                />
                <span
                  aria-hidden="true"
                  className="h-6 w-11 rounded-full bg-sunken transition-colors duration-200 ease-out-soft peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand-soft peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0.5 top-1 h-5 w-5 rounded-full bg-surface shadow-card transition-transform duration-200 ease-out-soft peer-checked:translate-x-5"
                />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
