import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell } from '@/components/platform/platform-shell';
import {
  AuthSpecialistPatientsWorkspace,
  type AuthPatientRow,
} from '@/components/clinical/auth-specialist-patients-workspace';
import { mergeSurveyConfig, type SurveyConfig } from '@/lib/clinical/survey-schedule';

export default async function SpecialistPatientsPage() {
  const user = await requireRole('SPECIALIST');

  const appointments = await prisma.appointment.findMany({
    where: { specialistId: user.id },
    include: { patient: { include: { patientProfile: true } } },
    distinct: ['patientId'],
    orderBy: { scheduledAt: 'asc' },
  });

  const patients: AuthPatientRow[] = appointments.map((appt) => {
    const allergies = appt.patient.patientProfile?.allergies;
    const allergyLabel = Array.isArray(allergies)
      ? allergies.length > 0
        ? allergies.map(String).join(', ')
        : 'Sin registrar'
      : 'Sin registrar';

    return {
      id: appt.patient.id,
      name: appt.patient.fullName ?? appt.patient.email,
      email: appt.patient.email,
      bloodType: appt.patient.patientProfile?.bloodType ?? 'Sin registrar',
      allergies: allergyLabel,
      surveyConfig: mergeSurveyConfig(
        (appt.patient.patientProfile?.surveyConfig as SurveyConfig | null) ?? null
      ),
    };
  });

  return (
    <PlatformShell
      user={user}
      title="Pacientes"
      description={`${patients.length} fichas · busca y abre la ficha para gestionar encuestas`}
    >
      <AuthSpecialistPatientsWorkspace patients={patients} />
    </PlatformShell>
  );
}
