import { DemoShell } from '@/components/demo/demo-shell';
import { SpecialistPatientsWorkspace } from '@/components/clinical/specialist-patients-workspace';
import { DEMO_SPECIALIST_PATIENTS } from '@/lib/mock/specialist-patients';

export default function DemoSpecialistPatientsPage() {
  return (
    <DemoShell
      role="specialist"
      title="Mis pacientes"
      subtitle={`${DEMO_SPECIALIST_PATIENTS.length} fichas · busca, filtra y abre la ficha para gestionar encuestas`}
    >
      <SpecialistPatientsWorkspace />
    </DemoShell>
  );
}
