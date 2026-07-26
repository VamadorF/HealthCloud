import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable, StatusBadge } from '@/components/platform/platform-shell';
import { inviteOrganization, toggleOrganizationStatus } from '@/app/admin/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';

export default async function AdminOrganizationsPage() {
  const user = await requireRole('ADMIN');

  const organizations = await prisma.organization.findMany({
    include: { owner: true, specialists: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Organizaciones"
      description="Invita, supervisa y bloquea clínicas o centros médicos"
    >
      <Panel title="Invitar organización">
        <form action={inviteOrganization} className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <Input name="email" label="Email del responsable" type="email" required placeholder="clinica@email.com" />
          <Input name="organizationName" label="Nombre de la organización" required placeholder="Clínica Central" />
          <div className="flex items-end">
            <SubmitButton className="w-full">Invitar organización</SubmitButton>
          </div>
        </form>
      </Panel>

      <div className="mt-5">
        <Panel title="Organizaciones registradas">
          <DataTable
            headers={['Organización', 'Responsable', 'Especialistas', 'Estado', '']}
            empty="No hay organizaciones registradas aún."
            rows={organizations.map((org) => ({
              key: org.id,
              cells: [
                org.name,
                org.owner.email,
                `${org.specialists.length} vinculados`,
                <StatusBadge key="status" status={org.status} />,
                <form key="action" action={toggleOrganizationStatus} className="flex justify-end">
                  <input type="hidden" name="organizationId" value={org.id} />
                  <input type="hidden" name="block" value={String(org.status !== 'BLOCKED')} />
                  <SubmitButton size="sm" variant={org.status === 'BLOCKED' ? 'primary' : 'danger'}>
                    {org.status === 'BLOCKED' ? 'Desbloquear' : 'Bloquear'}
                  </SubmitButton>
                </form>,
              ],
            }))}
          />
        </Panel>
      </div>
    </PlatformShell>
  );
}
