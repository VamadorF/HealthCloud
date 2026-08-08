'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  SURVEY_INSTRUMENTS,
  SURVEY_STORAGE_KEY,
  SurveyConfig,
  SurveyInstrumentId,
  getSurveyAvailability,
  mergeSurveyConfig,
  type InstrumentAssignment,
} from '@/lib/clinical/survey-schedule';

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

  return { config, update, ready };
}

/**
 * Controles del especialista: activar / desactivar / forzar fuera de cadencia.
 */
export function SpecialistSurveyControls({
  patientKey,
  patientName,
}: {
  patientKey: string;
  patientName: string;
}) {
  const { config, update, ready } = usePatientSurveyConfig(patientKey);
  const instruments = Object.keys(SURVEY_INSTRUMENTS) as SurveyInstrumentId[];

  if (!ready) {
    return (
      <p className="text-sm text-inkMuted">Cargando programación de encuestas…</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="signage-label text-inkMuted">Encuestas clínicas</p>
        <p className="mt-1 text-sm text-inkMuted">
          {patientName} · Cadencia por defecto cada 2 meses. Puedes desactivarlas o
          activarlas ahora fuera de ventana.
        </p>
      </div>

      <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
        {instruments.map((id) => {
          const meta = SURVEY_INSTRUMENTS[id];
          const assignment = config[id]!;
          const availability = getSurveyAvailability(assignment);

          return (
            <li key={id} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink">{meta.shortLabel}</p>
                  <p className="mt-0.5 text-sm text-inkMuted">{meta.description}</p>
                  <p className="mt-2 text-xs text-inkMuted">{availability.reason}</p>
                </div>
                <AvailabilityPill availability={availability} enabled={assignment.enabled} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    update(id, {
                      enabled: !assignment.enabled,
                      forceActive: assignment.enabled ? false : assignment.forceActive,
                    })
                  }
                  className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-bold text-ink transition-colors duration-150 ease-out-soft hover:bg-brand-light"
                >
                  {assignment.enabled ? 'Desactivar' : 'Activar encuesta'}
                </button>
                <button
                  type="button"
                  disabled={!assignment.enabled}
                  onClick={() =>
                    update(id, {
                      forceActive: true,
                      forceActivatedAt: new Date().toISOString(),
                    })
                  }
                  className="rounded-lg bg-brand px-3 py-2 text-sm font-display text-white transition-colors duration-150 ease-out-soft hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Activar ahora
                </button>
                {assignment.forceActive && (
                  <button
                    type="button"
                    onClick={() =>
                      update(id, { forceActive: false, forceActivatedAt: null })
                    }
                    className="rounded-lg px-3 py-2 text-sm font-bold text-brand-mid hover:underline"
                  >
                    Quitar activación forzada
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
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
        Desactivada
      </span>
    );
  }
  if (availability.status === 'available') {
    return (
      <span className="rounded-md bg-ok-soft px-2 py-1 text-xs font-bold text-ok">
        {availability.dueToForce ? 'Forzada' : 'Disponible'}
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
 * Lista de encuestas disponibles para el paciente (demo / localStorage).
 */
export function PatientSurveyInbox({ patientKey }: { patientKey: string }) {
  const { config, update, ready } = usePatientSurveyConfig(patientKey);
  const instruments = Object.keys(SURVEY_INSTRUMENTS) as SurveyInstrumentId[];

  const items = useMemo(() => {
    return instruments.map((id) => ({
      id,
      meta: SURVEY_INSTRUMENTS[id],
      assignment: config[id]!,
      availability: getSurveyAvailability(config[id]),
    }));
  }, [config, instruments]);

  if (!ready) return null;

  const available = items.filter((i) => i.availability.status === 'available');
  const waiting = items.filter((i) => i.availability.status === 'waiting');
  const disabled = items.filter((i) => i.availability.status === 'disabled');

  return (
    <div className="space-y-6">
      {available.length > 0 ? (
        <section className="space-y-3">
          <h2 className="signage-label text-inkMuted">Pendientes ahora</h2>
          {available.map((item) => (
            <a
              key={item.id}
              href={`/demo/patient/surveys/${item.id === 'PSS-14' ? 'pss' : 'psqi'}`}
              className="block rounded-xl border border-line bg-surface p-5 shadow-card transition duration-200 ease-out-soft hover:border-brand/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-ink">{item.meta.label}</p>
                  <p className="mt-1 text-sm text-inkMuted">{item.meta.description}</p>
                  <p className="mt-2 text-xs text-brand-mid">{item.availability.reason}</p>
                </div>
                <span aria-hidden="true" className="text-inkMuted">
                  →
                </span>
              </div>
            </a>
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-lineStrong bg-surface/50 px-5 py-8 text-center text-sm text-inkMuted">
          No tienes encuestas pendientes. La siguiente ventana es cada 2 meses, salvo que tu
          especialista las active.
        </section>
      )}

      {(waiting.length > 0 || disabled.length > 0) && (
        <section className="space-y-3">
          <h2 className="signage-label text-inkMuted">Programación</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {[...waiting, ...disabled].map((item) => (
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

      {/* Helper demo: marcar como completada tras enviar en páginas de encuesta */}
      <span className="hidden" aria-hidden="true" data-survey-ready={ready ? '1' : '0'} />
      {/* expose update for sibling pages via custom event */}
      <SurveyCompletionBridge patientKey={patientKey} onComplete={update} />
    </div>
  );
}

function SurveyCompletionBridge({
  patientKey,
  onComplete,
}: {
  patientKey: string;
  onComplete: (
    instrument: SurveyInstrumentId,
    patch: Partial<InstrumentAssignment>
  ) => void;
}) {
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        instrument: SurveyInstrumentId;
        score: Record<string, unknown>;
        patientKey?: string;
      };
      if (detail.patientKey && detail.patientKey !== patientKey) return;
      onComplete(detail.instrument, {
        lastCompletedAt: new Date().toISOString(),
        lastScore: detail.score,
        forceActive: false,
        forceActivatedAt: null,
      });
    };
    window.addEventListener('healthcloud:survey-complete', handler);
    return () => window.removeEventListener('healthcloud:survey-complete', handler);
  }, [onComplete, patientKey]);
  return null;
}

export function markSurveyCompleted(
  instrument: SurveyInstrumentId,
  score: Record<string, unknown>,
  patientKey = 'camila-soto'
) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('healthcloud:survey-complete', {
      detail: { instrument, score, patientKey },
    })
  );

  // Persist even if inbox isn't mounted
  try {
    const store = readStore();
    const current = mergeSurveyConfig(store[patientKey]);
    store[patientKey] = {
      ...current,
      [instrument]: {
        ...current[instrument]!,
        lastCompletedAt: new Date().toISOString(),
        lastScore: score,
        forceActive: false,
        forceActivatedAt: null,
      },
    };
    writeStore(store);
  } catch {
    // ignore
  }
}
