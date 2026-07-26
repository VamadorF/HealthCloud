import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable, StatusBadge } from '@/components/platform/platform-shell';
import { requestAppointment } from '@/app/patient/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatDateTime } from '@/utils/format';

export default async function PatientAppointmentsPage() {
  const user = await requireRole('PATIENT');

  const [appointments, organizations] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId: user.id },
      orderBy: { scheduledAt: 'desc' },
    }),
    prisma.organization.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <PlatformShell
      user={user}
      title="Solicitar hora de atención"
      description="Reserva una cita con un centro médico o especialista"
    >
      <div className="grid items-start gap-5 xl:grid-cols-[0.9fr_1.4fr]">
        <Panel title="Nueva solicitud">
          <form action={requestAppointment} className="grid gap-4 px-6 py-5">
            <Input name="scheduledAt" label="Fecha y hora" type="datetime-local" required />
            <Input name="reason" label="Motivo de consulta" required placeholder="Control rutinario" />
            <Select id="organizationId" name="organizationId" label="Centro médico (opcional)">
              <option value="">Sin preferencia</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </Select>
            <div>
              <SubmitButton>Solicitar cita</SubmitButton>
            </div>
          </form>
        </Panel>

        <Panel title="Mis citas">
          <DataTable
            headers={['Fecha', 'Motivo', 'Estado']}
            empty="No has solicitado citas aún."
            rows={appointments.map((appt) => ({
              key: appt.id,
              cells: [
                formatDateTime(appt.scheduledAt),
                appt.reason,
                <StatusBadge key="status" status={appt.status} />,
              ],
            }))}
          />
        </Panel>
      </div>
    </PlatformShell>
  );
}
