import { DemoShell } from '@/components/demo/demo-shell';
import { PatientSurveyInbox } from '@/components/clinical/survey-controls';

export default function DemoPatientSurveysPage() {
  return (
    <DemoShell
      role="patient"
      title="Encuestas clínicas"
      subtitle="Solo las escalas que tu especialista te ha asignado y abierto"
    >
      <PatientSurveyInbox patientKey="camila-soto" />
    </DemoShell>
  );
}
