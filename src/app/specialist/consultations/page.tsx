import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
import { recordConsultation } from '@/app/specialist/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PssScale, PssScoreSummary } from '@/components/clinical/pss-scale';
import { formatDateTime } from '@/utils/format';
import type { PssBand, PssClinicalPayload } from '@/lib/clinical/pss';

type ClinicalData = {
  notes?: string;
  pss?: PssClinicalPayload;
};

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
      description="Registra diagnóstico, notas y evaluación de estrés percibido (PSS-14)"
    >
      <div className="space-y-6">
        {appointments.map((appt) => {
          const clinical = (appt.consultation?.clinicalData ?? {}) as ClinicalData;
          return (
            <div
              key={appt.id}
              className="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6"
            >
              <div className="mb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink">
                    {appt.patient.fullName ?? appt.patient.email}
                  </h3>
                  <StatusBadge status={appt.status} />
                </div>
                <p className="mt-1 text-sm text-inkMuted">{formatDateTime(appt.scheduledAt)}</p>
                {appt.reason && (
                  <p className="mt-1 text-sm text-inkMuted">Motivo: {appt.reason}</p>
                )}
              </div>

              {appt.consultation ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-canvas p-4 text-sm text-ink">
                    <p>
                      <strong>Diagnóstico:</strong> {appt.consultation.diagnosis}
                    </p>
                    {clinical.notes && (
                      <p className="mt-2">
                        <strong>Notas:</strong> {clinical.notes}
                      </p>
                    )}
                  </div>
                  {clinical.pss && (
                    <PssScoreSummary
                      total={clinical.pss.total}
                      band={clinical.pss.band as PssBand}
                      bandLabel={clinical.pss.bandLabel}
                    />
                  )}
                </div>
              ) : (
                <form action={recordConsultation} className="grid gap-5">
                  <input type="hidden" name="appointmentId" value={appt.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input name="diagnosis" label="Diagnóstico" required />
                    <Input
                      name="vitals"
                      label="Signos vitales (JSON)"
                      defaultValue='{"presion":"120/80","temperatura":"36.5"}'
                    />
                  </div>
                  <Textarea
                    id={`notes-${appt.id}`}
                    name="clinicalNotes"
                    label="Notas clínicas"
                    rows={3}
                    placeholder="Evolución, hallazgos relevantes, plan..."
                  />
                  <Input
                    name="treatment"
                    label="Tratamiento (JSON)"
                    defaultValue='{"medicamentos":[],"indicaciones":""}'
                  />

                  <PssScale name="pss" />

                  <div>
                    <SubmitButton>Registrar consulta</SubmitButton>
                  </div>
                </form>
              )}
            </div>
          );
        })}
        {appointments.length === 0 && (
          <EmptyState>No hay consultas para registrar.</EmptyState>
        )}
      </div>
    </PlatformShell>
  );
}
