'use client';

import { useMemo, useState } from 'react';
import {
  EMPTY_PAIN_ASSESSMENT,
  PAIN_CHARACTERISTICS,
  PAIN_RADIATION_OPTIONS,
  isPainAssessmentComplete,
  type PainAssessmentAnswers,
  type PainCharacteristicId,
  type PainRadiationId,
} from '@/lib/clinical/pain-assessment';
import { EvaScale, evaSeverityLabel } from '@/components/clinical/eva-scale';
import { BodyAreasField } from '@/components/clinical/body-areas-field';
import { InstrumentSection, InstrumentShell } from '@/components/clinical/instrument-shell';
import { FieldLabel, fieldStyles } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PainAssessmentFormProps {
  name?: string;
  defaultAnswers?: Partial<PainAssessmentAnswers>;
  required?: boolean;
}

/**
 * Formulario clínico de dolor para el paciente.
 * El especialista revisa los registros en la ficha del paciente.
 */
export function PainAssessmentForm({
  name = 'pain',
  defaultAnswers,
  required = false,
}: PainAssessmentFormProps) {
  const [answers, setAnswers] = useState<PainAssessmentAnswers>(() => ({
    ...EMPTY_PAIN_ASSESSMENT,
    ...defaultAnswers,
    locations: defaultAnswers?.locations ?? [],
    characteristics: defaultAnswers?.characteristics ?? [],
  }));

  const complete = useMemo(() => isPainAssessmentComplete(answers), [answers]);
  const answeredCount = useMemo(() => {
    let n = 0;
    if (answers.onset.trim()) n += 1;
    if (answers.locations.length) n += 1;
    if (answers.intensityEva != null) n += 1;
    if (answers.characteristics.length) n += 1;
    if (answers.radiation) n += 1;
    if (answers.relieves.trim() || answers.aggravates.trim()) n += 1;
    return n;
  }, [answers]);

  const patch = (partial: Partial<PainAssessmentAnswers>) =>
    setAnswers((current) => ({ ...current, ...partial }));

  const toggleCharacteristic = (id: PainCharacteristicId) => {
    setAnswers((current) => {
      const has = current.characteristics.includes(id);
      return {
        ...current,
        characteristics: has
          ? current.characteristics.filter((c) => c !== id)
          : [...current.characteristics, id],
      };
    });
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Evaluación del dolor</legend>
      <input type="hidden" name={`${name}Answers`} value={JSON.stringify(answers)} />
      <input type="hidden" name={`${name}Complete`} value={complete ? 'true' : 'false'} />

      <InstrumentShell
        title="Evaluación del dolor"
        subtitle="Aparición · localización · EVA/ENA · características · irradiación · alivio"
        progressValue={answeredCount}
        progressMax={6}
        scorePanel={
          <>
            <div>
              <p className="signage-label text-inkMuted">Intensidad</p>
              <p className="mt-2 font-display text-[2rem] leading-none tracking-tight text-ink tabular-nums">
                {answers.intensityEva != null ? answers.intensityEva : '—'}
                <span className="ml-1 text-base font-normal text-inkMuted">/ 10</span>
              </p>
              {answers.intensityEva != null ? (
                <span className="mt-3 inline-flex rounded-md bg-brand-light px-2 py-1 text-xs font-bold text-brand-mid">
                  {evaSeverityLabel(answers.intensityEva)} · EVA/ENA
                </span>
              ) : (
                <p className="mt-3 text-sm text-inkMuted">Indique la intensidad en la escala.</p>
              )}
            </div>

            <dl className="space-y-2 border-t border-line pt-3 text-sm">
              <div>
                <dt className="text-inkMuted">Aparición</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {answers.onset.trim() || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-inkMuted">Localización</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {answers.locations.length ? `${answers.locations.length} zona(s)` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-inkMuted">Irradiación</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {PAIN_RADIATION_OPTIONS.find((o) => o.id === answers.radiation)?.label ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-inkMuted">Características</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {answers.characteristics.length
                    ? answers.characteristics
                        .map(
                          (id) =>
                            PAIN_CHARACTERISTICS.find((c) => c.id === id)?.label ?? id
                        )
                        .join(', ')
                    : '—'}
                </dd>
              </div>
            </dl>

            <p className="border-t border-line pt-3 text-xs leading-5 text-inkMuted">
              EVA y ENA miden intensidad 0–10. Complete aparición, localización,
              características e irradiación para enviar.
            </p>
          </>
        }
      >
        <InstrumentSection
          station="01"
          title="Aparición"
          description="¿Cuándo comenzó el dolor?"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor={`${name}-onset`}>Cuándo comenzó</FieldLabel>
              <input
                id={`${name}-onset`}
                className={fieldStyles}
                placeholder="p. ej. Hace 3 días, tras un esfuerzo…"
                value={answers.onset}
                required={required}
                onChange={(e) => patch({ onset: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel htmlFor={`${name}-onset-date`}>Fecha aproximada (opcional)</FieldLabel>
              <input
                id={`${name}-onset-date`}
                type="date"
                className={fieldStyles}
                value={answers.onsetDate ?? ''}
                onChange={(e) =>
                  patch({ onsetDate: e.target.value ? e.target.value : null })
                }
              />
            </div>
          </div>
        </InstrumentSection>

        <InstrumentSection
          station="02"
          title="Localización"
          description="¿Dónde siente el dolor?"
        >
          <BodyAreasField
            name={`${name}Locations`}
            label="Zonas afectadas"
            value={answers.locations}
            onChange={(locations) => patch({ locations })}
          />
        </InstrumentSection>

        <InstrumentSection
          station="03"
          title="Intensidad (EVA / ENA)"
          description="Escala Visual Analógica y Escala Numérica Analógica · 0 a 10."
        >
          <EvaScale
            name={`${name}Eva`}
            label="Intensidad del dolor (EVA / ENA)"
            value={answers.intensityEva ?? 0}
            onChange={(intensityEva) => patch({ intensityEva })}
          />
        </InstrumentSection>

        <InstrumentSection
          station="04"
          title="Características"
          description="¿Cómo es el dolor? Puede marcar varias (arde, pica, punzante…)."
        >
          <div className="flex flex-wrap gap-2">
            {PAIN_CHARACTERISTICS.map((item) => {
              const active = answers.characteristics.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCharacteristic(item.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out-soft ${
                    active
                      ? 'border-brand/40 bg-brand-light text-brand-mid'
                      : 'border-line bg-sunken text-inkMuted hover:border-lineStrong hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </InstrumentSection>

        <InstrumentSection
          station="05"
          title="Irradiación"
          description="¿El dolor sube, baja o se desplaza?"
        >
          <div
            role="radiogroup"
            aria-label="Irradiación del dolor"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {PAIN_RADIATION_OPTIONS.map((option) => {
              const selected = answers.radiation === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium transition-colors duration-150 ease-out-soft ${
                    selected
                      ? 'border-brand/40 bg-brand-light text-brand-mid'
                      : 'border-line bg-sunken text-inkMuted hover:bg-surface hover:text-ink'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`${name}Radiation`}
                    value={option.id}
                    checked={selected}
                    required={required}
                    onChange={() => patch({ radiation: option.id as PainRadiationId })}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          {answers.radiation && answers.radiation !== 'none' && (
            <div className="mt-4">
              <FieldLabel htmlFor={`${name}-rad-detail`}>Detalle de irradiación</FieldLabel>
              <input
                id={`${name}-rad-detail`}
                className={fieldStyles}
                placeholder="p. ej. Baja hacia la pierna izquierda…"
                value={answers.radiationDetail}
                onChange={(e) => patch({ radiationDetail: e.target.value })}
              />
            </div>
          )}
        </InstrumentSection>

        <InstrumentSection
          station="06"
          title="Alivio y agravantes"
          description="¿Hay algo que lo alivie o lo agrave?"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Textarea
              id={`${name}-relieves`}
              label="Lo alivia"
              rows={3}
              placeholder="Reposo, calor, medicación…"
              value={answers.relieves}
              onChange={(e) => patch({ relieves: e.target.value })}
            />
            <Textarea
              id={`${name}-aggravates`}
              label="Lo agrava"
              rows={3}
              placeholder="Movimiento, frío, esfuerzo…"
              value={answers.aggravates}
              onChange={(e) => patch({ aggravates: e.target.value })}
            />
          </div>
        </InstrumentSection>
      </InstrumentShell>
    </fieldset>
  );
}
