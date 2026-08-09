import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
import { recordConsultation } from '@/app/specialist/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PssScoreSummary } from '@/components/clinical/pss-scale';
import { PsqiScoreSummary } from '@/components/clinical/psqi-scale';
import { PcsScoreSummary } from '@/components/clinical/pcs-scale';
import { formatDateTime } from '@/utils/format';
import type { PssBand, PssClinicalPayload } from '@/lib/clinical/pss';
import type { PsqiBand } from '@/lib/clinical/psqi';
import type { PcsBand } from '@/lib/clinical/pcs';
import {
  SurveyConfig,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

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
    include: {
      patient: { include: { patientProfile: true } },
      consultation: true,
    },
    orderBy: { scheduledAt: 'desc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Consultas clínicas"
      description="Diagnóstico, notas y resultados de encuestas del paciente"
    >
      <div className="space-y-6">
        {appointments.map((appt) => {
          const clinical = (appt.consultation?.clinicalData ?? {}) as ClinicalData;
          const survey = mergeSurveyConfig(
            (appt.patient.patientProfile?.surveyConfig as SurveyConfig | null) ?? null
          );
          const pssScore = survey['PSS-14']?.lastScore as
            | { total?: number; band?: PssBand; bandLabel?: string }
            | null
            | undefined;
          const psqiScore = survey.PSQI?.lastScore as
            | { global?: number; band?: PsqiBand; bandLabel?: string }
            | null
            | undefined;
          const pcsScore = survey.PCS?.lastScore as
            | { total?: number; band?: PcsBand; bandLabel?: string }
            | null
            | undefined;

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
              </div>

              {(pssScore?.total != null ||
                psqiScore?.global != null ||
                pcsScore?.total != null ||
                clinical.pss) && (
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  {(clinical.pss || pssScore?.total != null) && (
                    <PssScoreSummary
                      total={clinical.pss?.total ?? pssScore!.total!}
                      band={clinical.pss?.band ?? pssScore?.band}
                      bandLabel={clinical.pss?.bandLabel ?? pssScore?.bandLabel}
                    />
                  )}
                  {psqiScore?.global != null && (
                    <PsqiScoreSummary
                      global={psqiScore.global}
                      band={psqiScore.band}
                      bandLabel={psqiScore.bandLabel}
                    />
                  )}
                  {pcsScore?.total != null && (
                    <PcsScoreSummary
                      total={pcsScore.total}
                      band={pcsScore.band}
                      bandLabel={pcsScore.bandLabel}
                    />
                  )}
                </div>
              )}

              {appt.consultation ? (
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
                  />
                  <Input
                    name="treatment"
                    label="Tratamiento (JSON)"
                    defaultValue='{"medicamentos":[],"indicaciones":""}'
                  />
                  <p className="text-sm text-inkMuted">
                    Las encuestas PSS-14, PSQI, PCS y Dolor se gestionan en Pacientes (activar /
                    desactivar / forzar) y las responde el paciente.
                  </p>
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
