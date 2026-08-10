'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PssScoreSummary } from '@/components/clinical/pss-scale';
import { PsqiScoreSummary } from '@/components/clinical/psqi-scale';
import { PcsScoreSummary } from '@/components/clinical/pcs-scale';
import { RosterSplit, RosterToolbar } from '@/components/clinical/roster-toolbar';
import { fieldStyles, FieldLabel } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DEMO_CONSULTATION_FILTERS,
  DEMO_SPECIALIST_CONSULTATIONS,
  type DemoConsultation,
  type DemoConsultationFilterId,
} from '@/lib/mock/specialist-consultations';

function statusLabel(status: DemoConsultation['status']) {
  if (status === 'en_curso') return 'En curso';
  if (status === 'por_registrar') return 'Por registrar';
  return 'Registrada';
}

function statusTone(status: DemoConsultation['status']) {
  if (status === 'en_curso') return 'bg-brand-light text-brand-mid';
  if (status === 'por_registrar') return 'bg-warn-soft text-warn';
  return 'bg-ok-soft text-ok';
}

function matchesQuery(item: DemoConsultation, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    item.patient.toLowerCase().includes(q) ||
    item.reason.toLowerCase().includes(q) ||
    item.diagnosis.toLowerCase().includes(q) ||
    item.date.toLowerCase().includes(q)
  );
}

export function SpecialistConsultationsWorkspace() {
  const [items, setItems] = useState(DEMO_SPECIALIST_CONSULTATIONS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DemoConsultationFilterId>('todas');
  const [selectedId, setSelectedId] = useState(
    () =>
      DEMO_SPECIALIST_CONSULTATIONS.find((c) => c.status === 'en_curso')?.id ??
      DEMO_SPECIALIST_CONSULTATIONS[0]?.id ??
      ''
  );

  const counts = useMemo(() => {
    return {
      todas: items.length,
      hoy: items.filter((c) => c.dayOffset === 0).length,
      por_registrar: items.filter((c) => c.status === 'por_registrar').length,
      en_curso: items.filter((c) => c.status === 'en_curso').length,
      registrada: items.filter((c) => c.status === 'registrada').length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'hoy' && item.dayOffset !== 0) return false;
      if (filter !== 'todas' && filter !== 'hoy' && item.status !== filter) return false;
      return matchesQuery(item, search);
    });
  }, [items, filter, search]);

  useEffect(() => {
    if (!filtered.some((c) => c.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? '');
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((c) => c.id === selectedId) ?? null;

  function saveConsultation(formData: FormData) {
    if (!selected) return;
    const diagnosis = String(formData.get('diagnosis') ?? '').trim();
    const notes = String(formData.get('clinicalNotes') ?? '').trim();
    const vitals = String(formData.get('vitals') ?? '').trim();
    if (!diagnosis) return;

    setItems((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              diagnosis,
              notes,
              vitals: vitals || item.vitals,
              status: item.status === 'en_curso' ? 'registrada' : 'registrada',
            }
          : item
      )
    );
  }

  return (
    <div className="space-y-4">
      <RosterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por paciente, motivo o diagnóstico…"
        filters={DEMO_CONSULTATION_FILTERS.map((option) => ({
          id: option.id,
          label: option.label,
          count: counts[option.id],
        }))}
        activeFilter={filter}
        onFilterChange={(id) => setFilter(id as DemoConsultationFilterId)}
        resultLabel={`${filtered.length} de ${items.length} consultas`}
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
                            {item.patient}
                          </span>
                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${statusTone(item.status)}`}
                          >
                            {statusLabel(item.status)}
                          </span>
                        </span>
                        <span className="text-xs tabular-nums text-inkMuted">{item.date}</span>
                        <span className="truncate text-xs text-inkMuted">{item.reason}</span>
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
                  <h2 className="mt-1 font-display text-2xl text-ink">{selected.patient}</h2>
                  <p className="mt-1 text-sm text-inkMuted">
                    {selected.date} · {selected.reason}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2 py-1 text-xs font-bold ${statusTone(selected.status)}`}
                >
                  {statusLabel(selected.status)}
                </span>
              </div>

              <div className="space-y-5 px-5 py-5">
                {(selected.pss || selected.psqi || selected.pcs) && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {selected.pss ? (
                      <PssScoreSummary
                        total={selected.pss.total}
                        band={selected.pss.band}
                        bandLabel={selected.pss.bandLabel}
                      />
                    ) : null}
                    {selected.psqi ? (
                      <PsqiScoreSummary
                        global={selected.psqi.global}
                        band={selected.psqi.band}
                        bandLabel={selected.psqi.bandLabel}
                      />
                    ) : null}
                    {selected.pcs ? (
                      <PcsScoreSummary
                        total={selected.pcs.total}
                        band={selected.pcs.band}
                        bandLabel={selected.pcs.bandLabel}
                      />
                    ) : null}
                  </div>
                )}

                {selected.status === 'registrada' ||
                (selected.status === 'en_curso' && selected.diagnosis) ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="signage-label text-inkMuted">Diagnóstico</p>
                      <p className="mt-1 text-ink">{selected.diagnosis || '—'}</p>
                    </div>
                    <div>
                      <p className="signage-label text-inkMuted">Signos vitales</p>
                      <p className="mt-1 text-ink">{selected.vitals || '—'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="signage-label text-inkMuted">Notas clínicas</p>
                      <p className="mt-1 text-sm leading-relaxed text-inkMuted">
                        {selected.notes || 'Sin notas.'}
                      </p>
                    </div>
                    {selected.status === 'en_curso' ? (
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={() =>
                            setItems((current) =>
                              current.map((item) =>
                                item.id === selected.id
                                  ? { ...item, status: 'registrada' }
                                  : item
                              )
                            )
                          }
                          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-display text-white transition-colors duration-150 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
                        >
                          Cerrar consulta
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      saveConsultation(new FormData(event.currentTarget));
                    }}
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel htmlFor={`dx-${selected.id}`}>Diagnóstico</FieldLabel>
                        <input
                          id={`dx-${selected.id}`}
                          name="diagnosis"
                          required
                          className={fieldStyles}
                          placeholder="Diagnóstico clínico"
                          defaultValue={selected.diagnosis}
                        />
                      </div>
                      <div>
                        <FieldLabel htmlFor={`vitals-${selected.id}`}>Signos vitales</FieldLabel>
                        <input
                          id={`vitals-${selected.id}`}
                          name="vitals"
                          className={fieldStyles}
                          placeholder="PA 120/80 · FC 72"
                          defaultValue={selected.vitals}
                        />
                      </div>
                    </div>
                    <Textarea
                      id={`notes-${selected.id}`}
                      name="clinicalNotes"
                      label="Notas clínicas"
                      rows={4}
                      placeholder="Evolución, plan e indicaciones…"
                      defaultValue={selected.notes}
                    />
                    <p className="text-sm text-inkMuted">
                      Las encuestas se gestionan en{' '}
                      <Link
                        href="/demo/specialist/patients"
                        className="font-bold text-brand-mid hover:underline"
                      >
                        Pacientes
                      </Link>
                      .
                    </p>
                    <div>
                      <button
                        type="submit"
                        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-display text-white transition-colors duration-150 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
                      >
                        Registrar consulta
                      </button>
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
