'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type TextSize = 'normal' | 'large' | 'xlarge';

const SIZE_LABELS: Record<TextSize, string> = {
  normal: 'Normal',
  large: 'Grande',
  xlarge: 'Muy grande',
};

interface Preferences {
  textSize: TextSize;
  contrast: boolean;
  motion: boolean;
  spacing: boolean;
  links: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  textSize: 'normal',
  contrast: false,
  motion: false,
  spacing: false,
  links: false,
};

const STORAGE_KEY = 'healthcloud:accessibility';

function applyPreferences(prefs: Preferences) {
  const root = document.documentElement;
  root.dataset.textSize = prefs.textSize;
  root.dataset.contrast = prefs.contrast ? 'on' : 'off';
  root.dataset.motion = prefs.motion ? 'reduced' : 'full';
  root.dataset.spacing = prefs.spacing ? 'on' : 'off';
  root.dataset.links = prefs.links ? 'underline' : 'default';
}

/**
 * Preferencias de lectura: escala tipográfica, alto contraste, animaciones
 * reducidas, espaciado de lectura y enlaces subrayados.
 * Se aplican como atributos en <html> y persisten en localStorage.
 */
export function AccessibilityControls() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<Preferences>;
      setPrefs({ ...DEFAULT_PREFERENCES, ...parsed });
    } catch {
      // Preferencias corruptas o almacenamiento no disponible: se usan las de por defecto.
    }
  }, []);

  useEffect(() => {
    applyPreferences(prefs);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Sin almacenamiento persistente los ajustes duran solo esta sesión.
    }
  }, [prefs]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setPrefs((current) => ({ ...current, [key]: value }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg px-3 py-2 text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:bg-brand-light"
      >
        Accesibilidad
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
          className="fixed inset-0 z-40 grid place-items-center bg-ink/45 p-5"
        >
          <section className="max-h-[calc(100vh-2.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-lift">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 id="accessibility-title" className="font-display text-xl text-ink">
                  Accesibilidad
                </h2>
                <p className="mt-2 text-sm leading-6 text-inkMuted">
                  Ajusta la lectura de HealthCloud a tus necesidades. Los cambios se aplican de
                  inmediato y se recuerdan en este navegador.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar accesibilidad"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:bg-brand-light"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 border-t border-line py-5">
              <p className="text-sm font-bold text-ink">Tamaño del texto</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(SIZE_LABELS) as TextSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={prefs.textSize === size}
                    onClick={() => set('textSize', size)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-colors duration-200 ease-out-soft ${
                      prefs.textSize === size
                        ? 'bg-brand text-white'
                        : 'bg-brand-light/70 text-brand-mid hover:bg-brand-soft/60'
                    }`}
                  >
                    {SIZE_LABELS[size]}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-line border-t border-line">
              <ToggleRow
                label="Alto contraste"
                description="Aumenta la diferencia entre textos, fondos y bordes."
                checked={prefs.contrast}
                onChange={(value) => set('contrast', value)}
              />
              <ToggleRow
                label="Reducir animaciones"
                description="Desactiva transiciones y movimientos de la interfaz."
                checked={prefs.motion}
                onChange={(value) => set('motion', value)}
              />
              <ToggleRow
                label="Espaciado de lectura"
                description="Más aire entre líneas, letras y palabras."
                checked={prefs.spacing}
                onChange={(value) => set('spacing', value)}
              />
              <ToggleRow
                label="Subrayar enlaces"
                description="Marca los enlaces sin depender solo del color."
                checked={prefs.links}
                onChange={(value) => set('links', value)}
              />
            </div>

            <div className="border-t border-line pt-5">
              <Button onClick={() => setOpen(false)}>Guardar preferencias</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="mt-1 text-sm text-inkMuted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`h-8 w-14 shrink-0 rounded-full p-1 transition-colors duration-200 ease-out-soft ${
          checked ? 'bg-brand' : 'bg-lineStrong'
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-out-soft ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
