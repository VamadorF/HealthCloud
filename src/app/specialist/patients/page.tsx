import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable } from '@/components/platform/platform-shell';
import { formatDateTime } from '@/utils/format';

export default async function SpecialistPatientsPage() {
  const user = await requireRole('SPECIALIST');

  const appointments = await prisma.appointment.findMany({
    where: { specialistId: user.id },
    include: { patient: { include: { patientProfile: true } } },
    distinct: ['patientId'],
    orderBy: { scheduledAt: 'asc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Pacientes"
      description="Información clínica de los pacientes en tu agenda"
    >
      <Panel title="Pacientes asignados">
        <DataTable
          headers={['Paciente', 'Contacto', 'Tipo de sangre', 'Próxima cita']}
          empty="Aún no tienes pacientes asignados."
          rows={appointments.map((appt) => ({
            key: appt.patient.id,
            cells: [
              appt.patient.fullName ?? appt.patient.email,
              appt.patient.email,
              appt.patient.patientProfile?.bloodType ?? 'Sin registrar',
              formatDateTime(appt.scheduledAt),
            ],
          }))}
        />
      </Panel>
    </PlatformShell>
  );
}
