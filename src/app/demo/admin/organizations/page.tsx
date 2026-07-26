import { DemoShell, Panel, StatusPill } from '@/components/demo/demo-shell';
import { DataTable } from '@/components/platform/platform-shell';
import { ADMIN_ORGS } from '@/lib/mock/demo-data';

export default function DemoAdminOrgsPage() {
  return (
    <DemoShell
      role="admin"
      title="Organizaciones"
      subtitle="Invita nuevas clínicas o gestiona el estado de las existentes"
    >
      <Panel title="Red de centros médicos" flush>
        <DataTable
          headers={['Organización', 'Ciudad', 'Especialistas', 'Desde', 'Estado']}
          empty="No hay organizaciones registradas."
          rows={ADMIN_ORGS.map((org) => ({
            key: org.name,
            cells: [
              org.name,
              org.city,
              org.specialists,
              org.since,
              <StatusPill key="status" status={org.status} />,
            ],
          }))}
        />
      </Panel>
    </DemoShell>
  );
}
