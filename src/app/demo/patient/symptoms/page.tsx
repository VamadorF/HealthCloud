import { DemoShell, Panel, StatusPill } from '@/components/demo/demo-shell';
import { EvaScale, EvaScoreBadge } from '@/components/clinical/eva-scale';
import { BodyAreasField } from '@/components/clinical/body-areas-field';
import { PATIENT_SYMPTOMS } from '@/lib/mock/demo-data';

export default function DemoPatientSymptomsPage() {
  return (
    <DemoShell
      role="patient"
      title="Registro de síntomas"
      subtitle="Documenta cómo te sientes entre consultas, con escala EVA del dolor"
    >
      <div className="grid items-start gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Panel title="Nuevo reporte">
          <div className="grid gap-5">
            <div>
              <p className="signage-label mb-2 text-inkMuted">Descripción</p>
              <textarea
                className="w-full rounded-lg border border-line bg-sunken px-4 py-3 text-sm text-inkBody outline-none transition-colors duration-200 ease-out-soft focus:border-brand-mid focus:bg-surface focus:ring-2 focus:ring-brand-soft"
                rows={3}
                placeholder="Describe lo que estás sintiendo..."
                defaultValue="Dolor de cabeza leve desde ayer en la tarde, sin fiebre ni náuseas."
                readOnly
              />
            </div>

            <EvaScale name="painScore" defaultValue={3} />
            <BodyAreasField name="bodyAreas" defaultValue={['cabeza']} />

            <button
              type="button"
              className="justify-self-start rounded-lg bg-brand px-4 py-2.5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
            >
              Enviar reporte
            </button>
          </div>
        </Panel>

        <Panel title="Reportes recientes">
          <div className="space-y-4">
            {PATIENT_SYMPTOMS.map((s) => (
              <div key={s.date} className="rounded-xl bg-canvas p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-inkMuted">{s.date}</span>
                  <StatusPill status={s.level} />
                  <EvaScoreBadge score={s.painScore} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{s.text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DemoShell>
  );
}
