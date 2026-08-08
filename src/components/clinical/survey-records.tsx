'use client';

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
          <li
            key={`${instrument}-${record.completedAt}`}
            className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2.5"
          >
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
          </li>
        ))}
      </ul>
    </div>
  );
}
