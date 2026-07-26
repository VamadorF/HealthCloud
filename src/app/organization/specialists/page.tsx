import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
import { inviteSpecialist, removeSpecialist, activateSpecialist } from '@/app/organization/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';

export default async function OrganizationSpecialistsPage() {
  const user = await requireRole('ORGANIZATION');

  const organization = await prisma.organization.findUnique({
    where: { ownerId: user.id },
    include: {
      specialists: { include: { specialist: true } },
    },
  });

  const specialists = organization?.specialists ?? [];

  return (
    <PlatformShell
      user={user}
      title="Plantilla médica"
      description="Invita o remueve especialistas de tu red institucional"
    >
      <form
        action={inviteSpecialist}
        className="mb-8 grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-3"
      >
        <Input name="email" label="Email del especialista" type="email" required />
        <Input name="specialty" label="Especialidad" placeholder="Cardiología" />
        <div className="flex items-end">
          <SubmitButton className="w-full">Invitar especialista</SubmitButton>
        </div>
      </form>

      <div className="space-y-4">
        {specialists.map((member) => (
          <div
            key={member.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-ink">{member.specialist.fullName ?? member.specialist.email}</p>
                <StatusBadge status={member.status} />
              </div>
              <p className="mt-1 text-sm text-inkMuted">{member.specialty ?? 'Sin especialidad'}</p>
            </div>
            <div className="flex gap-2">
              {member.status !== 'ACTIVE' && (
                <form action={activateSpecialist}>
                  <input type="hidden" name="specialistId" value={member.specialistId} />
                  <SubmitButton size="sm">Activar</SubmitButton>
                </form>
              )}
              {member.status !== 'REMOVED' && (
                <form action={removeSpecialist}>
                  <input type="hidden" name="specialistId" value={member.specialistId} />
                  <SubmitButton variant="danger" size="sm">Remover</SubmitButton>
                </form>
              )}
            </div>
          </div>
        ))}
        {specialists.length === 0 && (
          <EmptyState>Aún no tienes especialistas en tu red.</EmptyState>
        )}
      </div>
    </PlatformShell>
  );
}
