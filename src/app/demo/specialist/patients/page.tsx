import { DemoShell, Panel, StatusPill } from '@/components/demo/demo-shell';
import { SpecialistSurveyControls } from '@/components/clinical/survey-controls';

const PATIENTS = [
  {
    key: 'camila-soto',
    name: 'Camila Soto',
    age: '34 años',
    last: 'Control hipertensión · 12 Mar',
    tag: 'Seguimiento',
  },
  {
    key: 'roberto-diaz',
    name: 'Roberto Díaz',
    age: '58 años',
    last: 'Diabetes · Hoy',
    tag: 'Crónico',
  },
  {
    key: 'maria-jose-vera',
    name: 'María José Vera',
    age: '41 años',
    last: 'Dislipidemia · Ayer',
    tag: 'Seguimiento',
  },
  {
    key: 'felipe-arancibia',
    name: 'Felipe Arancibia',
    age: '29 años',
    last: 'Primera consulta · Pendiente',
    tag: 'Nuevo',
  },
];

export default function DemoSpecialistPatientsPage() {
  return (
    <DemoShell
      role="specialist"
      title="Mis pacientes"
      subtitle="Ficha clínica y programación de encuestas (PSS-14 · PSQI)"
    >
      <div className="space-y-6">
        {PATIENTS.map((patient) => (
          <Panel
            key={patient.key}
            title={patient.name}
            action={<StatusPill status={patient.tag} />}
          >
            <div className="mb-5 flex flex-wrap gap-4 text-sm text-inkMuted">
              <span>{patient.age}</span>
              <span>{patient.last}</span>
            </div>
            <SpecialistSurveyControls
              patientKey={patient.key}
              patientName={patient.name}
            />
          </Panel>
        ))}
      </div>
    </DemoShell>
  );
}
