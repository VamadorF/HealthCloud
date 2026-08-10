import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import { PainAssessmentForm } from '@/components/clinical/pain-assessment-form';
import { submitPatientPain } from '@/app/patient/survey-actions';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  SurveyConfig,
  getSurveyAvailability,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

export default async function PatientPainPage() {
  const user = await requireRole('PATIENT');
  const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
  const config = mergeSurveyConfig((profile?.surveyConfig as SurveyConfig | null) ?? null);
  const availability = getSurveyAvailability(config.DOLOR);

  return (
    <PlatformShell
      user={user}
      title="Dolor"
      description="Evaluación del dolor · aparición, localización, EVA/ENA, irradiación y alivio"
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
        <form action={submitPatientPain} className="space-y-5">
          <PainAssessmentForm name="pain" required />
          <SubmitButton>Enviar evaluación del dolor</SubmitButton>
        </form>
      )}
    </PlatformShell>
  );
}
