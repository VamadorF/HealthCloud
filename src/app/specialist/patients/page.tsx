import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable } from '@/components/platform/platform-shell';

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
      description="Ficha clínica básica. El cronograma de citas está en Agenda."
    >
      <Panel title="Pacientes asignados">
        <DataTable
          headers={['Paciente', 'Contacto', 'Tipo de sangre', 'Alergias']}
          empty="Aún no tienes pacientes asignados."
          rows={appointments.map((appt) => {
            const allergies = appt.patient.patientProfile?.allergies;
            const allergyLabel = Array.isArray(allergies)
              ? allergies.length > 0
                ? allergies.map(String).join(', ')
                : 'Sin registrar'
              : 'Sin registrar';

            return {
              key: appt.patient.id,
              cells: [
                appt.patient.fullName ?? appt.patient.email,
                appt.patient.email,
                appt.patient.patientProfile?.bloodType ?? 'Sin registrar',
                allergyLabel,
              ],
            };
          })}
        />
      </Panel>
    </PlatformShell>
  );
}
