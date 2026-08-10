import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell } from '@/components/platform/platform-shell';
import {
  AuthSpecialistConsultationsWorkspace,
  type AuthConsultationRow,
} from '@/components/clinical/auth-specialist-consultations-workspace';
import { formatDateTime } from '@/utils/format';
import type { PssBand, PssClinicalPayload } from '@/lib/clinical/pss';
import type { PsqiBand } from '@/lib/clinical/psqi';
import type { PcsBand } from '@/lib/clinical/pcs';
import { SurveyConfig, mergeSurveyConfig } from '@/lib/clinical/survey-schedule';

type ClinicalData = {
  notes?: string;
  pss?: PssClinicalPayload;
};

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export default async function SpecialistConsultationsPage() {
  const user = await requireRole('SPECIALIST');
  const now = new Date();

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
    take: 50,
  });

  const rows: AuthConsultationRow[] = appointments.map((appt) => {
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

    return {
      id: appt.id,
      patientName: appt.patient.fullName ?? appt.patient.email,
      scheduledLabel: formatDateTime(appt.scheduledAt),
      scheduledAtMs: new Date(appt.scheduledAt).getTime(),
      status: appt.status,
      reason: appt.reason ?? 'Sin motivo registrado',
      hasConsultation: Boolean(appt.consultation),
      diagnosis: appt.consultation?.diagnosis ?? null,
      notes: clinical.notes ?? null,
      isToday: isSameDay(new Date(appt.scheduledAt), now),
      pss:
        pssScore?.total != null
          ? {
              total: pssScore.total,
              band: pssScore.band,
              bandLabel: pssScore.bandLabel,
            }
          : null,
      psqi:
        psqiScore?.global != null
          ? {
              global: psqiScore.global,
              band: psqiScore.band,
              bandLabel: psqiScore.bandLabel,
            }
          : null,
      pcs:
        pcsScore?.total != null
          ? {
              total: pcsScore.total,
              band: pcsScore.band,
              bandLabel: pcsScore.bandLabel,
            }
          : null,
      clinicalPss: clinical.pss ?? null,
    };
  });

  return (
    <PlatformShell
      user={user}
      title="Consultas clínicas"
      description="Lista densa con detalle interactivo · registra o revisa cada atención"
    >
      <AuthSpecialistConsultationsWorkspace appointments={rows} />
    </PlatformShell>
  );
}
