import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatCard, StatusBadge, Panel, DataTable } from '@/components/platform/platform-shell';
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
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Citas pendientes" value={pending} hint="Por confirmar" />
        <StatCard label="Citas hoy" value={today} />
        <StatCard label="Total en agenda" value={appointments.length} />
      </div>

      <div className="mt-5">
        <Panel title="Próximas atenciones">
          <DataTable
            headers={['Paciente', 'Fecha y hora', 'Motivo', 'Estado', '']}
            empty="No tienes citas programadas."
            rows={appointments.map((appt) => ({
              key: appt.id,
              cells: [
                appt.patient.fullName ?? appt.patient.email,
                formatDateTime(appt.scheduledAt),
                appt.reason,
                <StatusBadge key="status" status={appt.status} />,
                appt.status === 'REQUESTED' ? (
                  <form key="action" action={confirmAppointment} className="flex justify-end">
                    <input type="hidden" name="appointmentId" value={appt.id} />
                    <SubmitButton size="sm">Confirmar</SubmitButton>
                  </form>
                ) : null,
              ],
            }))}
          />
        </Panel>
      </div>
    </PlatformShell>
  );
}
