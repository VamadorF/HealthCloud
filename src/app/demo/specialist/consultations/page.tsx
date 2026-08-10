import { DemoShell } from '@/components/demo/demo-shell';
import { SpecialistConsultationsWorkspace } from '@/components/clinical/specialist-consultations-workspace';

export default function DemoSpecialistConsultationsPage() {
  return (
    <DemoShell
      role="specialist"
      title="Consultas clínicas"
      subtitle="Lista densa con detalle interactivo · registra o revisa cada atención"
    >
      <SpecialistConsultationsWorkspace />
    </DemoShell>
  );
}
