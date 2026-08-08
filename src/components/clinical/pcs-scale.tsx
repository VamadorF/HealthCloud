'use client';

import { useMemo, useState } from 'react';
import {
  PCS_BAND_TONES,
  PCS_FREQUENCY_LABELS,
  PCS_ITEMS,
  PCS_SUBSCALE_META,
  computePcsScore,
  type PcsFrequency,
  type PcsSubscale,
} from '@/lib/clinical/pcs';
import { InstrumentShell, LikertOption } from '@/components/clinical/instrument-shell';

interface PcsScaleProps {
  name?: string;
  defaultAnswers?: Array<PcsFrequency | null>;
  required?: boolean;
}

/**
 * PCS — Escala de Catastrofización del Dolor.
 * Misma señalética clínica que PSS/PSQI: estaciones, Likert y panel de score.
 */
export function PcsScale({
  name = 'pcs',
  defaultAnswers,
  required = false,
}: PcsScaleProps) {
  const [answers, setAnswers] = useState<Array<PcsFrequency | null>>(
    () => defaultAnswers ?? Array.from({ length: PCS_ITEMS.length }, () => null)
  );

  const score = useMemo(() => computePcsScore(answers), [answers]);

  const setAnswer = (index: number, value: PcsFrequency) => {
    setAnswers((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Escala de Catastrofización del Dolor PCS</legend>
      <input
        type="hidden"
        name={`${name}Answers`}
        value={JSON.stringify(answers.map((a) => (a == null ? null : a)))}
      />
      <input type="hidden" name={`${name}Total`} value={score.complete ? score.total : ''} />
      <input type="hidden" name={`${name}Complete`} value={score.complete ? 'true' : 'false'} />

      <InstrumentShell
        title="Escala de Catastrofización del Dolor (PCS)"
        subtitle="Sullivan et al. (1995) · Pensamientos y sentimientos cuando siente dolor"
        progressValue={score.answered}
        progressMax={PCS_ITEMS.length}
        scorePanel={
          <>
            <div>
              <p className="signage-label text-inkMuted">Puntuación PCS</p>
              <p className="mt-2 font-display text-[2rem] leading-none tracking-tight text-ink tabular-nums">
                {score.complete ? score.total : '—'}
                <span className="ml-1 text-base font-normal text-inkMuted">/ 52</span>
              </p>
              {score.band && score.bandLabel ? (
                <span
                  className={`mt-3 inline-flex rounded-md px-2 py-1 text-xs font-bold ${PCS_BAND_TONES[score.band]}`}
                >
                  {score.bandLabel}
                </span>
              ) : (
                <p className="mt-3 text-sm text-inkMuted">
                  Complete los 13 ítems para obtener la puntuación.
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

            <ul className="space-y-2.5">
              {(Object.keys(PCS_SUBSCALE_META) as PcsSubscale[]).map((key) => {
                const meta = PCS_SUBSCALE_META[key];
                const value = score.subscales[key];
                return (
                  <li key={key} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-inkMuted">{meta.label}</span>
                      <span className="font-medium tabular-nums text-ink">
                        {score.complete ? value : '—'}
                        <span className="text-inkMuted">/{meta.max}</span>
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-sunken"
                    >
                      <span
                        className="block h-full rounded-full bg-brand"
                        style={{
                          width: score.complete ? `${(value / meta.max) * 100}%` : '0%',
                        }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="border-t border-line pt-3 text-xs leading-5 text-inkMuted">
              Total &gt; 30 indica catastrofización clínicamente significativa. Subescalas:
              rumiación, magnificación e impotencia.
            </p>
          </>
        }
      >
        <div className="border-b border-line bg-canvas/50 px-5 py-4 sm:px-6">
          <p className="text-sm leading-6 text-inkMuted">
            Piense en experiencias dolorosas pasadas. Indique en qué medida tiene cada
            pensamiento o sentimiento <strong className="font-medium text-ink">cuando siente dolor</strong>.
          </p>
        </div>

        <ol className="divide-y divide-line">
          {PCS_ITEMS.map((item, index) => {
            const value = answers[index];
            const subscaleLabel = PCS_SUBSCALE_META[item.subscale].label;
            return (
              <li key={item.id} className="px-5 py-5 sm:px-6">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-light font-display text-xs tabular-nums text-brand-mid">
                    {String(item.id).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-6 text-ink">{item.text}</p>
                    <p className="mt-1 text-xs text-inkMuted">{subscaleLabel}</p>
                    <div
                      role="radiogroup"
                      aria-label={`Ítem ${item.id}`}
                      className="mt-3 grid grid-cols-5 gap-1.5"
                    >
                      {PCS_FREQUENCY_LABELS.map((label, option) => (
                        <LikertOption
                          key={label}
                          selected={value === option}
                          value={option}
                          label={label}
                          inputId={`${name}-item-${item.id}-${option}`}
                          name={`${name}Item${item.id}`}
                          required={required}
                          onChange={() => setAnswer(index, option as PcsFrequency)}
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

export function PcsScoreSummary({
  total,
  bandLabel,
  band,
}: {
  total: number;
  bandLabel?: string;
  band?: keyof typeof PCS_BAND_TONES;
}) {
  return (
    <div className="rounded-lg border border-line bg-canvas px-4 py-3">
      <p className="signage-label text-inkMuted">PCS</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p className="font-display text-2xl tabular-nums text-ink">
          {total}
          <span className="text-sm font-normal text-inkMuted">/52</span>
        </p>
        {band && bandLabel && (
          <span className={`rounded-md px-2 py-1 text-xs font-bold ${PCS_BAND_TONES[band]}`}>
            {bandLabel}
          </span>
        )}
      </div>
    </div>
  );
}
