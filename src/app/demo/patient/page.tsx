import Link from 'next/link';
import { DemoShell, MetricGrid, Panel, StatusPill } from '@/components/demo/demo-shell';
import { WidgetGate } from '@/components/platform/widget-preferences';
import { PATIENT_APPOINTMENTS } from '@/lib/mock/demo-data';

export default function DemoPatientPage() {
  const nextAppointment = PATIENT_APPOINTMENTS[0];

  return (
    <DemoShell
      role="patient"
      title="Hola, Camila"
      subtitle="Tu salud, organizada en un solo lugar"
    >
      {/* Una sola señal de próxima cita — sin duplicar en métricas */}
      {nextAppointment && (
        <section className="rounded-xl border border-line bg-surface px-5 py-5 shadow-card sm:px-6">
          <p className="signage-label text-inkMuted">Próxima cita</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-2xl text-ink">{nextAppointment.date}</p>
              <p className="mt-1 text-sm text-inkMuted">
                {nextAppointment.doctor} · {nextAppointment.place}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={nextAppointment.status} />
              <Link
                href="/demo/patient/appointments"
                className="text-sm font-bold text-brand-mid hover:underline"
              >
                Ver agenda
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Acción primaria: registrar síntomas siempre a un toque */}
      <section
        className={`${nextAppointment ? 'mt-5' : ''} rounded-xl border border-brand/25 bg-brand-light/60 px-5 py-5 sm:px-6`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-[3px] w-5 shrink-0 rounded-full bg-role-patient"
              />
              <p className="signage-label text-brand-mid">Ahora</p>
            </div>
            <p className="mt-2 font-display text-2xl leading-tight text-ink">
              Registrar síntomas
            </p>
            <p className="mt-1 max-w-md text-sm text-inkMuted">
              Dolor con EVA/ENA, zonas afectadas y cómo te sientes entre consultas.
            </p>
          </div>
          <Link
            href="/demo/patient/symptoms"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-brand px-5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2"
          >
            Registrar ahora
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <WidgetGate id="patient.upcomingAppointments">
          <Panel
            title="Otras citas"
            action={
              <Link
                href="/demo/patient/appointments"
                className="text-sm text-brand hover:underline"
              >
                Ver todas
              </Link>
            }
          >
            {PATIENT_APPOINTMENTS.slice(1).length === 0 ? (
              <p className="text-sm text-inkMuted">No hay más citas programadas.</p>
            ) : (
              PATIENT_APPOINTMENTS.slice(1).map((a) => (
                <div
                  key={a.date}
                  className="mb-4 flex justify-between border-b border-line pb-4 last:mb-0 last:border-0"
                >
                  <div>
                    <p className="font-medium text-ink">{a.date}</p>
                    <p className="text-sm text-inkMuted">
                      {a.doctor} · {a.place}
                    </p>
                  </div>
                  <StatusPill status={a.status} />
                </div>
              ))
            )}
          </Panel>
        </WidgetGate>

        <WidgetGate id="patient.quickActions">
          <Panel title="Otras acciones">
            <div className="grid gap-3">
              <Link
                href="/demo/patient/surveys"
                className="rounded-xl bg-canvas px-4 py-3 text-sm font-medium text-ink transition hover:bg-brand-light"
              >
                Encuestas clínicas →
              </Link>
              <Link
                href="/demo/patient/appointments"
                className="rounded-xl bg-canvas px-4 py-3 text-sm font-medium text-ink transition hover:bg-brand-light"
              >
                Solicitar nueva hora →
              </Link>
              <Link
                href="/demo/patient/history"
                className="rounded-xl bg-canvas px-4 py-3 text-sm font-medium text-ink transition hover:bg-brand-light"
              >
                Historial médico →
              </Link>
            </div>
          </Panel>
        </WidgetGate>
      </div>

      <WidgetGate id="patient.metrics">
        <div className="mt-8">
          <MetricGrid
            items={[
              { label: 'Consultas este año', value: '3', delta: 'Historial al día' },
              { label: 'Síntomas reportados', value: '2', delta: 'Último: ayer' },
              { label: 'Medicación activa', value: '1', delta: 'Losartán 50mg' },
            ]}
          />
        </div>
      </WidgetGate>
    </DemoShell>
  );
}
