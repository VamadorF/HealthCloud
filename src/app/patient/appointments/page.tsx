import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
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
      <form
        action={requestAppointment}
        className="mb-8 grid max-w-2xl gap-4 rounded-2xl border border-line bg-surface p-6"
      >
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

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-ink">Mis citas</h2>
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-ink">{formatDateTime(appt.scheduledAt)}</p>
              <StatusBadge status={appt.status} />
            </div>
            <p className="mt-1 text-sm text-inkMuted">{appt.reason}</p>
          </div>
        ))}
        {appointments.length === 0 && (
          <EmptyState>No has solicitado citas aún.</EmptyState>
        )}
      </div>
    </PlatformShell>
  );
}
