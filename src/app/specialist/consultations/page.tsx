import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
import { recordConsultation } from '@/app/specialist/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/utils/format';

export default async function SpecialistConsultationsPage() {
  const user = await requireRole('SPECIALIST');

  const appointments = await prisma.appointment.findMany({
    where: {
      specialistId: user.id,
      status: { in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] },
    },
    include: { patient: true, consultation: true },
    orderBy: { scheduledAt: 'desc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Consultas clínicas"
      description="Registra diagnósticos, tratamientos y datos clínicos complejos"
    >
      <div className="space-y-6">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="rounded-xl border border-line bg-surface p-6 shadow-card"
          >
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-ink">{appt.patient.fullName ?? appt.patient.email}</h3>
                <StatusBadge status={appt.status} />
              </div>
              <p className="mt-1 text-sm text-inkMuted">{formatDateTime(appt.scheduledAt)}</p>
            </div>

            {appt.consultation ? (
              <div className="rounded-lg bg-canvas p-4 text-sm text-ink">
                <p><strong>Diagnóstico:</strong> {appt.consultation.diagnosis}</p>
                <p className="mt-2"><strong>Notas:</strong> {(appt.consultation.clinicalData as { notes?: string })?.notes}</p>
              </div>
            ) : (
              <form action={recordConsultation} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="appointmentId" value={appt.id} />
                <Input name="diagnosis" label="Diagnóstico" required />
                <Input name="clinicalNotes" label="Notas clínicas" />
                <Input
                  name="vitals"
                  label="Signos vitales (JSON)"
                  defaultValue='{"presion":"120/80","temperatura":"36.5"}'
                />
                <Input
                  name="treatment"
                  label="Tratamiento (JSON)"
                  defaultValue='{"medicamentos":[],"indicaciones":""}'
                />
                <div className="sm:col-span-2">
                  <SubmitButton>Registrar consulta</SubmitButton>
                </div>
              </form>
            )}
          </div>
        ))}
        {appointments.length === 0 && (
          <EmptyState>No hay consultas para registrar.</EmptyState>
        )}
      </div>
    </PlatformShell>
  );
}
