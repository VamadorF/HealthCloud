import { DemoShell, MetricGrid, Panel } from '@/components/demo/demo-shell';
import { WidgetGate } from '@/components/platform/widget-preferences';
import { ORG_SPECIALISTS } from '@/lib/mock/demo-data';
import Link from 'next/link';

export default function DemoOrgPage() {
  return (
    <DemoShell
      role="organization"
      title="Clínica Andes Norte"
      subtitle="Providencia, Santiago · Centro médico de atención ambulatoria"
    >
      <WidgetGate id="org.stats">
        <MetricGrid
          items={[
            { label: 'Especialistas activos', value: '18', delta: '3 invitaciones pendientes' },
            { label: 'Citas esta semana', value: '64', delta: '+8% vs anterior' },
            { label: 'Pacientes atendidos', value: '1.240', delta: 'Últimos 12 meses' },
            { label: 'Ocupación agenda', value: '78%', delta: 'Promedio semanal' },
          ]}
        />
      </WidgetGate>

      <div className="mt-8">
        <Panel
          title="Plantilla médica"
          action={<Link href="/demo/organization/specialists" className="text-sm text-brand hover:underline">Gestionar</Link>}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {ORG_SPECIALISTS.slice(0, 4).map((s) => (
              <div key={s.name} className="rounded-xl bg-canvas p-4">
                <p className="font-medium text-ink">{s.name}</p>
                <p className="text-sm text-inkMuted">{s.specialty}</p>
                <p className="mt-2 text-xs text-brand">{s.patients} pacientes</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DemoShell>
  );
}
