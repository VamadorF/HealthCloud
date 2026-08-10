'use client';

import { useEffect, useMemo, useState } from 'react';
import { AuthSpecialistSurveyControls } from '@/components/clinical/auth-survey-controls';
import { RosterSplit, RosterToolbar } from '@/components/clinical/roster-toolbar';
import type { SurveyConfig } from '@/lib/clinical/survey-schedule';

export type AuthPatientRow = {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  allergies: string;
  surveyConfig: SurveyConfig;
};

export function AuthSpecialistPatientsWorkspace({
  patients,
}: {
  patients: AuthPatientRow[];
}) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(patients[0]?.id ?? '');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(q) ||
        patient.email.toLowerCase().includes(q) ||
        patient.bloodType.toLowerCase().includes(q) ||
        patient.allergies.toLowerCase().includes(q)
    );
  }, [patients, search]);

  useEffect(() => {
    if (!filtered.some((p) => p.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? '');
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((p) => p.id === selectedId) ?? null;

  if (patients.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface px-5 py-10 text-center text-sm text-inkMuted shadow-card">
        Aún no tienes pacientes asignados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RosterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, correo o alergias…"
        filters={[]}
        activeFilter="todos"
        onFilterChange={() => undefined}
        resultLabel={`${filtered.length} de ${patients.length} pacientes`}
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
                  const active = patient.id === selectedId;
                  return (
                    <li key={patient.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(patient.id)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out-soft ${
                          active ? 'bg-brand-light/60' : 'hover:bg-canvas/70'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 h-[3px] w-4 shrink-0 rounded-full ${
                            active ? 'bg-role-spec' : 'bg-lineStrong'
                          }`}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-ink">
                            {patient.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-inkMuted">
                            {patient.email}
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
              <div className="border-b border-line px-5 py-4">
                <p className="signage-label text-inkMuted">Ficha</p>
                <h2 className="mt-1 font-display text-2xl text-ink">{selected.name}</h2>
              </div>
              <div className="space-y-5 px-5 py-5">
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="signage-label text-inkMuted">Contacto</dt>
                    <dd className="mt-1 text-ink">{selected.email}</dd>
                  </div>
                  <div>
                    <dt className="signage-label text-inkMuted">Tipo de sangre</dt>
                    <dd className="mt-1 text-ink">{selected.bloodType}</dd>
                  </div>
                  <div>
                    <dt className="signage-label text-inkMuted">Alergias</dt>
                    <dd className="mt-1 text-ink">{selected.allergies}</dd>
                  </div>
                </dl>
                <AuthSpecialistSurveyControls
                  patientId={selected.id}
                  patientName={selected.name}
                  initialConfig={selected.surveyConfig}
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
