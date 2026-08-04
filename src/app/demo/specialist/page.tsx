import { DemoShell, MetricGrid, Panel, TimelineItem } from '@/components/demo/demo-shell';
import { SPECIALIST_AGENDA } from '@/lib/mock/demo-data';
import Link from 'next/link';

export default function DemoSpecialistPage() {
  return (
    <DemoShell
      role="specialist"
      title="Agenda de hoy"
      subtitle="Miércoles 9 de abril · Medicina interna · Box 3"
    >
      <MetricGrid
        items={[
          { label: 'Citas programadas', value: '4', delta: '1 en sala de espera' },
          { label: 'Consultas por registrar', value: '2', delta: 'De ayer' },
          { label: 'Pacientes en seguimiento', value: '98', delta: 'Activos' },
          { label: 'Próximo hueco', value: '12:00', delta: 'Disponible' },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Timeline del día">
          {SPECIALIST_AGENDA.map((item) => (
            <TimelineItem
              key={item.time}
              time={item.time}
              title={item.patient}
              meta={`${item.reason} · ${item.room}`}
              status={item.status}
            />
          ))}
        </Panel>

        <Panel
          title="Siguiente paso"
          action={<Link href="/demo/specialist/consultations" className="text-sm text-brand hover:underline">Ir a consultas</Link>}
        >
          <div className="rounded-xl bg-canvas p-5">
            <p className="text-xs font-medium text-brand">Ahora · 09:45</p>
            <p className="mt-2 font-display text-xl text-ink">Roberto Díaz</p>
            <p className="mt-1 text-sm text-inkMuted">Seguimiento diabetes · En sala de espera</p>
            <button className="mt-5 rounded-lg bg-brand px-5 py-2 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark">
              Iniciar consulta
            </button>
          </div>
        </Panel>
      </div>
    </DemoShell>
  );
}
