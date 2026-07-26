import { DemoShell, Panel, StatusPill } from '@/components/demo/demo-shell';
import { DataTable } from '@/components/platform/platform-shell';

const PATIENTS = [
  { name: 'Camila Soto', age: '34 años', last: 'Control hipertensión · 12 Mar', tag: 'Seguimiento' },
  { name: 'Roberto Díaz', age: '58 años', last: 'Diabetes · Hoy', tag: 'Crónico' },
  { name: 'María José Vera', age: '41 años', last: 'Dislipidemia · Ayer', tag: 'Seguimiento' },
  { name: 'Felipe Arancibia', age: '29 años', last: 'Primera consulta · Pendiente', tag: 'Nuevo' },
];

export default function DemoSpecialistPatientsPage() {
  return (
    <DemoShell
      role="specialist"
      title="Mis pacientes"
      subtitle="Personas bajo tu supervisión clínica"
    >
      <Panel title="Lista de pacientes" flush>
        <DataTable
          headers={['Paciente', 'Edad', 'Última atención', 'Seguimiento']}
          empty="Aún no tienes pacientes asignados."
          rows={PATIENTS.map((patient) => ({
            key: patient.name,
            cells: [
              patient.name,
              patient.age,
              patient.last,
              <StatusPill key="tag" status={patient.tag} />,
            ],
          }))}
        />
      </Panel>
    </DemoShell>
  );
}
