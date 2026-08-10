'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { DemoShell, Panel, TimelineItem, MetricGrid } from '@/components/demo/demo-shell';
import { WidgetGate } from '@/components/platform/widget-preferences';
import { SpecialistScheduleView } from '@/components/clinical/specialist-schedule-view';
import { SPECIALIST_AGENDA } from '@/lib/mock/demo-data';
import { buildDemoSpecialistScheduleEvents } from '@/lib/mock/specialist-schedule';

const CURRENT = SPECIALIST_AGENDA.find((item) => item.status === 'En sala') ?? SPECIALIST_AGENDA[0];
const WAITING = SPECIALIST_AGENDA.filter((item) => item.status === 'En sala').length;
const TO_CONFIRM = SPECIALIST_AGENDA.filter((item) => item.status === 'Solicitada').length;

export default function DemoSpecialistPage() {
  const events = useMemo(() => buildDemoSpecialistScheduleEvents(), []);

  return (
    <DemoShell
      role="specialist"
      title="Agenda de hoy"
      subtitle="Miércoles 9 de abril · Medicina interna · Box 3"
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.85fr)]">
        <SpecialistScheduleView
          title="Cronograma"
          summary={
            <span className="text-xs tabular-nums text-inkMuted">
              {SPECIALIST_AGENDA.length} atenciones hoy · 09:00–11:15
            </span>
          }
          events={events}
          flushAgenda={false}
          agenda={
            <div className="space-y-0">
              {SPECIALIST_AGENDA.map((item) => (
                <TimelineItem
                  key={item.time}
                  time={item.time}
                  title={item.patient}
                  meta={`${item.reason} · ${item.room}`}
                  status={item.status}
                  accent={item.status === 'En sala'}
                />
              ))}
            </div>
          }
        />

        <WidgetGate id="specialist.nextStep">
          <Panel
            title="En curso"
            action={
              <Link
                href="/demo/specialist/consultations"
                className="text-sm font-bold text-brand-mid hover:underline"
              >
                Consultas
              </Link>
            }
          >
            <div className="rounded-xl border border-brand/20 bg-brand-light/40 px-5 py-5">
              <p className="signage-label text-brand-mid">Ahora · {CURRENT.time}</p>
              <p className="mt-2 font-display text-xl text-ink">{CURRENT.patient}</p>
              <p className="mt-1 text-sm text-inkMuted">
                {CURRENT.reason} · {CURRENT.room}
              </p>
              <p className="mt-3 text-sm font-medium text-brand-mid">{CURRENT.status}</p>
              <Link
                href="/demo/specialist/consultations"
                className="mt-5 inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
              >
                Continuar consulta
              </Link>
            </div>
          </Panel>
        </WidgetGate>
      </div>

      <WidgetGate id="specialist.daySummary">
        <div className="mt-8 space-y-6">
          <section className="rounded-xl border border-line bg-surface px-5 py-4 shadow-card">
            <p className="signage-label text-inkMuted">Resumen de jornada</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-inkMuted">Sala de espera</dt>
                <dd className="mt-0.5 font-display text-lg tabular-nums text-ink">{WAITING}</dd>
              </div>
              <div>
                <dt className="text-inkMuted">Por confirmar</dt>
                <dd className="mt-0.5 font-display text-lg tabular-nums text-ink">{TO_CONFIRM}</dd>
              </div>
              <div>
                <dt className="text-inkMuted">Próximo hueco</dt>
                <dd className="mt-0.5 font-display text-lg tabular-nums text-ink">12:00</dd>
              </div>
              <div>
                <dt className="text-inkMuted">Box asignado</dt>
                <dd className="mt-0.5 font-display text-lg text-ink">3</dd>
              </div>
            </dl>
          </section>
          <MetricGrid
            items={[
              { label: 'Citas programadas', value: '4', delta: '1 en sala de espera' },
              { label: 'Consultas por registrar', value: '2', delta: 'De ayer' },
              { label: 'Pacientes en seguimiento', value: '98', delta: 'Activos' },
              { label: 'Próximo hueco', value: '12:00', delta: 'Disponible' },
            ]}
          />
        </div>
      </WidgetGate>
    </DemoShell>
  );
}
