'use client';

import {
  BODY_REGION_LABELS,
  PAIN_CHARACTERISTICS,
  PAIN_RADIATION_OPTIONS,
} from '@/lib/clinical/pain-assessment';
import {
  SURVEY_INSTRUMENTS,
  SurveyInstrumentId,
  type InstrumentAssignment,
  type SurveyRecord,
  formatScoreSummary,
} from '@/lib/clinical/survey-schedule';

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function PainRecordDetail({ score }: { score: Record<string, unknown> }) {
  if (score.kind !== 'pain-assessment') return null;

  const locations = Array.isArray(score.locations)
    ? score.locations.map((id) => BODY_REGION_LABELS[String(id)] ?? String(id)).join(', ')
    : '';
  const characteristics = Array.isArray(score.characteristics)
    ? score.characteristics
        .map((id) => PAIN_CHARACTERISTICS.find((c) => c.id === id)?.label ?? String(id))
        .join(', ')
    : '';
  const radiation =
    PAIN_RADIATION_OPTIONS.find((o) => o.id === score.radiation)?.label ??
    (typeof score.radiation === 'string' ? score.radiation : '');

  const rows: { label: string; value: string }[] = [
    typeof score.onset === 'string' && score.onset
      ? { label: 'Aparición', value: score.onset }
      : null,
    locations ? { label: 'Localización', value: locations } : null,
    typeof score.intensityEva === 'number'
      ? { label: 'Intensidad EVA/ENA', value: `${score.intensityEva}/10` }
      : null,
    characteristics ? { label: 'Características', value: characteristics } : null,
    radiation
      ? {
          label: 'Irradiación',
          value:
            typeof score.radiationDetail === 'string' && score.radiationDetail
              ? `${radiation} · ${score.radiationDetail}`
              : radiation,
        }
      : null,
    typeof score.relieves === 'string' && score.relieves
      ? { label: 'Lo alivia', value: score.relieves }
      : null,
    typeof score.aggravates === 'string' && score.aggravates
      ? { label: 'Lo agrava', value: score.aggravates }
      : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  if (rows.length === 0) return null;

  return (
    <dl className="mt-2 grid gap-1.5 text-xs text-inkMuted sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="font-bold text-ink/70">{row.label}</dt>
          <dd className="mt-0.5 text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Historial de una encuesta concreta en la ficha del paciente. */
export function InstrumentRecords({
  instrument,
  assignment,
}: {
  instrument: SurveyInstrumentId;
  assignment: InstrumentAssignment;
}) {
  const meta = SURVEY_INSTRUMENTS[instrument];
  const history = assignment.history?.length
    ? assignment.history
    : assignment.lastCompletedAt && assignment.lastScore
      ? [
          {
            completedAt: assignment.lastCompletedAt,
            score: assignment.lastScore,
            summary: formatScoreSummary(instrument, assignment.lastScore),
          } satisfies SurveyRecord,
        ]
      : [];

  if (history.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-canvas/50 px-3 py-3 text-xs text-inkMuted">
        Sin registros de {meta.shortLabel} todavía.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-canvas/40">
      <p className="signage-label border-b border-line px-3 py-2 text-inkMuted">
        Registros · {meta.shortLabel}
      </p>
      <ul className="divide-y divide-line">
        {history.map((record) => (
          <li key={`${instrument}-${record.completedAt}`} className="px-3 py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">
                  {record.summary ?? formatScoreSummary(instrument, record.score)}
                </p>
                <p className="text-xs text-inkMuted tabular-nums">
                  {formatWhen(record.completedAt)}
                </p>
              </div>
              {typeof record.score.bandLabel === 'string' && (
                <span className="rounded-md bg-surface px-2 py-1 text-xs font-bold text-inkMuted">
                  {record.score.bandLabel}
                </span>
              )}
            </div>
            {instrument === 'DOLOR' ? <PainRecordDetail score={record.score} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
