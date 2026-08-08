'use client';

import { useMemo, useState } from 'react';
import {
  PSS_BAND_TONES,
  PSS_FREQUENCY_LABELS,
  PSS_ITEMS,
  computePssScore,
  type PssFrequency,
} from '@/lib/clinical/pss';
import { InstrumentShell, LikertOption } from '@/components/clinical/instrument-shell';

interface PssScaleProps {
  name?: string;
  defaultAnswers?: Array<PssFrequency | null>;
  required?: boolean;
}

/**
 * PSS-14 con el mismo lenguaje visual de señalética clínica que el PSQI.
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

      <InstrumentShell
        title="Escala de Estrés Percibido (PSS-14)"
        subtitle="Versión española 2.0 · Cohen et al. (1983), adaptación Remor · Último mes"
        progressValue={score.answered}
        progressMax={PSS_ITEMS.length}
        scorePanel={
          <>
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
              Se invierten los ítems 4, 5, 6, 7, 9, 10 y 13. A mayor valor, mayor estrés
              percibido. Las bandas son orientación clínica, no diagnóstico.
            </p>
          </>
        }
      >
        <ol className="divide-y divide-line">
          {PSS_ITEMS.map((item, index) => {
            const value = answers[index];
            return (
              <li key={item.id} className="px-5 py-5 sm:px-6">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-light font-display text-xs tabular-nums text-brand-mid">
                    {String(item.id).padStart(2, '0')}
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
                      {PSS_FREQUENCY_LABELS.map((label, option) => (
                        <LikertOption
                          key={label}
                          selected={value === option}
                          value={option}
                          label={label}
                          inputId={`${name}-item-${item.id}-${option}`}
                          name={`${name}Item${item.id}`}
                          required={required}
                          onChange={() => setAnswer(index, option as PssFrequency)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </InstrumentShell>
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
