'use client';

import { useId, useState } from 'react';
import { FieldLabel } from '@/components/ui/input';

/**
 * Escala Visual Analógica (EVA) del dolor — instrumento clínico unidimensional.
 * Línea de 0 a 10: 0 = sin dolor, 10 = peor dolor imaginable.
 * Interpretación de referencia (no diagnóstica por sí sola):
 *   0 sin dolor · 1–3 leve · 4–6 moderado · 7–10 severo.
 */
export type EvaSeverity = 'none' | 'mild' | 'moderate' | 'severe';

export function evaSeverity(score: number): EvaSeverity {
  if (score <= 0) return 'none';
  if (score <= 3) return 'mild';
  if (score <= 6) return 'moderate';
  return 'severe';
}

export function evaSeverityLabel(score: number): string {
  switch (evaSeverity(score)) {
    case 'none':
      return 'Sin dolor';
    case 'mild':
      return 'Dolor leve';
    case 'moderate':
      return 'Dolor moderado';
    case 'severe':
      return 'Dolor severo';
  }
}

const SEVERITY_TONE: Record<EvaSeverity, string> = {
  none: 'bg-ok-soft text-ok',
  mild: 'bg-ok-soft text-ok',
  moderate: 'bg-warn-soft text-warn',
  severe: 'bg-accent-soft text-accent',
};

interface EvaScaleProps {
  name?: string;
  label?: string;
  defaultValue?: number;
  value?: number;
  onChange?: (next: number) => void;
  required?: boolean;
}

export function EvaScale({
  name = 'painScore',
  label = 'Intensidad del dolor (EVA)',
  defaultValue = 0,
  value,
  onChange,
  required = false,
}: EvaScaleProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue);
  const score = value ?? internal;
  const setScore = (next: number) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  const severity = evaSeverity(score);

  return (
    <fieldset className="w-full">
      <legend className="mb-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      </legend>

      <input type="hidden" name={name} value={score} />

      <div className="rounded-xl border border-line bg-canvas/70 px-4 py-4 sm:px-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-[1.875rem] leading-none tracking-tight text-ink tabular-nums">
              {score}
              <span className="ml-1 text-base font-normal text-inkMuted">/ 10</span>
            </p>
            <p className="mt-2 text-sm text-inkMuted">EVA / ENA · Escala 0–10</p>
          </div>
          <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${SEVERITY_TONE[severity]}`}
          >
            {evaSeverityLabel(score)}
          </span>
        </div>

        <label htmlFor={id} className="mt-5 block">
          <span className="sr-only">Seleccionar intensidad del dolor de 0 a 10</span>
          <input
            id={id}
            type="range"
            min={0}
            max={10}
            step={1}
            value={score}
            required={required}
            aria-valuemin={0}
            aria-valuemax={10}
            aria-valuenow={score}
            aria-valuetext={`${score} de 10, ${evaSeverityLabel(score)}`}
            onChange={(event) => setScore(Number(event.target.value))}
            className="eva-range w-full cursor-pointer"
          />
        </label>

        <div className="mt-2 flex justify-between text-xs text-inkMuted tabular-nums">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={`min-w-[1.25rem] rounded-md px-0.5 py-1 transition-colors duration-150 ease-out-soft hover:bg-surface hover:text-ink ${
                score === n ? 'bg-surface font-bold text-ink shadow-card' : ''
              }`}
              aria-label={`EVA ${n}`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="mt-3 flex justify-between text-xs text-inkMuted">
          <span>Sin dolor</span>
          <span>Peor dolor imaginable</span>
        </div>

        <p className="mt-4 border-t border-line pt-3 text-xs leading-5 text-inkMuted">
          La EVA cuantifica la intensidad subjetiva del dolor. No sustituye la evaluación
          clínica: se interpreta junto con la descripción, duración y signos de alarma.
        </p>
      </div>
    </fieldset>
  );
}

export function EvaScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) {
    return <span className="text-sm text-inkMuted">Sin EVA</span>;
  }
  const severity = evaSeverity(score);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold tabular-nums ${SEVERITY_TONE[severity]}`}
      title={evaSeverityLabel(score)}
    >
      EVA {score}/10
    </span>
  );
}
