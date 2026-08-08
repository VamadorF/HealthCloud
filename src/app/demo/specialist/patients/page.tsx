'use client';

import { useEffect, useState } from 'react';
import { DemoShell, Panel, StatusPill } from '@/components/demo/demo-shell';
import { SpecialistSurveyControls } from '@/components/clinical/survey-controls';
import {
  SURVEY_STORAGE_KEY,
  mergeSurveyConfig,
  type SurveyConfig,
} from '@/lib/clinical/survey-schedule';

const PATIENTS = [
  {
    key: 'camila-soto',
    name: 'Camila Soto',
    age: '34 años',
    last: 'Control hipertensión · 12 Mar',
    tag: 'Seguimiento',
  },
  {
    key: 'roberto-diaz',
    name: 'Roberto Díaz',
    age: '58 años',
    last: 'Diabetes · Hoy',
    tag: 'Crónico',
  },
  {
    key: 'maria-jose-vera',
    name: 'María José Vera',
    age: '41 años',
    last: 'Dislipidemia · Ayer',
    tag: 'Seguimiento',
  },
  {
    key: 'felipe-arancibia',
    name: 'Felipe Arancibia',
    age: '29 años',
    last: 'Primera consulta · Pendiente',
    tag: 'Nuevo',
  },
];

/** Datos de demostración para que el especialista vea registros en la ficha. */
function seedRobertoIfNeeded() {
  try {
    const raw = window.localStorage.getItem(SURVEY_STORAGE_KEY);
    const store = raw ? (JSON.parse(raw) as Record<string, SurveyConfig>) : {};
    if (store['roberto-diaz']?.['PSS-14']?.history?.length) return;

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
    });
    window.localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export default function DemoSpecialistPatientsPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedRobertoIfNeeded();
    setReady(true);
  }, []);

  return (
    <DemoShell
      role="specialist"
      title="Mis pacientes"
      subtitle="Asigna encuestas por separado y revisa los registros de cada escala"
    >
      {!ready ? (
        <p className="text-sm text-inkMuted">Cargando fichas…</p>
      ) : (
        <div className="space-y-6">
          {PATIENTS.map((patient) => (
            <Panel
              key={patient.key}
              title={patient.name}
              action={<StatusPill status={patient.tag} />}
            >
              <div className="mb-5 flex flex-wrap gap-4 text-sm text-inkMuted">
                <span>{patient.age}</span>
                <span>{patient.last}</span>
              </div>
              <SpecialistSurveyControls
                patientKey={patient.key}
                patientName={patient.name}
              />
            </Panel>
          ))}
        </div>
      )}
    </DemoShell>
  );
}
