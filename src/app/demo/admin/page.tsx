import { DemoShell, MetricGrid, Panel, StatusPill } from '@/components/demo/demo-shell';
import { WidgetGate } from '@/components/platform/widget-preferences';
import { ADMIN_STATS, ADMIN_ORGS } from '@/lib/mock/demo-data';
import Link from 'next/link';

export default function DemoAdminPage() {
  return (
    <DemoShell
      role="admin"
      title="Resumen operativo"
      subtitle="Vista global de organizaciones, usuarios y actividad en la plataforma"
    >
      <WidgetGate id="admin.stats">
        <MetricGrid items={ADMIN_STATS} />
      </WidgetGate>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Panel
            title="Organizaciones recientes"
            action={
              <Link href="/demo/admin/organizations" className="text-sm text-brand hover:underline">
                Ver todas
              </Link>
            }
          >
            <div className="space-y-4">
              {ADMIN_ORGS.slice(0, 3).map((org) => (
                <div key={org.name} className="flex items-center justify-between border-b border-line pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-ink">{org.name}</p>
                    <p className="text-sm text-inkMuted">{org.city} · {org.specialists} especialistas · desde {org.since}</p>
                  </div>
                  <StatusPill status={org.status} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel title="Actividad de hoy">
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span className="text-inkMuted">Nuevas invitaciones</span>
                <span className="font-medium">2</span>
              </li>
              <li className="flex justify-between">
                <span className="text-inkMuted">Organizaciones bloqueadas</span>
                <span className="font-medium">0</span>
              </li>
              <li className="flex justify-between">
                <span className="text-inkMuted">Consultas registradas</span>
                <span className="font-medium">87</span>
              </li>
              <li className="flex justify-between">
                <span className="text-inkMuted">Reportes de síntomas</span>
                <span className="font-medium">14</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </DemoShell>
  );
}
