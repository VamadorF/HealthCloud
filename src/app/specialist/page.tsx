import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatCard, StatusBadge, Panel, Row } from '@/components/platform/platform-shell';
import { formatDateTime } from '@/utils/format';
import { confirmAppointment } from '@/app/specialist/actions';
import { SubmitButton } from '@/components/ui/submit-button';

export default async function SpecialistDashboardPage() {
  const user = await requireRole('SPECIALIST');

  const appointments = await prisma.appointment.findMany({
    where: { specialistId: user.id },
    include: { patient: true },
    orderBy: { scheduledAt: 'asc' },
    take: 10,
  });

  const pending = appointments.filter((a) => a.status === 'REQUESTED').length;
  const today = appointments.filter((a) => {
    const d = new Date(a.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <PlatformShell
      user={user}
      title="Agenda operativa"
      description="Revisa tu agenda, atiende pacientes y registra consultas"
    >
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Citas pendientes" value={pending} hint="Por confirmar" />
        <StatCard label="Citas hoy" value={today} />
        <StatCard label="Total en agenda" value={appointments.length} />
      </div>

      <Panel title="Próximas atenciones">
        {appointments.map((appt) => (
          <Row
            key={appt.id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-ink">{appt.patient.fullName ?? appt.patient.email}</p>
                <StatusBadge status={appt.status} />
              </div>
              <p className="mt-1 text-sm text-inkMuted">{formatDateTime(appt.scheduledAt)}</p>
              <p className="text-sm text-inkMuted">{appt.reason}</p>
            </div>
            {appt.status === 'REQUESTED' && (
              <form action={confirmAppointment}>
                <input type="hidden" name="appointmentId" value={appt.id} />
                <SubmitButton size="sm">Confirmar</SubmitButton>
              </form>
            )}
          </Row>
        ))}
        {appointments.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-inkMuted">No tienes citas programadas.</p>
        )}
      </Panel>
    </PlatformShell>
  );
}
