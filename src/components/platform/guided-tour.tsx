'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TOUR_STEPS, type TourRole } from '@/lib/tour/steps';

// Cada paso resalta una región del layout, marcada con data-tour en el shell.
const TOUR_TARGETS = ['header', 'nav', 'content'] as const;

export function GuidedTour({ role, roleLabel }: { role: TourRole; roleLabel: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const steps = TOUR_STEPS[role];
  const current = steps[step];
  const isLast = step === steps.length - 1;

  useEffect(() => {
    const targets = TOUR_TARGETS.map((name) =>
      document.querySelector<HTMLElement>(`[data-tour="${name}"]`)
    );

    targets.forEach((element, index) => {
      element?.classList.toggle('tour-highlight', open && index === step);
    });

    if (open) {
      targets[step]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    return () => {
      targets.forEach((element) => element?.classList.remove('tour-highlight'));
    };
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    setStep(0);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Abrir guía de esta pantalla"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-lineStrong bg-surface text-base font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:bg-brand-light"
      >
        i
      </button>

      {open && (
        <aside
          role="dialog"
          aria-labelledby="tour-title"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 w-[calc(100%-2.5rem)] max-w-md overflow-hidden rounded-2xl border border-brand-soft bg-surface text-left shadow-lift"
        >
          <div className="border-b border-line bg-brand-light px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-brand-mid">Guía de {roleLabel}</p>
                <h2 id="tour-title" className="mt-1 font-display text-xl text-ink">
                  {current.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar guía"
                className="rounded-lg px-2 py-1 text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:bg-surface"
              >
                Cerrar
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-inkMuted">{current.body}</p>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-inkMuted">
              Paso {step + 1} de {steps.length}
            </p>
            <div className="mt-3 flex gap-2" aria-hidden="true">
              {steps.map((item, index) => (
                <span
                  key={item.title}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ease-out-soft ${
                    index <= step ? 'bg-brand-mid' : 'bg-brand-soft'
                  }`}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={close}
                className="text-sm font-bold text-brand-mid transition-colors duration-200 ease-out-soft hover:text-ink"
              >
                Omitir guía
              </button>
              <div className="flex gap-2">
                {step > 0 && (
                  <Button size="sm" variant="secondary" onClick={() => setStep(step - 1)}>
                    Atrás
                  </Button>
                )}
                <Button size="sm" onClick={() => (isLast ? close() : setStep(step + 1))}>
                  {isLast ? 'Finalizar' : 'Siguiente'}
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
