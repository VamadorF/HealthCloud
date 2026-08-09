import { notFound } from 'next/navigation';
import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { AgendaViewSettingsPanel } from '@/components/clinical/agenda-view-preference';
import { WidgetSettingsPanel } from '@/components/platform/widget-preferences';
import type { DemoRole } from '@/lib/mock/demo-data';

const ROLES: DemoRole[] = ['admin', 'organization', 'specialist', 'patient'];

const TITLES: Record<DemoRole, string> = {
  admin: 'Ajustes de administración',
  organization: 'Ajustes del centro',
  specialist: 'Ajustes clínicos',
  patient: 'Ajustes personales',
};

export default async function DemoSettingsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: raw } = await params;
  if (!ROLES.includes(raw as DemoRole)) notFound();
  const role = raw as DemoRole;

  return (
    <DemoShell
      role={role}
      title={TITLES[role]}
      subtitle={
        role === 'specialist'
          ? 'Vista de agenda y widgets secundarios del panel'
          : 'Personaliza los widgets secundarios de tu panel'
      }
    >
      <div className="grid max-w-3xl gap-6">
        {role === 'specialist' ? (
          <Panel title="Vista de la agenda">
            <div className="p-6">
              <AgendaViewSettingsPanel />
            </div>
          </Panel>
        ) : null}
        <Panel title="Personalización del panel">
          <div className="p-6">
            <WidgetSettingsPanel role={role} />
          </div>
        </Panel>
      </div>
    </DemoShell>
  );
}
