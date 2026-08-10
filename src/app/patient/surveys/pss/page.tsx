import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import { PssScale } from '@/components/clinical/pss-scale';
import { submitPatientPss } from '@/app/patient/survey-actions';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  SurveyConfig,
  getSurveyAvailability,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

export default async function PatientPssPage() {
  const user = await requireRole('PATIENT');
  const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
  const config = mergeSurveyConfig((profile?.surveyConfig as SurveyConfig | null) ?? null);
  const availability = getSurveyAvailability(config['PSS-14']);

  return (
    <PlatformShell
      user={user}
      title="PSS-14"
      description="Escala de Estrés Percibido · último mes"
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
        <form action={submitPatientPss} className="space-y-5">
          <PssScale name="pss" required />
          <SubmitButton>Enviar PSS-14</SubmitButton>
        </form>
      )}
    </PlatformShell>
  );
}
