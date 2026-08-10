'use client';

import { useMemo, useState } from 'react';
import {
  EMPTY_PSQI_ANSWERS,
  PSQI_BAND_TONES,
  PSQI_DISTURBANCES,
  PSQI_ENTHUSIASM_LABELS,
  PSQI_FREQ_LABELS,
  PSQI_QUALITY_LABELS,
  computePsqiScore,
  type PsqiAnswers,
  type PsqiFreq,
} from '@/lib/clinical/psqi';
import { InstrumentSection, InstrumentShell, LikertOption } from '@/components/clinical/instrument-shell';
import { FieldLabel, fieldStyles } from '@/components/ui/input';

interface PsqiScaleProps {
  name?: string;
  defaultAnswers?: Partial<PsqiAnswers>;
  required?: boolean;
}

export function PsqiScale({
  name = 'psqi',
  defaultAnswers,
  required = false,
}: PsqiScaleProps) {
  const [answers, setAnswers] = useState<PsqiAnswers>(() => ({
    ...EMPTY_PSQI_ANSWERS,
    ...defaultAnswers,
    disturbances:
      defaultAnswers?.disturbances ??
      Array.from({ length: 10 }, () => null),
  }));

  const score = useMemo(() => computePsqiScore(answers), [answers]);

  const answeredCount = useMemo(() => {
    let n = 0;
    if (answers.bedtime) n += 1;
    if (answers.wakeTime) n += 1;
    if (answers.latencyMinutes != null) n += 1;
    if (answers.hoursSlept != null) n += 1;
    n += answers.disturbances.filter((d) => d != null).length;
    if (answers.sleepQuality != null) n += 1;
    if (answers.medication != null) n += 1;
    if (answers.stayAwake != null) n += 1;
    if (answers.enthusiasm != null) n += 1;
    return n;
  }, [answers]);

  const totalFields = 4 + 10 + 4;

  const patch = (partial: Partial<PsqiAnswers>) =>
    setAnswers((current) => ({ ...current, ...partial }));

  const setDisturbance = (index: number, value: PsqiFreq) => {
    setAnswers((current) => {
      const next = [...current.disturbances];
      next[index] = value;
      return { ...current, disturbances: next };
    });
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Índice de Calidad del Sueño de Pittsburgh</legend>
      <input type="hidden" name={`${name}Answers`} value={JSON.stringify(answers)} />
      <input
        type="hidden"
        name={`${name}Total`}
        value={score.complete ? score.global : ''}
      />
      <input
        type="hidden"
        name={`${name}Complete`}
        value={score.complete ? 'true' : 'false'}
      />

      <InstrumentShell
        title="Índice de Calidad del Sueño (PSQI)"
        subtitle="Buysse et al. (1989) · Hábitos de sueño del último mes"
        progressValue={answeredCount}
        progressMax={totalFields}
        scorePanel={
          <>
            <div>
              <p className="signage-label text-inkMuted">Puntuación global</p>
              <p className="mt-2 font-display text-[2rem] leading-none tracking-tight text-ink tabular-nums">
                {score.complete ? score.global : '—'}
                <span className="ml-1 text-base font-normal text-inkMuted">/ 21</span>
              </p>
              {score.band && score.bandLabel ? (
                <span
                  className={`mt-3 inline-flex rounded-md px-2 py-1 text-xs font-bold ${PSQI_BAND_TONES[score.band]}`}
                >
                  {score.bandLabel}
                </span>
              ) : (
                <p className="mt-3 text-sm text-inkMuted">
                  Complete la ventana, alteraciones y resumen.
                </p>
              )}
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-sunken">
              <div
                className="h-full rounded-full bg-brand-mid transition-[width] duration-200 ease-out-soft"
                style={{
                  width: score.complete ? `${(score.global / score.max) * 100}%` : '0%',
                }}
              />
            </div>

            {score.complete && (
              <ul className="space-y-2">
                {score.components.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-inkMuted">{c.label}</span>
                    <span className="flex items-center gap-2 tabular-nums text-ink">
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-10 overflow-hidden rounded-full bg-sunken"
                      >
                        <span
                          className="block h-full rounded-full bg-brand"
                          style={{ width: `${(c.score / 3) * 100}%` }}
                        />
                      </span>
                      {c.score}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="space-y-2 border-t border-line pt-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-inkMuted">Horas en cama</dt>
                <dd className="font-medium tabular-nums text-ink">
                  {score.hoursInBed != null ? `${score.hoursInBed} h` : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-inkMuted">Eficiencia</dt>
                <dd className="font-medium tabular-nums text-ink">
                  {score.efficiencyPercent != null ? `${score.efficiencyPercent}%` : '—'}
                </dd>
              </div>
            </dl>

            <p className="border-t border-line pt-3 text-xs leading-5 text-inkMuted">
              Global &gt; 5 sugiere mala calidad de sueño. Siete componentes (0–3) suman 0–21.
            </p>
          </>
        }
      >
        <InstrumentSection
          station="01"
          title="Ventana de sueño"
          description="Horario habitual y descanso real del último mes."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={`${name}-bed`}>Hora habitual de acostarte</FieldLabel>
              <input
                id={`${name}-bed`}
                type="time"
                className={fieldStyles}
                value={answers.bedtime}
                required={required}
                onChange={(e) => patch({ bedtime: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${name}-wake`}>Hora habitual de levantarte</FieldLabel>
              <input
                id={`${name}-wake`}
                type="time"
                className={fieldStyles}
                value={answers.wakeTime}
                required={required}
                onChange={(e) => patch({ wakeTime: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${name}-latency`}>Minutos para conciliar el sueño</FieldLabel>
              <input
                id={`${name}-latency`}
                type="number"
                min={0}
                max={240}
                className={fieldStyles}
                placeholder="p. ej. 25"
                value={answers.latencyMinutes ?? ''}
                required={required}
                onChange={(e) =>
                  patch({
                    latencyMinutes:
                      e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${name}-hours`}>Horas reales de sueño por noche</FieldLabel>
              <input
                id={`${name}-hours`}
                type="number"
                min={0}
                max={24}
                step={0.5}
                className={fieldStyles}
                placeholder="p. ej. 6.5"
                value={answers.hoursSlept ?? ''}
                required={required}
                onChange={(e) =>
                  patch({
                    hoursSlept: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </InstrumentSection>

        <InstrumentSection
          station="02"
          title="Alteraciones del sueño"
          description="Con qué frecuencia te despertaron o te impidieron dormir."
        >
          <ol className="space-y-5">
            {PSQI_DISTURBANCES.map((item, index) => (
              <li key={item.id}>
                <p className="text-sm font-medium leading-6 text-ink">{item.text}</p>
                <div
                  role="radiogroup"
                  aria-label={item.text}
                  className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4"
                >
                  {PSQI_FREQ_LABELS.map((label, option) => (
                    <LikertOption
                      key={label}
                      selected={answers.disturbances[index] === option}
                      value={option}
                      label={label}
                      inputId={`${name}-dist-${item.id}-${option}`}
                      name={`${name}Dist${item.id}`}
                      required={required}
                      onChange={() => setDisturbance(index, option as PsqiFreq)}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </InstrumentSection>

        <InstrumentSection
          station="03"
          title="Resumen"
          description="Calidad global, medicación y funcionamiento diurno."
        >
          <div className="space-y-5">
            <SummaryItem
              name={`${name}Quality`}
              label="¿Cómo calificarías la calidad de tu sueño en general?"
              labels={PSQI_QUALITY_LABELS}
              value={answers.sleepQuality}
              required={required}
              onChange={(v) => patch({ sleepQuality: v })}
            />
            <SummaryItem
              name={`${name}Med`}
              label="¿Con qué frecuencia tomaste medicación para dormir?"
              labels={PSQI_FREQ_LABELS}
              value={answers.medication}
              required={required}
              onChange={(v) => patch({ medication: v })}
            />
            <SummaryItem
              name={`${name}Awake`}
              label="¿Con qué frecuencia te costó mantenerte despierto al conducir, comer o estar con gente?"
              labels={PSQI_FREQ_LABELS}
              value={answers.stayAwake}
              required={required}
              onChange={(v) => patch({ stayAwake: v })}
            />
            <SummaryItem
              name={`${name}Enth`}
              label="¿Cuánto te ha costado mantener el entusiasmo para sacar cosas adelante?"
              labels={PSQI_ENTHUSIASM_LABELS}
              value={answers.enthusiasm}
              required={required}
              onChange={(v) => patch({ enthusiasm: v })}
            />
          </div>
        </InstrumentSection>
      </InstrumentShell>
    </fieldset>
  );
}

function SummaryItem({
  name,
  label,
  labels,
  value,
  required,
  onChange,
}: {
  name: string;
  label: string;
  labels: readonly string[];
  value: PsqiFreq | null;
  required?: boolean;
  onChange: (v: PsqiFreq) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium leading-6 text-ink">{label}</p>
      <div role="radiogroup" aria-label={label} className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {labels.map((optionLabel, option) => (
          <LikertOption
            key={optionLabel}
            selected={value === option}
            value={option}
            label={optionLabel}
            inputId={`${name}-${option}`}
            name={name}
            required={required}
            onChange={() => onChange(option as PsqiFreq)}
          />
        ))}
      </div>
    </div>
  );
}

export function PsqiScoreSummary({
  global,
  bandLabel,
  band,
}: {
  global: number;
  bandLabel?: string;
  band?: keyof typeof PSQI_BAND_TONES;
}) {
  return (
    <div className="rounded-lg border border-line bg-canvas px-4 py-3">
      <p className="signage-label text-inkMuted">PSQI</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p className="font-display text-2xl tabular-nums text-ink">
          {global}
          <span className="text-sm font-normal text-inkMuted">/21</span>
        </p>
        {band && bandLabel && (
          <span className={`rounded-md px-2 py-1 text-xs font-bold ${PSQI_BAND_TONES[band]}`}>
            {bandLabel}
          </span>
        )}
      </div>
    </div>
  );
}
