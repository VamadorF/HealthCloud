'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type TextSize = 'normal' | 'large' | 'xlarge';

const SIZE_LABELS: Record<TextSize, string> = {
  normal: 'Normal',
  large: 'Grande',
  xlarge: 'Muy grande',
};

const STORAGE_KEY = 'healthcloud:accessibility';

function applyPreferences(textSize: TextSize, contrast: boolean) {
  const root = document.documentElement;
  root.dataset.textSize = textSize;
  root.dataset.contrast = contrast ? 'on' : 'off';
}

/**
 * Preferencias de lectura: escala tipográfica y alto contraste.
 * Se aplican como atributos en <html> y persisten en localStorage.
 */
export function AccessibilityControls() {
  const [open, setOpen] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { textSize?: TextSize; contrast?: boolean };
      if (parsed.textSize) setTextSize(parsed.textSize);
      if (parsed.contrast) setContrast(parsed.contrast);
    } catch {
      // Preferencias corruptas o almacenamiento no disponible: se usan las de por defecto.
    }
  }, []);

  useEffect(() => {
    applyPreferences(textSize, contrast);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ textSize, contrast }));
    } catch {
      // Sin almacenamiento persistente los ajustes duran solo esta sesión.
    }
  }, [textSize, contrast]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl px-3 py-2 text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:bg-brand-light"
      >
        Accesibilidad
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
          className="fixed inset-0 z-40 grid place-items-center bg-[#102c29]/45 p-5"
        >
          <section className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-lift">
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

            <div className="mt-6 border-y border-line py-5">
              <p className="text-sm font-bold text-ink">Tamaño del texto</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(SIZE_LABELS) as TextSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={textSize === size}
                    onClick={() => setTextSize(size)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 ease-out-soft ${
                      textSize === size
                        ? 'bg-brand text-white'
                        : 'bg-brand-light/70 text-brand-mid hover:bg-brand-soft/60'
                    }`}
                  >
                    {SIZE_LABELS[size]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-5 py-5">
              <div>
                <p className="text-sm font-bold text-ink">Alto contraste</p>
                <p className="mt-1 text-sm text-inkMuted">
                  Aumenta la diferencia entre textos, fondos y bordes.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={contrast}
                aria-label="Alto contraste"
                onClick={() => setContrast(!contrast)}
                className={`h-8 w-14 shrink-0 rounded-full p-1 transition-colors duration-200 ease-out-soft ${
                  contrast ? 'bg-brand' : 'bg-lineStrong'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transition-transform duration-200 ease-out-soft ${
                    contrast ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
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
