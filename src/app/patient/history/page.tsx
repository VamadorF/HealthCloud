import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable, StatusBadge } from '@/components/platform/platform-shell';
import { formatDateTime } from '@/utils/format';

export default async function PatientHistoryPage() {
  const user = await requireRole('PATIENT');

  const appointments = await prisma.appointment.findMany({
    where: { patientId: user.id },
    include: {
      consultation: true,
      specialist: true,
      organization: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Historial médico"
      description="Consulta el registro completo de tus atenciones y diagnósticos"
    >
      <Panel title="Atenciones registradas">
        <DataTable
          headers={['Fecha', 'Motivo', 'Especialista', 'Centro', 'Diagnóstico', 'Estado']}
          empty="Tu historial médico aparecerá aquí tras tus primeras atenciones."
          rows={appointments.map((appt) => ({
            key: appt.id,
            cells: [
              formatDateTime(appt.scheduledAt),
              appt.reason,
              appt.specialist ? appt.specialist.fullName ?? appt.specialist.email : 'Sin asignar',
              appt.organization?.name ?? 'Sin preferencia',
              appt.consultation?.diagnosis ?? 'Sin registrar',
              <StatusBadge key="status" status={appt.status} />,
            ],
          }))}
        />
      </Panel>
    </PlatformShell>
  );
}
