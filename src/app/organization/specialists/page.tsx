import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable, StatusBadge } from '@/components/platform/platform-shell';
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
      <Panel title="Incorporar profesional">
        <form action={inviteSpecialist} className="grid gap-4 px-6 py-5 sm:grid-cols-3">
          <Input name="email" label="Email del especialista" type="email" required />
          <Input name="specialty" label="Especialidad" placeholder="Cardiología" />
          <div className="flex items-end">
            <SubmitButton className="w-full">Invitar especialista</SubmitButton>
          </div>
        </form>
      </Panel>

      <div className="mt-5">
        <Panel title="Personal clínico">
          <DataTable
            headers={['Profesional', 'Especialidad', 'Estado', '']}
            empty="Aún no tienes especialistas en tu red."
            rows={specialists.map((member) => ({
              key: member.id,
              cells: [
                member.specialist.fullName ?? member.specialist.email,
                member.specialty ?? 'Sin especialidad',
                <StatusBadge key="status" status={member.status} />,
                <div key="actions" className="flex justify-end gap-2">
                  {member.status !== 'ACTIVE' && (
                    <form action={activateSpecialist}>
                      <input type="hidden" name="specialistId" value={member.specialistId} />
                      <SubmitButton size="sm">Activar</SubmitButton>
                    </form>
                  )}
                  {member.status !== 'REMOVED' && (
                    <form action={removeSpecialist}>
                      <input type="hidden" name="specialistId" value={member.specialistId} />
                      <SubmitButton size="sm" variant="danger">Remover</SubmitButton>
                    </form>
                  )}
                </div>,
              ],
            }))}
          />
        </Panel>
      </div>
    </PlatformShell>
  );
}
