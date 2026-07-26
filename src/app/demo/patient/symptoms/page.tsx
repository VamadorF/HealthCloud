import { DemoShell, Panel, StatusPill } from '@/components/demo/demo-shell';
import { PATIENT_SYMPTOMS } from '@/lib/mock/demo-data';

export default function DemoPatientSymptomsPage() {
  return (
    <DemoShell
      role="patient"
      title="Registro de síntomas"
      subtitle="Documenta cómo te sientes entre consultas"
    >
      <Panel title="Reportes recientes">
        <div className="space-y-4">
          {PATIENT_SYMPTOMS.map((s) => (
            <div key={s.date} className="rounded-xl bg-canvas p-5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-inkMuted">{s.date}</span>
                <StatusPill status={s.level} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-ink">Nuevo reporte</p>
          <textarea
            className="mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
            rows={3}
            placeholder="Describe lo que estás sintiendo..."
            readOnly
            defaultValue="Dolor de cabeza leve desde ayer en la tarde, sin fiebre ni náuseas."
          />
          <button className="mt-3 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white">
            Enviar reporte
          </button>
        </div>
      </Panel>
    </DemoShell>
  );
}
