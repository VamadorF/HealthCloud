import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, Panel, StatCard } from '@/components/platform/platform-shell';
import { WidgetGate } from '@/components/platform/widget-preferences';
import { SpecialistScheduleView } from '@/components/clinical/specialist-schedule-view';
import { toScheduleEventFromAppointment } from '@/lib/clinical/schedule-events';
import { formatDateTime, formatTime } from '@/utils/format';
import { confirmAppointment } from '@/app/specialist/actions';
import { SubmitButton } from '@/components/ui/submit-button';

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export default async function SpecialistDashboardPage() {
  const user = await requireRole('SPECIALIST');

  const appointments = await prisma.appointment.findMany({
    where: { specialistId: user.id },
    include: { patient: true },
    orderBy: { scheduledAt: 'asc' },
    take: 40,
  });

  const now = new Date();
  const todayAppointments = appointments.filter((a) => isSameDay(new Date(a.scheduledAt), now));
  const schedule = todayAppointments.length > 0 ? todayAppointments : appointments.slice(0, 8);
  const pending = appointments.filter((a) => a.status === 'REQUESTED');
  const showingToday = todayAppointments.length > 0;

  const events = appointments.map((appt) =>
    toScheduleEventFromAppointment({
      id: appt.id,
      scheduledAt: appt.scheduledAt,
      reason: appt.reason,
      status: appt.status,
      patientName: appt.patient.fullName ?? appt.patient.email,
    })
  );

  return (
    <PlatformShell
      user={user}
      title="Agenda del día"
      description="Cronograma de atenciones y confirmaciones pendientes"
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.85fr)]">
        <SpecialistScheduleView
          title={showingToday ? 'Cronograma de hoy' : 'Próximas atenciones'}
          summary={
            <span className="text-xs tabular-nums text-inkMuted">
              {schedule.length} {schedule.length === 1 ? 'cita' : 'citas'}
            </span>
          }
          events={events}
          agenda={
            schedule.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-inkMuted">
                No tienes citas programadas.
              </p>
            ) : (
              <ol className="divide-y divide-line">
                {schedule.map((appt) => {
                  const when = new Date(appt.scheduledAt);
                  return (
                    <li
                      key={appt.id}
                      className="flex flex-col gap-3 px-5 py-4 transition-colors duration-200 ease-out-soft hover:bg-canvas/60 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 gap-4">
                        <div className="w-16 shrink-0">
                          <p className="font-display text-sm font-semibold text-brand-mid tabular-nums">
                            {formatTime(when)}
                          </p>
                          {!showingToday && (
                            <p className="mt-0.5 text-xs text-inkMuted">
                              {formatDateTime(when).split(',')[0]}
                            </p>
                          )}
                        </div>
                        <div className="min-w-0 border-l-2 border-brand-soft pl-4">
                          <p className="font-bold text-ink">
                            {appt.patient.fullName ?? appt.patient.email}
                          </p>
                          <p className="mt-0.5 text-sm text-inkMuted">
                            {appt.reason ?? 'Sin motivo registrado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                        <StatusBadge status={appt.status} />
                        {appt.status === 'REQUESTED' ? (
                          <form action={confirmAppointment}>
                            <input type="hidden" name="appointmentId" value={appt.id} />
                            <SubmitButton size="sm">Confirmar</SubmitButton>
                          </form>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )
          }
        />

        <aside className="space-y-6">
          <section className="rounded-xl border border-line bg-surface px-5 py-4 shadow-card">
            <p className="signage-label text-inkMuted">Estado de la agenda</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-inkMuted">Hoy</dt>
                <dd className="font-display text-lg tabular-nums text-ink">
                  {todayAppointments.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-inkMuted">Por confirmar</dt>
                <dd className="font-display text-lg tabular-nums text-ink">{pending.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-inkMuted">En agenda</dt>
                <dd className="font-display text-lg tabular-nums text-ink">
                  {appointments.length}
                </dd>
              </div>
            </dl>
          </section>

          {pending.length > 0 && (
            <Panel title="Pendientes de confirmar">
              <ul className="divide-y divide-line">
                {pending.slice(0, 4).map((appt) => (
                  <li key={appt.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">
                        {appt.patient.fullName ?? appt.patient.email}
                      </p>
                      <p className="text-xs text-inkMuted tabular-nums">
                        {formatDateTime(appt.scheduledAt)}
                      </p>
                    </div>
                    <form action={confirmAppointment}>
                      <input type="hidden" name="appointmentId" value={appt.id} />
                      <SubmitButton size="sm">Confirmar</SubmitButton>
                    </form>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </aside>
      </div>

      <WidgetGate id="specialist.daySummary">
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Citas pendientes" value={pending.length} hint="Por confirmar" />
          <StatCard label="Citas hoy" value={todayAppointments.length} />
          <StatCard label="Total en agenda" value={appointments.length} />
        </div>
      </WidgetGate>
    </PlatformShell>
  );
}
