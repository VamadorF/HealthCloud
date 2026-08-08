import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import { AuthSpecialistSurveyControls } from '@/components/clinical/auth-survey-controls';
import { mergeSurveyConfig, type SurveyConfig } from '@/lib/clinical/survey-schedule';

export default async function SpecialistPatientsPage() {
  const user = await requireRole('SPECIALIST');

  const appointments = await prisma.appointment.findMany({
    where: { specialistId: user.id },
    include: { patient: { include: { patientProfile: true } } },
    distinct: ['patientId'],
    orderBy: { scheduledAt: 'asc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Pacientes"
      description="Asigna encuestas por separado y consulta los registros del paciente"
    >
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <Panel title="Pacientes asignados">
            <p className="px-5 py-10 text-center text-sm text-inkMuted">
              Aún no tienes pacientes asignados.
            </p>
          </Panel>
        ) : (
          appointments.map((appt) => {
            const allergies = appt.patient.patientProfile?.allergies;
            const allergyLabel = Array.isArray(allergies)
              ? allergies.length > 0
                ? allergies.map(String).join(', ')
                : 'Sin registrar'
              : 'Sin registrar';
            const config = mergeSurveyConfig(
              (appt.patient.patientProfile?.surveyConfig as SurveyConfig | null) ?? null
            );

            return (
              <Panel
                key={appt.patient.id}
                title={appt.patient.fullName ?? appt.patient.email}
              >
                <div className="space-y-5 px-5 py-5">
                  <dl className="grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="signage-label text-inkMuted">Contacto</dt>
                      <dd className="mt-1 text-ink">{appt.patient.email}</dd>
                    </div>
                    <div>
                      <dt className="signage-label text-inkMuted">Tipo de sangre</dt>
                      <dd className="mt-1 text-ink">
                        {appt.patient.patientProfile?.bloodType ?? 'Sin registrar'}
                      </dd>
                    </div>
                    <div>
                      <dt className="signage-label text-inkMuted">Alergias</dt>
                      <dd className="mt-1 text-ink">{allergyLabel}</dd>
                    </div>
                  </dl>
                  <AuthSpecialistSurveyControls
                    patientId={appt.patient.id}
                    patientName={appt.patient.fullName ?? appt.patient.email}
                    initialConfig={config}
                  />
                </div>
              </Panel>
            );
          })
        )}
      </div>
    </PlatformShell>
  );
}
