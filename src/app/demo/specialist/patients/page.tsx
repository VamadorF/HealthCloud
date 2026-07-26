import { DemoShell, Panel } from '@/components/demo/demo-shell';

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
      <Panel title="Lista de pacientes">
        <div className="grid gap-4 sm:grid-cols-2">
          {PATIENTS.map((p) => (
            <div key={p.name} className="rounded-2xl border border-line bg-canvas p-5">
              <div className="flex items-start justify-between">
                <p className="font-medium text-ink">{p.name}</p>
                <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs text-brand-dark">{p.tag}</span>
              </div>
              <p className="mt-1 text-sm text-inkMuted">{p.age}</p>
              <p className="mt-3 text-xs text-inkMuted">{p.last}</p>
            </div>
          ))}
        </div>
      </Panel>
    </DemoShell>
  );
}
