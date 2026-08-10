'use client';

import { useEffect, useMemo, useState } from 'react';
import { StatusPill } from '@/components/demo/demo-shell';
import { SpecialistSurveyControls } from '@/components/clinical/survey-controls';
import { RosterSplit, RosterToolbar } from '@/components/clinical/roster-toolbar';
import {
  DEMO_PATIENT_TAGS,
  DEMO_SPECIALIST_PATIENTS,
  type DemoPatient,
  type DemoPatientTag,
} from '@/lib/mock/specialist-patients';
import {
  SURVEY_STORAGE_KEY,
  mergeSurveyConfig,
  type SurveyConfig,
} from '@/lib/clinical/survey-schedule';

const ROBERTO_DOLOR_SEED = {
  enabled: true,
  forceActive: false,
  lastCompletedAt: '2026-07-20T12:00:00.000Z',
  lastScore: {
    kind: 'pain-assessment',
    onset: 'Hace 3 semanas, tras un esfuerzo en el jardín',
    onsetDate: '2026-06-28',
    locations: ['espalda', 'pierna_izq'],
    intensityEva: 6,
    characteristics: ['punzante', 'arde'],
    radiation: 'down',
    radiationDetail: 'Baja hacia la pierna izquierda',
    relieves: 'Reposo y calor local',
    aggravates: 'Estar de pie mucho rato',
    bandLabel: 'Dolor moderado',
  },
  history: [
    {
      completedAt: '2026-07-20T12:00:00.000Z',
      score: {
        kind: 'pain-assessment',
        onset: 'Hace 3 semanas, tras un esfuerzo en el jardín',
        onsetDate: '2026-06-28',
        locations: ['espalda', 'pierna_izq'],
        intensityEva: 6,
        characteristics: ['punzante', 'arde'],
        radiation: 'down',
        radiationDetail: 'Baja hacia la pierna izquierda',
        relieves: 'Reposo y calor local',
        aggravates: 'Estar de pie mucho rato',
        bandLabel: 'Dolor moderado',
      },
      summary: 'EVA 6/10 · Dolor moderado · Espalda, Pierna izq. · Punzante, Arde',
    },
  ],
} as const;

function seedRobertoIfNeeded() {
  try {
    const raw = window.localStorage.getItem(SURVEY_STORAGE_KEY);
    const store = raw ? (JSON.parse(raw) as Record<string, SurveyConfig>) : {};
    const existing = mergeSurveyConfig(store['roberto-diaz']);

    if (existing['PSS-14']?.history?.length) {
      if (!existing.DOLOR?.history?.length) {
        store['roberto-diaz'] = mergeSurveyConfig({
          ...existing,
          DOLOR: { ...ROBERTO_DOLOR_SEED, history: [...ROBERTO_DOLOR_SEED.history] },
        });
        window.localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(store));
      }
      return;
    }

    store['roberto-diaz'] = mergeSurveyConfig({
      'PSS-14': {
        enabled: true,
        forceActive: false,
        lastCompletedAt: '2026-06-10T15:20:00.000Z',
        lastScore: {
          total: 24,
          band: 'moderate',
          bandLabel: 'Estrés percibido moderado',
        },
        history: [
          {
            completedAt: '2026-06-10T15:20:00.000Z',
            score: {
              total: 24,
              band: 'moderate',
              bandLabel: 'Estrés percibido moderado',
            },
            summary: 'PSS 24/56 · Estrés percibido moderado',
          },
          {
            completedAt: '2026-04-02T11:05:00.000Z',
            score: {
              total: 31,
              band: 'high',
              bandLabel: 'Estrés percibido alto',
            },
            summary: 'PSS 31/56 · Estrés percibido alto',
          },
        ],
      },
      PSQI: {
        enabled: true,
        forceActive: false,
        lastCompletedAt: '2026-06-10T15:40:00.000Z',
        lastScore: {
          global: 8,
          band: 'poor',
          bandLabel: 'Mala calidad de sueño',
        },
        history: [
          {
            completedAt: '2026-06-10T15:40:00.000Z',
            score: {
              global: 8,
              band: 'poor',
              bandLabel: 'Mala calidad de sueño',
            },
            summary: 'PSQI 8/21 · Mala calidad de sueño',
          },
        ],
      },
      PCS: {
        enabled: true,
        forceActive: true,
        forceActivatedAt: '2026-08-08T10:00:00.000Z',
        lastCompletedAt: '2026-05-01T09:00:00.000Z',
        lastScore: {
          total: 34,
          band: 'clinical',
          bandLabel: 'Nivel clínicamente significativo',
        },
        history: [
          {
            completedAt: '2026-05-01T09:00:00.000Z',
            score: {
              total: 34,
              band: 'clinical',
              bandLabel: 'Nivel clínicamente significativo',
            },
            summary: 'PCS 34/52 · Nivel clínicamente significativo',
          },
        ],
      },
      DOLOR: { ...ROBERTO_DOLOR_SEED, history: [...ROBERTO_DOLOR_SEED.history] },
    });
    window.localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

function matchesQuery(patient: DemoPatient, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    patient.name.toLowerCase().includes(q) ||
    patient.condition.toLowerCase().includes(q) ||
    patient.last.toLowerCase().includes(q) ||
    patient.tag.toLowerCase().includes(q)
  );
}

export function SpecialistPatientsWorkspace() {
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState<DemoPatientTag | 'Todos'>('Todos');
  const [selectedKey, setSelectedKey] = useState(DEMO_SPECIALIST_PATIENTS[0]?.key ?? '');

  useEffect(() => {
    seedRobertoIfNeeded();
    setReady(true);
  }, []);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: DEMO_SPECIALIST_PATIENTS.length };
    for (const patient of DEMO_SPECIALIST_PATIENTS) {
      counts[patient.tag] = (counts[patient.tag] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return DEMO_SPECIALIST_PATIENTS.filter((patient) => {
      if (tag !== 'Todos' && patient.tag !== tag) return false;
      return matchesQuery(patient, search);
    });
  }, [search, tag]);

  useEffect(() => {
    if (!filtered.some((p) => p.key === selectedKey)) {
      setSelectedKey(filtered[0]?.key ?? '');
    }
  }, [filtered, selectedKey]);

  const selected = filtered.find((p) => p.key === selectedKey) ?? null;

  if (!ready) {
    return <p className="text-sm text-inkMuted">Cargando fichas…</p>;
  }

  return (
    <div className="space-y-4">
      <RosterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, condición o etiqueta…"
        filters={DEMO_PATIENT_TAGS.map((id) => ({
          id,
          label: id,
          count: tagCounts[id] ?? 0,
        }))}
        activeFilter={tag}
        onFilterChange={(id) => setTag(id as DemoPatientTag | 'Todos')}
        resultLabel={`${filtered.length} de ${DEMO_SPECIALIST_PATIENTS.length} pacientes`}
      />

      <RosterSplit
        list={
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <p className="signage-label border-b border-line px-4 py-3 text-inkMuted">
              Listado
            </p>
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-inkMuted">
                Ningún paciente coincide con la búsqueda.
              </p>
            ) : (
              <ul className="max-h-[min(70vh,720px)] divide-y divide-line overflow-y-auto">
                {filtered.map((patient) => {
                  const active = patient.key === selectedKey;
                  return (
                    <li key={patient.key}>
                      <button
                        type="button"
                        onClick={() => setSelectedKey(patient.key)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out-soft ${
                          active
                            ? 'bg-brand-light/60'
                            : 'hover:bg-canvas/70'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 h-[3px] w-4 shrink-0 rounded-full ${
                            active ? 'bg-role-spec' : 'bg-lineStrong'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="truncate text-sm font-bold text-ink">
                              {patient.name}
                            </span>
                            <StatusPill status={patient.tag} />
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-inkMuted">
                            {patient.condition} · {patient.age}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-inkMuted">
                            {patient.last}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        }
        detail={
          selected ? (
            <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
                <div className="min-w-0">
                  <p className="signage-label text-inkMuted">Ficha</p>
                  <h2 className="mt-1 font-display text-2xl text-ink">{selected.name}</h2>
                  <p className="mt-1 text-sm text-inkMuted">
                    {selected.age} · {selected.condition} · {selected.last}
                  </p>
                </div>
                <StatusPill status={selected.tag} />
              </div>
              <div className="px-5 py-5">
                <SpecialistSurveyControls
                  patientKey={selected.key}
                  patientName={selected.name}
                />
              </div>
            </section>
          ) : (
            <div className="rounded-xl border border-dashed border-lineStrong bg-surface/50 px-5 py-12 text-center text-sm text-inkMuted">
              Selecciona un paciente del listado.
            </div>
          )
        }
      />
    </div>
  );
}
