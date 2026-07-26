import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
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
      <form action={inviteOrganization} className="mb-8 grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-3">
        <Input name="email" label="Email del responsable" type="email" required placeholder="clinica@email.com" />
        <Input name="organizationName" label="Nombre de la organización" required placeholder="Clínica Central" />
        <div className="flex items-end">
          <SubmitButton className="w-full">Invitar organización</SubmitButton>
        </div>
      </form>

      <div className="space-y-4">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-ink">{org.name}</h3>
                <StatusBadge status={org.status} />
              </div>
              <p className="mt-1 text-sm text-inkMuted">{org.owner.email}</p>
              <p className="text-sm text-inkMuted">{org.specialists.length} especialistas vinculados</p>
            </div>
            <form action={toggleOrganizationStatus}>
              <input type="hidden" name="organizationId" value={org.id} />
              <input type="hidden" name="block" value={String(org.status !== 'BLOCKED')} />
              <SubmitButton variant={org.status === 'BLOCKED' ? 'primary' : 'danger'}>
                {org.status === 'BLOCKED' ? 'Desbloquear' : 'Bloquear'}
              </SubmitButton>
            </form>
          </div>
        ))}
        {organizations.length === 0 && (
          <EmptyState>No hay organizaciones registradas aún.</EmptyState>
        )}
      </div>
    </PlatformShell>
  );
}
