'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/platform/platform-shell';
import { PssScoreSummary } from '@/components/clinical/pss-scale';
import { PsqiScoreSummary } from '@/components/clinical/psqi-scale';
import { PcsScoreSummary } from '@/components/clinical/pcs-scale';
import { RosterSplit, RosterToolbar } from '@/components/clinical/roster-toolbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/ui/submit-button';
import { recordConsultation } from '@/app/specialist/actions';
import type { PcsBand } from '@/lib/clinical/pcs';
import type { PsqiBand } from '@/lib/clinical/psqi';
import type { PssBand, PssClinicalPayload } from '@/lib/clinical/pss';

export type AuthConsultationRow = {
  id: string;
  patientName: string;
  scheduledLabel: string;
  scheduledAtMs: number;
  status: string;
  reason: string;
  hasConsultation: boolean;
  diagnosis: string | null;
  notes: string | null;
  isToday: boolean;
  pss?: { total: number; band?: PssBand; bandLabel?: string } | null;
  psqi?: { global: number; band?: PsqiBand; bandLabel?: string } | null;
  pcs?: { total: number; band?: PcsBand; bandLabel?: string } | null;
  clinicalPss?: PssClinicalPayload | null;
};

type FilterId = 'todas' | 'hoy' | 'por_registrar' | 'registrada';

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'hoy', label: 'Hoy' },
  { id: 'por_registrar', label: 'Por registrar' },
  { id: 'registrada', label: 'Registradas' },
];

export function AuthSpecialistConsultationsWorkspace({
  appointments,
}: {
  appointments: AuthConsultationRow[];
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterId>('todas');
  const [selectedId, setSelectedId] = useState(appointments[0]?.id ?? '');

  const counts = useMemo(() => {
    return {
      todas: appointments.length,
      hoy: appointments.filter((a) => a.isToday).length,
      por_registrar: appointments.filter((a) => !a.hasConsultation).length,
      registrada: appointments.filter((a) => a.hasConsultation).length,
    };
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter((item) => {
      if (filter === 'hoy' && !item.isToday) return false;
      if (filter === 'por_registrar' && item.hasConsultation) return false;
      if (filter === 'registrada' && !item.hasConsultation) return false;
      if (!q) return true;
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q) ||
        (item.diagnosis ?? '').toLowerCase().includes(q) ||
        item.scheduledLabel.toLowerCase().includes(q)
      );
    });
  }, [appointments, filter, search]);

  useEffect(() => {
    if (!filtered.some((a) => a.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? '');
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((a) => a.id === selectedId) ?? null;

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-lineStrong bg-surface/50 px-5 py-12 text-center text-sm text-inkMuted">
        No hay consultas para registrar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RosterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por paciente, motivo o diagnóstico…"
        filters={FILTERS.map((option) => ({
          id: option.id,
          label: option.label,
          count: counts[option.id],
        }))}
        activeFilter={filter}
        onFilterChange={(id) => setFilter(id as FilterId)}
        resultLabel={`${filtered.length} de ${appointments.length} consultas`}
      />

      <RosterSplit
        listWidthClass="lg:w-[340px]"
        list={
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <p className="signage-label border-b border-line px-4 py-3 text-inkMuted">
              Atenciones
            </p>
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-inkMuted">
                Ninguna consulta coincide con el filtro.
              </p>
            ) : (
              <ul className="max-h-[min(70vh,720px)] divide-y divide-line overflow-y-auto">
                {filtered.map((item) => {
                  const active = item.id === selectedId;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={`flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors duration-150 ease-out-soft ${
                          active ? 'bg-brand-light/60' : 'hover:bg-canvas/70'
                        }`}
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span className="truncate text-sm font-bold text-ink">
                            {item.patientName}
                          </span>
                          <StatusBadge status={item.status} />
                        </span>
                        <span className="text-xs tabular-nums text-inkMuted">
                          {item.scheduledLabel}
                        </span>
                        <span className="truncate text-xs text-inkMuted">
                          {item.hasConsultation
                            ? item.diagnosis || 'Consulta registrada'
                            : item.reason || 'Por registrar'}
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
                  <p className="signage-label text-inkMuted">Consulta</p>
                  <h2 className="mt-1 font-display text-2xl text-ink">
                    {selected.patientName}
                  </h2>
                  <p className="mt-1 text-sm text-inkMuted">
                    {selected.scheduledLabel}
                    {selected.reason ? ` · ${selected.reason}` : ''}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="space-y-5 px-5 py-5">
                {(selected.pss ||
                  selected.psqi ||
                  selected.pcs ||
                  selected.clinicalPss) && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(selected.clinicalPss || selected.pss?.total != null) && (
                      <PssScoreSummary
                        total={selected.clinicalPss?.total ?? selected.pss!.total}
                        band={selected.clinicalPss?.band ?? selected.pss?.band}
                        bandLabel={
                          selected.clinicalPss?.bandLabel ?? selected.pss?.bandLabel
                        }
                      />
                    )}
                    {selected.psqi?.global != null && (
                      <PsqiScoreSummary
                        global={selected.psqi.global}
                        band={selected.psqi.band}
                        bandLabel={selected.psqi.bandLabel}
                      />
                    )}
                    {selected.pcs?.total != null && (
                      <PcsScoreSummary
                        total={selected.pcs.total}
                        band={selected.pcs.band}
                        bandLabel={selected.pcs.bandLabel}
                      />
                    )}
                  </div>
                )}

                {selected.hasConsultation ? (
                  <div className="rounded-lg bg-canvas p-4 text-sm text-ink">
                    <p>
                      <strong>Diagnóstico:</strong> {selected.diagnosis}
                    </p>
                    {selected.notes ? (
                      <p className="mt-2">
                        <strong>Notas:</strong> {selected.notes}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <form action={recordConsultation} className="grid gap-5">
                    <input type="hidden" name="appointmentId" value={selected.id} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input name="diagnosis" label="Diagnóstico" required />
                      <Input
                        name="vitals"
                        label="Signos vitales (JSON)"
                        defaultValue='{"presion":"120/80","temperatura":"36.5"}'
                      />
                    </div>
                    <Textarea
                      id={`notes-${selected.id}`}
                      name="clinicalNotes"
                      label="Notas clínicas"
                      rows={4}
                    />
                    <Input
                      name="treatment"
                      label="Tratamiento (JSON)"
                      defaultValue='{"medicamentos":[],"indicaciones":""}'
                    />
                    <p className="text-sm text-inkMuted">
                      Las encuestas se gestionan en{' '}
                      <Link
                        href="/specialist/patients"
                        className="font-bold text-brand-mid hover:underline"
                      >
                        Pacientes
                      </Link>
                      .
                    </p>
                    <div>
                      <SubmitButton>Registrar consulta</SubmitButton>
                    </div>
                  </form>
                )}
              </div>
            </section>
          ) : (
            <div className="rounded-xl border border-dashed border-lineStrong bg-surface/50 px-5 py-12 text-center text-sm text-inkMuted">
              Selecciona una atención del listado.
            </div>
          )
        }
      />
    </div>
  );
}
