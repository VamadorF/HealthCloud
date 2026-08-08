import { DemoShell } from '@/components/demo/demo-shell';
import { PatientSurveyInbox } from '@/components/clinical/survey-controls';

export default function DemoPatientSurveysPage() {
  return (
    <DemoShell
      role="patient"
      title="Encuestas clínicas"
      subtitle="PSS-14 y PSQI · disponibles cada 2 meses o cuando tu especialista las active"
    >
      <PatientSurveyInbox patientKey="camila-soto" />
    </DemoShell>
  );
}
