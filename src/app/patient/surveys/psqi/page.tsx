import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import { PsqiScale } from '@/components/clinical/psqi-scale';
import { submitPatientPsqi } from '@/app/patient/survey-actions';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  SurveyConfig,
  getSurveyAvailability,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

export default async function PatientPsqiPage() {
  const user = await requireRole('PATIENT');
  const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
  const config = mergeSurveyConfig((profile?.surveyConfig as SurveyConfig | null) ?? null);
  const availability = getSurveyAvailability(config.PSQI);

  return (
    <PlatformShell
      user={user}
      title="PSQI"
      description="Índice de Calidad del Sueño de Pittsburgh · último mes"
    >
      {availability.status !== 'available' ? (
        <Panel title="No disponible">
          <p className="px-5 py-6 text-sm text-inkMuted">{availability.reason}</p>
          <div className="px-5 pb-5">
            <Link href="/patient/surveys" className="text-sm font-bold text-brand-mid hover:underline">
              Volver a encuestas
            </Link>
          </div>
        </Panel>
      ) : (
        <form action={submitPatientPsqi} className="space-y-5">
          <PsqiScale name="psqi" required />
          <SubmitButton>Enviar PSQI</SubmitButton>
        </form>
      )}
    </PlatformShell>
  );
}
