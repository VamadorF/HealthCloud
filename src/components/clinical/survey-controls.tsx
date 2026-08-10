'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  SURVEY_INSTRUMENT_IDS,
  SURVEY_INSTRUMENTS,
  SURVEY_STORAGE_KEY,
  SurveyConfig,
  SurveyInstrumentId,
  appendSurveyRecord,
  formatScoreSummary,
  getSurveyAvailability,
  mergeSurveyConfig,
  type InstrumentAssignment,
} from '@/lib/clinical/survey-schedule';
import { InstrumentRecords } from '@/components/clinical/survey-records';

type PatientKey = string;
type Store = Record<PatientKey, SurveyConfig>;

function readStore(): Store {
  try {
    const raw = window.localStorage.getItem(SURVEY_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  try {
    window.localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // sin persistencia
  }
}

function usePatientSurveyConfig(patientKey: string) {
  const [config, setConfig] = useState<SurveyConfig>(() => mergeSurveyConfig(null));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const store = readStore();
    setConfig(mergeSurveyConfig(store[patientKey]));
    setReady(true);
  }, [patientKey]);

  const update = (instrument: SurveyInstrumentId, patch: Partial<InstrumentAssignment>) => {
    setConfig((current) => {
      const next = mergeSurveyConfig({
        ...current,
        [instrument]: { ...current[instrument], ...patch },
      });
      const store = readStore();
      store[patientKey] = next;
      writeStore(store);
      return next;
    });
  };

  const replaceInstrument = (instrument: SurveyInstrumentId, nextAssignment: InstrumentAssignment) => {
    setConfig((current) => {
      const next = mergeSurveyConfig({
        ...current,
        [instrument]: nextAssignment,
      });
      const store = readStore();
      store[patientKey] = next;
      writeStore(store);
      return next;
    });
  };

  return { config, update, replaceInstrument, ready };
}

/**
 * Vista del especialista: cada encuesta separada, con activación propia y registros.
 */
export function SpecialistSurveyControls({
  patientKey,
  patientName,
}: {
  patientKey: string;
  patientName: string;
}) {
  const { config, update, ready } = usePatientSurveyConfig(patientKey);

  if (!ready) {
    return <p className="text-sm text-inkMuted">Cargando encuestas…</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="signage-label text-inkMuted">Encuestas del paciente</p>
        <p className="mt-1 text-sm text-inkMuted">
          {patientName} · Tú eliges qué escalas asignar y cuándo abrirlas. Tras cada
          respuesta, la siguiente ventana es a los 2 meses.
        </p>
      </div>

      <div className="grid gap-4">
        {SURVEY_INSTRUMENT_IDS.map((id) => {
          const meta = SURVEY_INSTRUMENTS[id];
          const assignment = config[id]!;
          const availability = getSurveyAvailability(assignment);

          return (
            <section
              key={id}
              className="rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-[3px] w-5 rounded-full bg-role-spec"
                    />
                    <p className="font-display text-base text-ink">{meta.shortLabel}</p>
                  </div>
                  <p className="mt-1 text-sm text-inkMuted">{meta.label}</p>
                  <p className="mt-0.5 text-xs text-inkMuted">{meta.description}</p>
                  <p className="mt-2 text-xs text-inkMuted">{availability.reason}</p>
                </div>
                <AvailabilityPill availability={availability} enabled={assignment.enabled} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {!assignment.enabled ? (
                  <button
                    type="button"
                    onClick={() =>
                      update(id, {
                        enabled: true,
                        forceActive: true,
                        forceActivatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded-lg bg-brand px-3 py-2 text-sm font-display text-white transition-colors duration-150 ease-out-soft hover:bg-brand-dark"
                  >
                    Asignar y abrir
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        update(id, {
                          enabled: false,
                          forceActive: false,
                          forceActivatedAt: null,
                        })
                      }
                      className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-bold text-ink transition-colors duration-150 ease-out-soft hover:bg-brand-light"
                    >
                      Quitar asignación
                    </button>
                    {availability.status === 'waiting' && (
                      <button
                        type="button"
                        onClick={() =>
                          update(id, {
                            forceActive: true,
                            forceActivatedAt: new Date().toISOString(),
                          })
                        }
                        className="rounded-lg bg-brand px-3 py-2 text-sm font-display text-white transition-colors duration-150 ease-out-soft hover:bg-brand-dark"
                      >
                        Reabrir ahora
                      </button>
                    )}
                    {assignment.forceActive && (
                      <button
                        type="button"
                        onClick={() =>
                          update(id, { forceActive: false, forceActivatedAt: null })
                        }
                        className="rounded-lg px-3 py-2 text-sm font-bold text-brand-mid hover:underline"
                      >
                        Cerrar ventana
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4">
                <InstrumentRecords instrument={id} assignment={assignment} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function AvailabilityPill({
  availability,
  enabled,
}: {
  availability: ReturnType<typeof getSurveyAvailability>;
  enabled: boolean;
}) {
  if (!enabled || availability.status === 'disabled') {
    return (
      <span className="rounded-md bg-sunken px-2 py-1 text-xs font-bold text-inkMuted">
        No asignada
      </span>
    );
  }
  if (availability.status === 'available') {
    return (
      <span className="rounded-md bg-ok-soft px-2 py-1 text-xs font-bold text-ok">
        {availability.dueToForce ? 'Abierta ahora' : 'Pendiente'}
      </span>
    );
  }
  return (
    <span className="rounded-md bg-warn-soft px-2 py-1 text-xs font-bold text-warn">
      En espera · {availability.daysRemaining}d
    </span>
  );
}

/**
 * Inbox del paciente: solo las encuestas que el especialista ha abierto.
 */
export function PatientSurveyInbox({ patientKey }: { patientKey: string }) {
  const { config, replaceInstrument, ready } = usePatientSurveyConfig(patientKey);

  const items = useMemo(() => {
    return SURVEY_INSTRUMENT_IDS.map((id) => ({
      id,
      meta: SURVEY_INSTRUMENTS[id],
      assignment: config[id]!,
      availability: getSurveyAvailability(config[id]),
    }));
  }, [config]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        instrument: SurveyInstrumentId;
        score: Record<string, unknown>;
        patientKey?: string;
      };
      if (detail.patientKey && detail.patientKey !== patientKey) return;
      // Recargar desde storage (markSurveyCompleted ya persistió el historial).
      const store = readStore();
      const fresh = mergeSurveyConfig(store[patientKey]);
      replaceInstrument(detail.instrument, fresh[detail.instrument]!);
    };
    window.addEventListener('healthcloud:survey-complete', handler);
    return () => window.removeEventListener('healthcloud:survey-complete', handler);
  }, [patientKey, replaceInstrument]);

  if (!ready) return null;

  const available = items.filter((i) => i.availability.status === 'available');
  const assignedWaiting = items.filter((i) => i.availability.status === 'waiting');

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="signage-label text-inkMuted">Para completar ahora</h2>
        {available.length === 0 ? (
          <div className="rounded-xl border border-dashed border-lineStrong bg-surface/50 px-5 py-8 text-center text-sm text-inkMuted">
            No tienes encuestas abiertas por ahora.
          </div>
        ) : (
          <div className="grid gap-4">
            {available.map((item) => (
              <a
                key={item.id}
                href={`/demo/patient/surveys/${item.meta.slug}`}
                className="block rounded-xl border border-line bg-surface p-5 shadow-card transition duration-200 ease-out-soft hover:border-brand/30"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-[3px] w-5 shrink-0 rounded-full bg-role-patient"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-ink">{item.meta.shortLabel}</p>
                    <p className="mt-0.5 text-sm font-medium text-ink">{item.meta.label}</p>
                    <p className="mt-1 text-sm text-inkMuted">{item.meta.description}</p>
                    <p className="mt-2 text-xs text-brand-mid">{item.availability.reason}</p>
                  </div>
                  <span aria-hidden="true" className="text-inkMuted">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {assignedWaiting.length > 0 && (
        <section className="space-y-3">
          <h2 className="signage-label text-inkMuted">Asignadas · en espera</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {assignedWaiting.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="text-sm font-bold text-ink">{item.meta.shortLabel}</p>
                  <p className="text-xs text-inkMuted">{item.availability.reason}</p>
                </div>
                <AvailabilityPill
                  availability={item.availability}
                  enabled={item.assignment.enabled}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function markSurveyCompleted(
  instrument: SurveyInstrumentId,
  score: Record<string, unknown>,
  patientKey = 'camila-soto'
) {
  if (typeof window === 'undefined') return;

  try {
    const store = readStore();
    const current = mergeSurveyConfig(store[patientKey]);
    const summary = formatScoreSummary(instrument, score);
    store[patientKey] = {
      ...current,
      [instrument]: appendSurveyRecord(current[instrument]!, score, summary),
    };
    writeStore(store);
  } catch {
    // ignore
  }

  window.dispatchEvent(
    new CustomEvent('healthcloud:survey-complete', {
      detail: { instrument, score, patientKey },
    })
  );
}
