'use client';

import { useMemo, useState } from 'react';
import {
  PSS_BAND_TONES,
  PSS_FREQUENCY_LABELS,
  PSS_ITEMS,
  computePssScore,
  type PssFrequency,
} from '@/lib/clinical/pss';

interface PssScaleProps {
  /** Prefijo de campos hidden para el server action. */
  name?: string;
  /** Respuestas iniciales 0–4 por ítem (14 valores). */
  defaultAnswers?: Array<PssFrequency | null>;
  /** Si true, exige completar los 14 ítems (atributo required en radios). */
  required?: boolean;
}

/**
 * Instrumento clínico PSS-14 para especialistas.
 * Presentación de escala Likert segmentada + panel de puntuación en vivo.
 */
export function PssScale({
  name = 'pss',
  defaultAnswers,
  required = false,
}: PssScaleProps) {
  const [answers, setAnswers] = useState<Array<PssFrequency | null>>(
    () => defaultAnswers ?? Array.from({ length: PSS_ITEMS.length }, () => null)
  );

  const score = useMemo(() => computePssScore(answers), [answers]);
  const progress = (score.answered / PSS_ITEMS.length) * 100;

  const setAnswer = (index: number, value: PssFrequency) => {
    setAnswers((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Escala de Estrés Percibido PSS-14</legend>

      <input
        type="hidden"
        name={`${name}Answers`}
        value={JSON.stringify(answers.map((a) => (a == null ? null : a)))}
      />
      <input type="hidden" name={`${name}Total`} value={score.complete ? score.total : ''} />
      <input type="hidden" name={`${name}Complete`} value={score.complete ? 'true' : 'false'} />

      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        <header className="border-b border-line bg-canvas/70 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="signage-label text-brand-mid">Instrumento clínico</p>
              <h3 className="mt-1 font-display text-xl text-ink">
                Escala de Estrés Percibido (PSS-14)
              </h3>
              <p className="mt-1 text-sm text-inkMuted">
                Versión española 2.0 · Cohen et al. (1983), adaptación Remor · Último mes
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-3 py-2 text-right">
              <p className="signage-label text-inkMuted">Progreso</p>
              <p className="mt-1 font-display text-lg tabular-nums text-ink">
                {score.answered}
                <span className="text-sm font-normal text-inkMuted">/{PSS_ITEMS.length}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sunken">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-200 ease-out-soft"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-inkMuted">
            Indique con qué frecuencia el paciente se ha sentido o ha pensado cada situación
            durante el último mes.
          </p>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_240px]">
          <ol className="divide-y divide-line">
            {PSS_ITEMS.map((item, index) => {
              const value = answers[index];
              return (
                <li key={item.id} className="px-5 py-5 sm:px-6">
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sunken font-display text-xs tabular-nums text-inkMuted">
                      {item.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-6 text-ink">{item.text}</p>
                      {item.reverse && (
                        <p className="mt-1 text-xs text-inkMuted">
                          Ítem de afrontamiento (se invierte al puntuar)
                        </p>
                      )}

                      <div
                        role="radiogroup"
                        aria-label={`Ítem ${item.id}`}
                        className="mt-3 grid grid-cols-5 gap-1.5"
                      >
                        {PSS_FREQUENCY_LABELS.map((label, option) => {
                          const selected = value === option;
                          const inputId = `${name}-item-${item.id}-${option}`;
                          return (
                            <label
                              key={label}
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
                                name={`${name}Item${item.id}`}
                                value={option}
                                checked={selected}
                                required={required}
                                onChange={() => setAnswer(index, option as PssFrequency)}
                              />
                              <span className="font-display text-sm tabular-nums">{option}</span>
                              <span className="mt-1 text-[0.65rem] font-medium leading-tight">
                                {label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <aside className="border-t border-line bg-canvas/50 lg:border-l lg:border-t-0">
            <div className="sticky top-4 space-y-4 p-5">
              <div>
                <p className="signage-label text-inkMuted">Puntuación PSS</p>
                <p className="mt-2 font-display text-[2rem] leading-none tracking-tight text-ink tabular-nums">
                  {score.complete ? score.total : '—'}
                  <span className="ml-1 text-base font-normal text-inkMuted">/ 56</span>
                </p>
                {score.band && score.bandLabel ? (
                  <span
                    className={`mt-3 inline-flex rounded-md px-2 py-1 text-xs font-bold ${PSS_BAND_TONES[score.band]}`}
                  >
                    {score.bandLabel}
                  </span>
                ) : (
                  <p className="mt-3 text-sm text-inkMuted">
                    Complete los 14 ítems para obtener la puntuación.
                  </p>
                )}
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-sunken">
                <div
                  className="h-full rounded-full bg-brand-mid transition-[width] duration-200 ease-out-soft"
                  style={{
                    width: score.complete ? `${(score.total / score.max) * 100}%` : '0%',
                  }}
                />
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-inkMuted">Respondidos</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {score.answered}/{PSS_ITEMS.length}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-inkMuted">Media ítem</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {score.mean != null ? score.mean.toFixed(2) : '—'}
                  </dd>
                </div>
              </dl>

              <p className="border-t border-line pt-3 text-xs leading-5 text-inkMuted">
                La puntuación total invierte los ítems 4, 5, 6, 7, 9, 10 y 13. A mayor valor,
                mayor estrés percibido. Las bandas son orientación clínica, no diagnóstico.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </fieldset>
  );
}

export function PssScoreSummary({
  total,
  bandLabel,
  band,
}: {
  total: number;
  bandLabel?: string;
  band?: keyof typeof PSS_BAND_TONES;
}) {
  return (
    <div className="rounded-lg border border-line bg-canvas px-4 py-3">
      <p className="signage-label text-inkMuted">PSS-14</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p className="font-display text-2xl tabular-nums text-ink">
          {total}
          <span className="text-sm font-normal text-inkMuted">/56</span>
        </p>
        {band && bandLabel && (
          <span className={`rounded-md px-2 py-1 text-xs font-bold ${PSS_BAND_TONES[band]}`}>
            {bandLabel}
          </span>
        )}
      </div>
    </div>
  );
}
